package com.skillloop.server.service;

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

    public Session createSessionRequest(Long studentId, SessionRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        User mentor = userRepository.findById(request.getMentorId())
                .orElseThrow(() -> new RuntimeException("Mentor not found"));

        if (student.getId().equals(mentor.getId())) {
            throw new RuntimeException("You cannot request a session with yourself!");
        }

        Session session = new Session(student, mentor, request.getSkill(), SessionStatus.PENDING);
        return sessionRepository.save(session);
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
        return sessionRepository.save(session);
    }

    public Session rejectSession(Long mentorId, Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getMentor().getId().equals(mentorId)) {
            throw new RuntimeException("You are not the mentor for this session!");
        }

        session.setStatus(SessionStatus.REJECTED);
        return sessionRepository.save(session);
    }
}
