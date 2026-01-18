package com.skillloop.server.service;

import com.skillloop.server.dto.SignupRequest;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(SignupRequest request) {
        // 1. Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // 2. Create User
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // TODO: Hash this password in Day 10. Saving plain text for Day 9 verification
        // only.
        user.setPassword(request.getPassword());

        user.setRole("STUDENT"); // Default role

        // 3. Save to DB
        return userRepository.save(user);
    }
}
