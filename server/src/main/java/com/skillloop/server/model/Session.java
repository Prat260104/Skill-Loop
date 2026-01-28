package com.skillloop.server.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
public class Session {

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

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Session(User student, User mentor, String skill, SessionStatus status) {
        this.student = student;
        this.mentor = mentor;
        this.skill = skill;
        this.status = status;
    }
}
