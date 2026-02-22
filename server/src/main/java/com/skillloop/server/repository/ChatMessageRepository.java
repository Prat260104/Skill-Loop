package com.skillloop.server.repository;

import com.skillloop.server.model.ChatMessage;
import com.skillloop.server.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Fetch all chat messages for a specific session, ordered by time
    List<ChatMessage> findBySessionOrderByTimestampAsc(Session session);
}
