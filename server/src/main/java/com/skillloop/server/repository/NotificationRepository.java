package com.skillloop.server.repository;

import com.skillloop.server.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 1. Unread notifications dhundho (Red Badge Count ke liye)
    // Query: SELECT * FROM notifications WHERE user_id = ? AND is_read = false
    List<Notification> findByRecipientIdAndIsReadFalse(Long recipientId);

    // 2. Saari notifications dhundho (Inbox page ke liye), Latest pehle (DESC)
    // Query: SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
}
