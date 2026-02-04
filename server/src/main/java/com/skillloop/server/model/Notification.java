package com.skillloop.server.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message; // "Prateek requested a session!"

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User recipient; // Kisko bhejna hai? (Link to User table)

    private String type; // "INFO", "SUCCESS", "WARNING" (Color coding ke liye)

    private boolean isRead = false; // Default: Not read (Red Badge dikhega)

    @CreationTimestamp
    private LocalDateTime createdAt; // Kab bani ye notification?

    // Default Constructor
    public Notification() {
    }

    // Custom Constructor (Easier creation)
    public Notification(String message, User recipient, String type) {
        this.message = message;
        this.recipient = recipient;
        this.type = type;
        this.isRead = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getRecipient() {
        return recipient;
    }

    public void setRecipient(User recipient) {
        this.recipient = recipient;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
