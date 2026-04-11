package com.skillloop.server.service;

import com.skillloop.server.dto.CompleteSessionResponse;
import com.skillloop.server.dto.SentimentResponse;
import com.skillloop.server.dto.SessionRequest;
import com.skillloop.server.exception.ResourceNotFoundException;
import com.skillloop.server.exception.SessionAlreadyCompletedException;
import com.skillloop.server.exception.UnauthorizedSessionAccessException;
import com.skillloop.server.model.Session;
import com.skillloop.server.model.SessionStatus;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.SessionRepository;
import com.skillloop.server.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SessionService {

    /**
     * SLF4J Logger — production-grade logging.
     * 
     * WHY not System.out.println?
     * → println has no timestamps, no log levels, no file output
     * → SLF4J gives us INFO/WARN/ERROR levels, timestamps, and works
     *   with log aggregation tools (ELK, Splunk) in production
     * → We can filter logs by level (e.g., show only ERRORs in prod)
     * 
     * PRIVACY: We NEVER log review text (PII). Only session IDs + outcomes.
     */
    private static final Logger log = LoggerFactory.getLogger(SessionService.class);

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SentimentService sentimentService;

    @Autowired
    private GamificationService gamificationService;

    public Session createSessionRequest(Long studentId, SessionRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User mentor = userRepository.findById(request.getMentorId())
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        if (student.getId().equals(mentor.getId())) {
            throw new RuntimeException("You cannot request a session with yourself!");
        }

        Session session = new Session(student, mentor, request.getSkill(), SessionStatus.PENDING);
        Session savedSession = sessionRepository.save(session);

        // TRIGGER: Notify Mentor
        notificationService.createNotification(
                mentor,
                "New Session Request: " + student.getName() + " wants to learn " + request.getSkill(),
                "INFO");

        return savedSession;
    }

    public List<Session> getSessionsForUser(Long userId) {
        // Get sessions where I am student
        List<Session> learningSessions = sessionRepository.findByStudentId(userId);

        // Get sessions where I am mentor
        List<Session> teachingSessions = sessionRepository.findByMentorId(userId);

        // Combine them
        List<Session> allSessions = new ArrayList<>();
        allSessions.addAll(learningSessions);
        allSessions.addAll(teachingSessions);

        return allSessions;
    }

    public Session acceptSession(Long mentorId, Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getMentor().getId().equals(mentorId)) {
            throw new RuntimeException("You are not the mentor for this session!");
        }

        session.setStatus(SessionStatus.ACCEPTED);
        Session savedSession = sessionRepository.save(session);

        // TRIGGER: Notify Student
        notificationService.createNotification(
                session.getStudent(),
                "Good News! " + session.getMentor().getName() + " accepted your session request.",
                "SUCCESS");

        return savedSession;
    }

    public Session rejectSession(Long mentorId, Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getMentor().getId().equals(mentorId)) {
            throw new RuntimeException("You are not the mentor for this session!");
        }

        session.setStatus(SessionStatus.REJECTED);
        Session savedSession = sessionRepository.save(session);

        // TRIGGER: Notify Student
        notificationService.createNotification(
                session.getStudent(),
                "Update: " + session.getMentor().getName() + " declined your session request.",
                "WARNING");

        return savedSession;
    }

    /**
     * Complete a session: analyze review sentiment, award points, return DTO.
     *
     * WHY return DTO instead of Session entity?
     * → The Session entity contains student & mentor objects with ALL their fields
     *   (including password hashes). Returning it directly = data leak.
     * → The DTO contains ONLY what the frontend needs to display the result.
     */
    public CompleteSessionResponse completeSession(Long studentId, Long sessionId, String review, Integer rating) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found with id: " + sessionId));

        // SECURITY CHECK: Only the Student can mark it as complete
        if (!session.getStudent().getId().equals(studentId)) {
            throw new UnauthorizedSessionAccessException("Only the student can mark a session as complete!");
        }

        // IDEMPOTENCY GUARD: Prevent double-completion
        // WHY? Without this, if the user double-clicks or network retries,
        // the mentor gets double points (50+50=100) — that's a bug!
        if (session.getStatus() == SessionStatus.COMPLETED) {
            throw new SessionAlreadyCompletedException(sessionId);
        }

        if (session.getStatus() != SessionStatus.ACCEPTED) {
            throw new IllegalArgumentException("Only accepted sessions can be completed. Current status: " + session.getStatus());
        }

        // SERVER-SIDE VALIDATION: Validate rating if provided
        // WHY validate on server? Because anyone can bypass frontend and call API directly.
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new IllegalArgumentException("Rating must be between 1 and 5. Received: " + rating);
        }

        // 1. Mark as Completed + Save Rating
        session.setStatus(SessionStatus.COMPLETED);
        if (rating != null) {
            session.setRating(rating);
        }

        // 2. Analyze Review Sentiment (if provided)
        // Track these for the DTO response
        boolean isToxicReview = false;
        boolean reviewSubmitted = false;
        String sentimentLabel = null;

        if (review != null && !review.trim().isEmpty()) {
            reviewSubmitted = true;
            try {
                SentimentResponse sentiment = sentimentService.analyzeSentiment(review);
                session.setReview(review);
                session.setSentimentScore(sentiment.getScore());
                sentimentLabel = sentiment.getLabel(); // "POSITIVE" or "NEGATIVE"

                // Flag toxic reviews for admin review
                if (sentiment.isToxic()) {
                    isToxicReview = true;
                    session.setNeedsReview(true);
                    log.warn("TOXIC REVIEW DETECTED — Session {} flagged for admin review. Score: {}",
                            sessionId, sentiment.getScore());
                }
            } catch (Exception e) {
                log.error("Sentiment analysis failed for session {}: {}", sessionId, e.getMessage());
                // Continue even if sentiment fails - don't block session completion
                session.setReview(review);
                // sentimentLabel stays null → frontend knows ML didn't respond
            }
        }

        // 3. Award Points to Mentor (ONLY if review is NOT toxic)
        boolean pointsAwarded = false;
        User mentor = session.getMentor();
        if (!isToxicReview) {
            mentor.setSkillPoints(mentor.getSkillPoints() + 50); // The Reward
            userRepository.save(mentor);
            pointsAwarded = true;
            log.info("Awarded +50 points to mentor (userId={}) for session {}", mentor.getId(), sessionId);
        } else {
            log.warn("Points withheld for mentor (userId={}) — toxic review on session {}",
                    mentor.getId(), sessionId);
        }

        Session savedSession = sessionRepository.save(session);

        // TRIGGER: Notify Mentor
        if (!isToxicReview) {
            notificationService.createNotification(
                    mentor,
                    "Session Completed! You earned +50 Skill Points for teaching " + session.getStudent().getName(),
                    "SUCCESS");
        } else {
            notificationService.createNotification(
                    mentor,
                    "Session completed but received negative feedback. Under admin review.",
                    "WARNING");
        }

        // TRIGGER: Evaluate Badges
        gamificationService.checkAndAwardSessionBadges(session.getStudent(), savedSession);
        gamificationService.checkAndAwardSessionBadges(mentor, savedSession);

        // 4. Build and return the DTO (not the raw entity!)
        return CompleteSessionResponse.success(
                savedSession.getId(),
                reviewSubmitted,
                sentimentLabel,
                isToxicReview,
                pointsAwarded
        );
    }
}
