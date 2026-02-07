package com.skillloop.server.service;

import com.skillloop.server.dto.GithubProfileRequest;
import com.skillloop.server.model.GithubProfile;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.GithubProfileRepository;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class GithubService {

    @Autowired
    private GithubProfileRepository githubProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public GithubProfile saveProfile(GithubProfileRequest request) {
        // 1. Find User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        // 2. Check if Profile exists based on User
        GithubProfile profile = githubProfileRepository.findByUser(user)
                .orElse(new GithubProfile());

        // 3. Map Fields (DTO -> Entity)
        if (profile.getId() == null) {
            profile.setUser(user); // Set for new profile only
        }
        profile.setUsername(request.getUsername());
        profile.setRepoCount(request.getTopProjectsCount());
        profile.setLanguages(request.getVerifiedLanguages());

        // Map AI Analysis
        if (request.getAiAnalysis() != null) {
            profile.setTechStack(request.getAiAnalysis().getFrameworks());
            profile.setSeniority(request.getAiAnalysis().getSeniority());
            profile.setStrengths(request.getAiAnalysis().getStrengths());
            profile.setSummary(request.getAiAnalysis().getSummary());
        }

        // 4. Update User's Verified Skills (Smart Logic)
        updateUserVerifiedSkills(user, request);

        // 5. Save Logic
        return githubProfileRepository.save(profile);
    }

    private void updateUserVerifiedSkills(User user, GithubProfileRequest request) {
        // Combine Languages + Tech Stack
        Set<String> newSkills = new HashSet<>();

        if (request.getVerifiedLanguages() != null) {
            newSkills.addAll(request.getVerifiedLanguages());
        }

        if (request.getAiAnalysis() != null && request.getAiAnalysis().getFrameworks() != null) {
            newSkills.addAll(request.getAiAnalysis().getFrameworks());
        }

        // Add to existing user skills without duplicates
        List<String> currentSkills = user.getVerifiedSkills();
        if (currentSkills == null) {
            currentSkills = new ArrayList<>();
        }

        for (String skill : newSkills) {
            if (!currentSkills.contains(skill)) {
                currentSkills.add(skill);
            }
        }

        user.setVerifiedSkills(currentSkills);
        // User is saved automatically due to Transactional context or explicit save
        userRepository.save(user);
    }
}
