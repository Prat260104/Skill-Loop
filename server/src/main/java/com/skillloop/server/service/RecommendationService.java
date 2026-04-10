package com.skillloop.server.service;

import com.skillloop.server.dto.RecommendationRequest;
import com.skillloop.server.dto.UserSummaryDTO;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    // ML Service URL - externalized to application.properties
    @Value("${ml.service.url:http://localhost:8001}")
    private String mlServiceUrl;

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
            // Call Python ML Service
            String url = mlServiceUrl + "/api/v1/recommend/match";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

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
                user.getVerifiedSkills(),
                user.getBadges(),
                user.getDepartment());
    }

    private UserSummaryDTO convertMapToDTO(Map<String, Object> map) {
        // Safe casting helper for data coming back from JSON (Python uses snake_case)
        Long id = ((Number) map.get("id")).longValue();
        String name = (String) map.get("name");
        String email = (String) map.get("email");
        String bio = (String) map.get("bio");
        List<String> skillsOffered = (List<String>) map.get("skills_offered");
        List<String> skillsWanted = (List<String>) map.get("skills_wanted");
        List<String> experience = (List<String>) map.get("experience");

        // Handle skill_points which might be skillPoints or skill_points depending on
        // serialization
        // Since we used .dict() in python, it's likely skill_points
        int skillPoints = 0;
        if (map.containsKey("skill_points") && map.get("skill_points") != null) {
            skillPoints = ((Number) map.get("skill_points")).intValue();
        } else if (map.containsKey("skillPoints") && map.get("skillPoints") != null) {
            skillPoints = ((Number) map.get("skillPoints")).intValue();
        }

        String role = (String) map.get("role");
        List<String> verifiedSkills = (List<String>) map.get("verified_skills");

        // Convert Score (0.0 to 1.0) to Percentage (0 to 100)
        // Python sends 'match_score' (0-100 already? Let's check recommender.py)
        // recommender.py: candidate['match_score'] = round(score * 100, 1)
        // So it's already percentage!
        Double matchScore = 0.0;
        if (map.containsKey("match_score") && map.get("match_score") != null) {
            matchScore = ((Number) map.get("match_score")).doubleValue();
        }

        java.util.Set<com.skillloop.server.model.Badge> badges = new java.util.HashSet<>();

        // Python ML isn't currently configured to send department back, default to null or extract
        String department = null;
        if (map.containsKey("department") && map.get("department") != null) {
            department = (String) map.get("department");
        }

        return new UserSummaryDTO(id, name, email, bio, skillsOffered, skillsWanted, experience, skillPoints, role,
                verifiedSkills, matchScore, badges, department);
    }
}
