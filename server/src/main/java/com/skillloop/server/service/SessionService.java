package com.skillloop.server.service;

import com.skillloop.server.dto.SentimentResponse;
import com.skillloop.server.dto.SessionRequest;
import com.skillloop.server.model.Session;
import com.skillloop.server.model.SessionStatus;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.SessionRepository;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private SentimentService sentimentService;

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

    public Session completeSession(Long studentId, Long sessionId, String review) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Only the Student can mark it as complete (to prevent cheating)
        if (!session.getStudent().getId().equals(studentId)) {
            throw new RuntimeException("Only the student can mark a session as complete!");
        }

        if (session.getStatus() != SessionStatus.ACCEPTED) {
            throw new RuntimeException("Only accepted sessions can be completed.");
        }

        // 1. Mark as Completed
        session.setStatus(SessionStatus.COMPLETED);

        // 2. Analyze Review Sentiment (if provided)
        boolean isToxicReview = false;
        if (review != null && !review.trim().isEmpty()) {
            try {
                SentimentResponse sentiment = sentimentService.analyzeSentiment(review);
                session.setReview(review);
                session.setSentimentScore(sentiment.getScore());

                // Flag toxic reviews for admin review
                if (sentiment.isToxic()) {
                    isToxicReview = true;
                    session.setNeedsReview(true);
                    System.out.println("⚠️  TOXIC REVIEW DETECTED! Session " + sessionId +
                            " flagged for admin review. Score: " + sentiment.getScore());
                    System.out.println("❌ No points awarded due to toxic review");
                }
            } catch (Exception e) {
                System.err.println("Sentiment analysis failed for session " + sessionId + ": " + e.getMessage());
                // Continue even if sentiment fails - don't block session completion
                session.setReview(review);
            }
        }

        // 3. Award Points to Mentor (ONLY if review is NOT toxic)
        User mentor = session.getMentor();
        if (!isToxicReview) {
            mentor.setSkillPoints(mentor.getSkillPoints() + 50); // The Reward
            userRepository.save(mentor);
            System.out.println("✅ Awarded +50 points to " + mentor.getName());
        } else {
            System.out.println("⚠️  Points withheld for " + mentor.getName() + " due to toxic review");
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

        return savedSession;
    }
}
