package com.skillloop.server.controller;

import com.skillloop.server.dto.AuthResponse;
import com.skillloop.server.dto.LoginRequest;
import com.skillloop.server.dto.SignupRequest;
import com.skillloop.server.model.User;
import com.skillloop.server.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow React to talk to us
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            User registeredUser = authService.registerUser(signupRequest);

            // New users definitely have empty profiles
            AuthResponse response = new AuthResponse(
                    registeredUser.getId(),
                    registeredUser.getName(),
                    registeredUser.getEmail(),
                    registeredUser.getRole(),
                    false);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Autowired
    private com.skillloop.server.repository.UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            User loggedInUser = authService.loginUser(loginRequest);

            // Check if profile is complete (Has at least one skill offered)
            boolean isProfileComplete = loggedInUser.getSkillsOffered() != null
                    && !loggedInUser.getSkillsOffered().isEmpty();

            AuthResponse response = new AuthResponse(
                    loggedInUser.getId(),
                    loggedInUser.getName(),
                    loggedInUser.getEmail(),
                    loggedInUser.getRole(),
                    isProfileComplete);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // TEST ENDPOINT: Simulate inactivity for a user
    @PostMapping("/test/age-user")
    public ResponseEntity<?> ageUser(@RequestParam String email, @RequestParam int days) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLoginDate(java.time.LocalDateTime.now().minusDays(days));
        userRepository.save(user);

        return ResponseEntity
                .ok("User " + email + " aged by " + days + " days. Churn Scheduler should pick them up soon.");
    }
}
