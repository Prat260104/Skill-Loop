package com.skillloop.server.service;

import com.skillloop.server.model.Badge;
import com.skillloop.server.model.Session;
import com.skillloop.server.model.User;
import com.skillloop.server.model.SessionStatus;
import com.skillloop.server.repository.SessionRepository;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class GamificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private NotificationService notificationService;

    public void checkAndAwardSessionBadges(User user, Session session) {
        boolean newlyAwarded = false;

        // 1. ICEBREAKER (Award on first session completion)
        if (!user.getBadges().contains(Badge.ICEBREAKER)) {
            user.addBadge(Badge.ICEBREAKER);
            notifyBadgeUnlock(user, "Icebreaker");
            newlyAwarded = true;
        }

        // 2. NIGHT_OWL & EARLY_BIRD
        if (session.getUpdatedAt() != null) {
            LocalTime time = session.getUpdatedAt().toLocalTime();
            int hour = time.getHour();

            if ((hour >= 23 || hour < 5) && !user.getBadges().contains(Badge.NIGHT_OWL)) {
                user.addBadge(Badge.NIGHT_OWL);
                notifyBadgeUnlock(user, "Night Owl");
                newlyAwarded = true;
            } else if (hour >= 5 && hour < 9 && !user.getBadges().contains(Badge.EARLY_BIRD)) {
                user.addBadge(Badge.EARLY_BIRD);
                notifyBadgeUnlock(user, "Early Bird");
                newlyAwarded = true;
            }
        }

        // 3. FIVE_STAR
        if (!user.getBadges().contains(Badge.FIVE_STAR)) {
            // Count completed sessions where user is mentor with positive sentiment
            List<Session> mentorSessions = sessionRepository.findByMentorId(user.getId());
            long veryPositiveSessions = mentorSessions.stream()
                .filter(s -> s.getStatus() == SessionStatus.COMPLETED)
                .filter(s -> s.getSentimentScore() != null && s.getSentimentScore() >= 0.7)
                .count();

            if (veryPositiveSessions >= 5) {
                user.addBadge(Badge.FIVE_STAR);
                notifyBadgeUnlock(user, "Five Star Mentor");
                newlyAwarded = true;
            }
        }

        if (newlyAwarded) {
             userRepository.save(user);
        }
    }

    public void checkAndAwardGithubBadge(User user, int languageCount) {
        if (languageCount >= 3 && !user.getBadges().contains(Badge.CODE_NINJA)) {
            user.addBadge(Badge.CODE_NINJA);
            notifyBadgeUnlock(user, "Code Ninja");
            userRepository.save(user);
        }
    }

    private void notifyBadgeUnlock(User user, String badgeName) {
        notificationService.createNotification(
            user,
            "Congratulations! You've unlocked the " + badgeName + " badge \uD83C\uDFC6",
            "SUCCESS"
        );
    }
}
