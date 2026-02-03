package com.skillloop.server.controller;

import com.skillloop.server.dto.UserSummaryDTO;
import com.skillloop.server.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend to access this
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    // GET /api/recommendations/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<List<UserSummaryDTO>> getRecommendations(@PathVariable Long userId) {
        try {
            List<UserSummaryDTO> recommendations = recommendationService.getRecommendationsForUser(userId);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            // Log error and return empty list or bad request
            // For now, let's return bad request with error message
            return ResponseEntity.badRequest().build();
        }
    }
}
