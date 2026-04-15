package com.skillloop.server.controller;

import com.skillloop.server.dto.AuthResponse;
import com.skillloop.server.dto.LoginRequest;
import com.skillloop.server.dto.SignupRequest;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import com.skillloop.server.security.JwtTokenProvider;
import com.skillloop.server.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Allow React to talk to us
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Signup endpoint
     * Returns: User info + JWT token
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            log.info("Signup request for email: {}", signupRequest.getEmail());

            // Register user and get JWT token
            String[] result = authService.registerUser(signupRequest);
            Long userId = Long.parseLong(result[0]);
            String token = result[1];

            // Fetch user to get complete info
            User registeredUser = userRepository.findById(userId).orElseThrow();

            // Check if profile is complete
            boolean isProfileComplete = registeredUser.getSkillsOffered() != null
                    && !registeredUser.getSkillsOffered().isEmpty();

            // Build response with JWT token
            AuthResponse response = new AuthResponse(
                    registeredUser.getId(),
                    registeredUser.getName(),
                    registeredUser.getEmail(),
                    registeredUser.getRole(),
                    isProfileComplete,
                    token,
                    jwtTokenProvider.getExpirationMs(),
                    "Bearer"
            );

            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            log.error("Signup failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Login endpoint
     * Returns: User info + JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login request for email: {}", loginRequest.getEmail());

            // Login user and get JWT token
            String[] result = authService.loginUser(loginRequest);
            Long userId = Long.parseLong(result[0]);
            String token = result[1];

            // Fetch user to get complete info
            User loggedInUser = userRepository.findById(userId).orElseThrow();

            // Check if profile is complete
            boolean isProfileComplete = loggedInUser.getSkillsOffered() != null
                    && !loggedInUser.getSkillsOffered().isEmpty();

            // Build response with JWT token
            AuthResponse response = new AuthResponse(
                    loggedInUser.getId(),
                    loggedInUser.getName(),
                    loggedInUser.getEmail(),
                    loggedInUser.getRole(),
                    isProfileComplete,
                    token,
                    jwtTokenProvider.getExpirationMs(),
                    "Bearer"
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Login failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * TEST ENDPOINT: Simulate inactivity for a user
     */
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
