package com.skillloop.server.repository;

import com.skillloop.server.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    // Find sessions where I am the student
    List<Session> findByStudentId(Long studentId);

    // Find sessions where I am the mentor
    // Find sessions where I am the mentor
    List<Session> findByMentorId(Long mentorId);

    // Count sessions (For Churn Prediction Metrics)
    int countByStudentId(Long studentId);

    int countByMentorId(Long mentorId);
}
