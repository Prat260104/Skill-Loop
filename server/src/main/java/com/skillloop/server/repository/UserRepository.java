package com.skillloop.server.repository;

import com.skillloop.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Finder method to check if email exists (useful for login/signup)
    Optional<User> findByEmail(String email);

    // Check if email exists
    Boolean existsByEmail(String email);

    // Leaderboard Magic Query: "Get Top 10 users sorted by Skill Points"
    java.util.List<User> findTop10ByOrderBySkillPointsDesc();

    // Churn Prediction: Find users who haven't logged in since a specific date
    java.util.List<User> findByLastLoginDateBefore(java.time.LocalDateTime date);
}
