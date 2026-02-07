package com.skillloop.server.repository;

import com.skillloop.server.model.GithubProfile;
import com.skillloop.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GithubProfileRepository extends JpaRepository<GithubProfile, Long> {
    Optional<GithubProfile> findByUser(User user);
}
