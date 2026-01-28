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

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody ProfileRequest profileRequest) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setBio(profileRequest.getBio());
                    user.setSkillsOffered(profileRequest.getSkillsOffered());
                    user.setSkillsWanted(profileRequest.getSkillsWanted());

                    // Award some basic skill points for completing profile
                    if (user.getSkillPoints() == 0) {
                        user.setSkillPoints(10);
                    }

                    userRepository.save(user);
                    return ResponseEntity.ok("Profile updated successfully!");
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
                        user.getSkillPoints(),
                        user.getRole()))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(users);
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
                        user.getSkillPoints(),
                        user.getRole()))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(users);
    }
}
