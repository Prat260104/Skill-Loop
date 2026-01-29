package com.skillloop.server.controller;

import com.skillloop.server.dto.ProfileRequest;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private com.skillloop.server.service.ResumeService resumeService;

        @PostMapping("/{id}/resume")
        public ResponseEntity<?> uploadResume(@PathVariable Long id,
                        @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
                try {
                        com.skillloop.server.dto.ResumeResponseDTO parsedData = resumeService.parseResume(file);
                        // In a real app, we would save this data to the user profile here.
                        // For now, we return it to the frontend for verification.
                        return ResponseEntity.ok(parsedData);
                } catch (java.io.IOException e) {
                        return ResponseEntity.badRequest().body("Failed to process file: " + e.getMessage());
                } catch (Exception e) {
                        return ResponseEntity.status(500).body("ML Service Error: " + e.getMessage());
                }
        }

        @PutMapping("/{id}/profile")
        public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody ProfileRequest profileRequest) {
                return userRepository.findById(id)
                                .map(user -> {
                                        user.setBio(profileRequest.getBio());
                                        user.setSkillsOffered(profileRequest.getSkillsOffered());
                                        user.setSkillsWanted(profileRequest.getSkillsWanted());
                                        user.setExperience(profileRequest.getExperience());

                                        // Award some basic skill points for completing profile
                                        if (user.getSkillPoints() == 0) {
                                                user.setSkillPoints(10);
                                        }

                                        userRepository.save(user);
                                        return ResponseEntity
                                                        .ok(java.util.Collections.singletonMap("message",
                                                                        "Profile updated successfully!"));
                                })
                                .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping
        public ResponseEntity<java.util.List<com.skillloop.server.dto.UserSummaryDTO>> getAllUsers() {
                java.util.List<com.skillloop.server.dto.UserSummaryDTO> users = userRepository.findAll().stream()
                                .map(user -> new com.skillloop.server.dto.UserSummaryDTO(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getBio(),
                                                user.getSkillsOffered(),
                                                user.getSkillsWanted(),
                                                user.getExperience(),
                                                user.getSkillPoints(),
                                                user.getRole()))
                                .collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok(users);
        }

        @GetMapping("/{id}")
        public ResponseEntity<com.skillloop.server.dto.UserSummaryDTO> getUserById(@PathVariable Long id) {
                return userRepository.findById(id)
                                .map(user -> new com.skillloop.server.dto.UserSummaryDTO(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getBio(),
                                                user.getSkillsOffered(),
                                                user.getSkillsWanted(),
                                                user.getExperience(),
                                                user.getSkillPoints(),
                                                user.getRole()))
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping("/leaderboard")
        public ResponseEntity<java.util.List<com.skillloop.server.dto.UserSummaryDTO>> getLeaderboard() {
                java.util.List<com.skillloop.server.dto.UserSummaryDTO> users = userRepository
                                .findTop10ByOrderBySkillPointsDesc().stream()
                                .map(user -> new com.skillloop.server.dto.UserSummaryDTO(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getBio(),
                                                user.getSkillsOffered(),
                                                user.getSkillsWanted(),
                                                user.getExperience(),
                                                user.getSkillPoints(),
                                                user.getRole()))
                                .collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok(users);
        }
}
