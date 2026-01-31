package com.skillloop.server.controller;

import com.skillloop.server.dto.InterviewPayload;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = "http://localhost:5173")
public class VerificationController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    private final String ML_SERVICE_URL = "http://localhost:8000/api/v1/interview";

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuestion(@RequestBody InterviewPayload.QuestionRequest request) {
        try {
            // Forward to ML Service
            return restTemplate.postForEntity(ML_SERVICE_URL + "/generate", request, Map.class);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("ML Service Error: " + e.getMessage());
        }
    }

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluateAnswer(@RequestBody InterviewPayload.AnswerRequest request) {
        try {
            // 1. Get Evaluation from ML Service
            ResponseEntity<Map> response = restTemplate.postForEntity(ML_SERVICE_URL + "/evaluate", request, Map.class);
            Map<String, Object> body = response.getBody();

            if (body != null && body.containsKey("is_verified") && (Boolean) body.get("is_verified")) {
                // 2. If Verified, Update User in DB
                Long userId = request.getUserId();
                String skill = request.getSkill();

                if (userId != null && skill != null) {
                    userRepository.findById(userId).ifPresent(user -> {
                        List<String> verified = user.getVerifiedSkills();
                        if (verified == null)
                            verified = new ArrayList<>();

                        if (!verified.contains(skill)) {
                            verified.add(skill);
                            user.setVerifiedSkills(verified);

                            // Bonus Points
                            user.setSkillPoints(user.getSkillPoints() + 50);

                            userRepository.save(user);
                        }
                    });
                }
            }

            return ResponseEntity.ok(body);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Evaluation Error: " + e.getMessage());
        }
    }
}
