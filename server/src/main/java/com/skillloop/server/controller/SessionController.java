package com.skillloop.server.controller;

import com.skillloop.server.dto.SessionRequest;
import com.skillloop.server.model.Session;
import com.skillloop.server.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    // 1. Request a Session (Student asks Mentor)
    @PostMapping("/request/{studentId}")
    public ResponseEntity<?> requestSession(@PathVariable Long studentId, @RequestBody SessionRequest request) {
        try {
            Session session = sessionService.createSessionRequest(studentId, request);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Get All My Sessions (Both Learning & Teaching)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Session>> getMySessions(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getSessionsForUser(userId));
    }

    // 3. Accept a Session (Mentor says Yes)
    @PutMapping("/{sessionId}/accept/{mentorId}")
    public ResponseEntity<?> acceptSession(@PathVariable Long sessionId, @PathVariable Long mentorId) {
        try {
            Session session = sessionService.acceptSession(mentorId, sessionId);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. Reject a Session
    @PutMapping("/{sessionId}/reject/{mentorId}")
    public ResponseEntity<?> rejectSession(@PathVariable Long sessionId, @PathVariable Long mentorId) {
        try {
            Session session = sessionService.rejectSession(mentorId, sessionId);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. Mark Session Complete (Award Points)
    @PutMapping("/{sessionId}/complete/{studentId}")
    public ResponseEntity<?> completeSession(@PathVariable Long sessionId, @PathVariable Long studentId) {
        try {
            Session session = sessionService.completeSession(studentId, sessionId);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
