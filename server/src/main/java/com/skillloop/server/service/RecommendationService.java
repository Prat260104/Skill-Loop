package com.skillloop.server.service;

import com.skillloop.server.dto.RecommendationRequest;
import com.skillloop.server.dto.UserSummaryDTO;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private UserRepository userRepository;

    // Python Service URL
    private static final String ML_SERVICE_URL = "http://localhost:8000/api/v1/recommend/match";

    public List<UserSummaryDTO> getRecommendationsForUser(Long userId) {
        // 1. Fetch Target User
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Fetch All Candidates (Everyone except target user)
        List<User> allUsers = userRepository.findAll();
        List<UserSummaryDTO> candidates = allUsers.stream()
                .filter(u -> !u.getId().equals(userId)) // Exclude self
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        if (candidates.isEmpty()) {
            return new ArrayList<>();
        }

        // 3. Prepare Payload for Python
        UserSummaryDTO targetDTO = convertToDTO(targetUser);
        RecommendationRequest payload = new RecommendationRequest(targetDTO, candidates, 5);

        // 4. Call Python API
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<RecommendationRequest> request = new HttpEntity<>(payload, headers);

        try {
            // We get a weird response structure from Python: {"matches": [ ... ]}
            // So we need to parse it carefully.
            ResponseEntity<Map> response = restTemplate.postForEntity(ML_SERVICE_URL, request, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("matches")) {
                List<Map<String, Object>> matches = (List<Map<String, Object>>) response.getBody().get("matches");

                // Convert back to DTOs
                return matches.stream()
                        .map(this::convertMapToDTO)
                        .collect(Collectors.toList());
            }

        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("ML Service Failed: " + e.getMessage());
            // Fallback: Return raw list if ML fails? Or empty?
            // Let's return empty for now to show something is wrong.
        }

        return new ArrayList<>();
    }

    private UserSummaryDTO convertToDTO(User user) {
        return new UserSummaryDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBio(),
                user.getSkillsOffered(),
                user.getSkillsWanted(),
                user.getExperience(),
                user.getSkillPoints(),
                user.getRole(),
                user.getVerifiedSkills());
    }

    private UserSummaryDTO convertMapToDTO(Map<String, Object> map) {
        // Safe casting helper for data coming back from JSON
        Long id = ((Number) map.get("id")).longValue();
        String name = (String) map.get("name");
        String email = (String) map.get("email");
        String bio = (String) map.get("bio");
        List<String> skillsOffered = (List<String>) map.get("skillsOffered");
        List<String> skillsWanted = (List<String>) map.get("skillsWanted");
        List<String> experience = (List<String>) map.get("experience");
        int skillPoints = map.get("skillPoints") != null ? ((Number) map.get("skillPoints")).intValue() : 0;
        String role = (String) map.get("role");
        List<String> verifiedSkills = (List<String>) map.get("verifiedSkills");

        // Convert Score (0.0 to 1.0) to Percentage (0 to 100)
        Double rawScore = map.get("score") != null ? ((Number) map.get("score")).doubleValue() : 0.0;
        Double matchScore = Math.round(rawScore * 100.0 * 10.0) / 10.0; // Round to 1 decimal

        return new UserSummaryDTO(id, name, email, bio, skillsOffered, skillsWanted, experience, skillPoints, role,
                verifiedSkills, matchScore);
    }
}
