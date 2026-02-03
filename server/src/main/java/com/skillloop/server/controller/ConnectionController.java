package com.skillloop.server.controller;

import com.skillloop.server.model.ConnectionRequest;
import com.skillloop.server.model.ConnectionStatus;
import com.skillloop.server.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:5173")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    // Send a connection request
    @PostMapping("/send")
    public ResponseEntity<?> sendRequest(@RequestParam Long senderId, @RequestParam Long receiverId) {
        try {
            ConnectionRequest request = connectionService.sendConnectionRequest(senderId, receiverId);
            return ResponseEntity.ok(request);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Accept a request
    @PutMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptRequest(@PathVariable Long requestId) {
        try {
            connectionService.acceptRequest(requestId);
            return ResponseEntity.ok("Request Accepted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Reject a request
    @PutMapping("/reject/{requestId}")
    public ResponseEntity<?> rejectRequest(@PathVariable Long requestId) {
        try {
            connectionService.rejectRequest(requestId);
            return ResponseEntity.ok("Request Rejected");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get status between two users (for the button state)
    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@RequestParam Long senderId, @RequestParam Long receiverId) {
        try {
            ConnectionStatus status = connectionService.getConnectionStatus(senderId, receiverId);
            return ResponseEntity.ok(Map.of("status", status != null ? status : "NONE"));
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Map.of("status", "NONE"));
        }
    }

    // Get pending requests for a user (Incoming)
    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<ConnectionRequest>> getPendingRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(connectionService.getPendingRequests(userId));
    }
}
