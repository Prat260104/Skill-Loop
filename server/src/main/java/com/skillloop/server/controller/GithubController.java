package com.skillloop.server.controller;

import com.skillloop.server.dto.GithubProfileRequest;
import com.skillloop.server.model.GithubProfile;
import com.skillloop.server.service.GithubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend
public class GithubController {

    @Autowired
    private GithubService githubService;

    @PostMapping("/save")
    public ResponseEntity<?> saveProfile(@RequestBody GithubProfileRequest request) {
        try {
            GithubProfile savedProfile = githubService.saveProfile(request);
            return ResponseEntity.ok(savedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
}
