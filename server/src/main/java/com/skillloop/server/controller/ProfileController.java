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
}
