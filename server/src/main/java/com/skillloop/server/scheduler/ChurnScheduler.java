package com.skillloop.server.scheduler;

import com.skillloop.server.model.User;
import com.skillloop.server.repository.SessionRepository;
import com.skillloop.server.repository.UserRepository;
import com.skillloop.server.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ChurnScheduler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private NotificationService notificationService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String ML_SERVICE_URL = "http://localhost:8001/api/v1/churn/predict";

    // Run every day at 2:00 AM
    // Cron: Second Minute Hour Day Month Weekday
    // TEST MODE: Run every 60 seconds
    // @Scheduled(cron = "0 0 2 * * ?")
    @Scheduled(fixedRate = 60000)
    public void runChurnPredictionJob() {
        System.out.println("🕵️‍♂️ Starting Churn Prediction Job: Analyzing User Behavior...");

        // 1. Identify Target Users: Inactive for > 15 days
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(15);
        List<User> atRiskUsers = userRepository.findByLastLoginDateBefore(cutoffDate);

        System.out.println("📊 Found " + atRiskUsers.size() + " potentially inactive users.");

        int churnRiskCount = 0;

        for (User user : atRiskUsers) {
            try {
                // 2. Prepare Data for ML Model
                long daysSinceLogin = ChronoUnit.DAYS.between(user.getLastLoginDate(), LocalDateTime.now());
                int sessionsAttended = sessionRepository.countByStudentId(user.getId()) +
                        sessionRepository.countByMentorId(user.getId());
                int profileScore = calculateProfileScore(user);

                // 3. Call ML Service
                Map<String, Object> request = new HashMap<>();
                request.put("user_id", user.getId());
                request.put("days_since_login", daysSinceLogin);
                request.put("sessions_attended", sessionsAttended);
                request.put("profile_score", profileScore);

                // Expecting response: { "churn_probability": 0.85, "is_high_risk": true,
                // "message": "..." }
                @SuppressWarnings("unchecked")
                Map<String, Object> response = restTemplate.postForObject(ML_SERVICE_URL, request, Map.class);

                if (response != null && (Boolean) response.get("is_high_risk")) {
                    // 4. Action: Send Notification
                    String message = "Hey " + user.getName() + "! We noticed you've been away. " +
                            "Your mentors are waiting! Come back and learn something new. 🚀";

                    notificationService.createNotification(user, message, "WARNING");
                    churnRiskCount++;
                    System.out.println("⚠️ High Risk User Identified: " + user.getName() + " (Prob: "
                            + response.get("churn_probability") + ")");
                }

            } catch (Exception e) {
                System.err.println("❌ Error processing user " + user.getId() + ": " + e.getMessage());
            }
        }

        System.out.println("✅ Churn Job Completed. Sent re-engagement alerts to " + churnRiskCount + " users.");
    }

    private int calculateProfileScore(User user) {
        int score = 0;
        if (user.getBio() != null && !user.getBio().isEmpty())
            score += 20;
        if (user.getSkillsOffered() != null)
            score += user.getSkillsOffered().size() * 10;
        if (user.getExperience() != null)
            score += user.getExperience().size() * 15;
        if (user.getVerifiedSkills() != null)
            score += user.getVerifiedSkills().size() * 10;
        return Math.min(score, 100);
    }
}
