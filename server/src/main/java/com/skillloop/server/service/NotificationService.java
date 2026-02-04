package com.skillloop.server.service;

import com.skillloop.server.model.Notification;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.NotificationRepository;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // 1. Create Notification (Used by other services)
    public void createNotification(User recipient, String message, String type) {
        Notification notification = new Notification(message, recipient, type);
        notificationRepository.save(notification);
    }

    // 2. Create Notification by User ID (Overloaded method for convenience)
    public void createNotification(Long recipientId, String message, String type) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        createNotification(recipient, message, type);
    }

    // 3. Get All Notifications for User (Sorted Newest First)
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    // 4. Get Unread Count (For Red Badge)
    public long getUnreadCount(Long userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalse(userId).size();
    }

    // 5. Mark as Read (When user clicks)
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
