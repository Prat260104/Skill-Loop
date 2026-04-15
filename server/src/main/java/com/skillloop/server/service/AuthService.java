package com.skillloop.server.service;

import com.skillloop.server.dto.LoginRequest;
import com.skillloop.server.dto.SignupRequest;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import com.skillloop.server.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register new user with BCrypt password hashing
     */
    @Transactional
    public String[] registerUser(SignupRequest request) {
        // 1. Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // 2. Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // IMPORTANT: Hash password with BCrypt before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole("STUDENT"); // Default role

        // 3. Save to DB
        User savedUser = userRepository.save(user);

        log.info("User registered: {}", savedUser.getId());

        // 4. Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());

        // Return both user ID and token
        return new String[]{String.valueOf(savedUser.getId()), token};
    }

    /**
     * Login user with password validation
     */
    @Transactional(readOnly = true)
    public String[] loginUser(LoginRequest request) {
        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        // 2. IMPORTANT: Use passwordEncoder.matches() to validate against BCrypt hash
        // Never compare passwords directly!
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Error: Invalid password!");
        }

        // 3. Update Last Login Date (For Churn Prediction)
        user.setLastLoginDate(java.time.LocalDateTime.now());
        userRepository.save(user);

        log.info("User logged in: {}", user.getId());

        // 4. Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());

        // Return both user ID and token
        return new String[]{String.valueOf(user.getId()), token};
    }

    /**
     * Get user by ID (used by controllers after JWT validation)
     */
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}
