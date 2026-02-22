package com.skillloop.server.service;

import com.skillloop.server.model.ChatMessage;
import com.skillloop.server.model.Session;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.ChatMessageRepository;
import com.skillloop.server.repository.SessionRepository;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Validates if a message can be sent, saves it, and returns the saved message.
     */
    public ChatMessage saveMessage(Long senderId, Long receiverId, Long sessionId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // 1. Ensure the session exists
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // 2. Ensure the session is strictly ACCEPTED
        if (session.getStatus() != com.skillloop.server.model.SessionStatus.ACCEPTED) {
            throw new RuntimeException("Cannot send messages unless session is ACCEPTED");
        }

        // 3. Create and save the message
        ChatMessage message = new ChatMessage(sender, receiver, session, content);
        return chatMessageRepository.save(message);
    }

    /**
     * Retrieves the chat history between two connected users.
     */
    public List<ChatMessage> getChatHistory(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        return chatMessageRepository.findBySessionOrderByTimestampAsc(session);
    }
}
