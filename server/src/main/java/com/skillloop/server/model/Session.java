package com.skillloop.server.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {

    public Session() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The person who requested to LEARN
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    // The person who will TEACH
    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @Column(nullable = false)
    private String skill;

    // PENDING, ACCEPTED, REJECTED, etc.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status;

    private LocalDateTime scheduledTime;

    // Session Review & Sentiment Analysis
    @Column(columnDefinition = "TEXT")
    private String review; // Student's review/feedback after session

    private Double sentimentScore; // -1 to +1 (from ML service)

    private Boolean needsReview = false; // Flag for toxic reviews

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Session(User student, User mentor, String skill, SessionStatus status) {
        this.student = student;
        this.mentor = mentor;
        this.skill = skill;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public User getMentor() {
        return mentor;
    }

    public void setMentor(User mentor) {
        this.mentor = mentor;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Sentiment Analysis Getters/Setters

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Double getSentimentScore() {
        return sentimentScore;
    }

    public void setSentimentScore(Double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }

    public Boolean getNeedsReview() {
        return needsReview;
    }

    public void setNeedsReview(Boolean needsReview) {
        this.needsReview = needsReview;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        Session session = (Session) o;

        if (id != null ? !id.equals(session.id) : session.id != null)
            return false;
        return true;
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Session{" +
                "id=" + id +
                ", student=" + student +
                ", mentor=" + mentor +
                ", skill='" + skill + '\'' +
                ", status=" + status +
                ", scheduledTime=" + scheduledTime +
                ", createdAt=" + createdAt +
                '}';
    }
}
