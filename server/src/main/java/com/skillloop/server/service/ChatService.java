package com.skillloop.server.service;

import com.skillloop.server.model.ChatMessage;
import com.skillloop.server.model.ConnectionRequest;
import com.skillloop.server.model.ConnectionStatus;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.ChatMessageRepository;
import com.skillloop.server.repository.ConnectionRepository;
import com.skillloop.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Validates if a message can be sent, saves it, and returns the saved message.
     */
    public ChatMessage saveMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // 1. Ensure the connection exists
        ConnectionRequest connection = connectionRepository.findBySenderAndReceiver(sender, receiver)
                .orElseGet(() -> connectionRepository.findBySenderAndReceiver(receiver, sender)
                        .orElseThrow(() -> new RuntimeException("No connection found between users")));

        // 2. Ensure the connection is strictly ACCEPTED
        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
            throw new RuntimeException("Cannot send messages unless connection is ACCEPTED");
        }

        // 3. Create and save the message
        ChatMessage message = new ChatMessage(sender, receiver, connection, content);
        return chatMessageRepository.save(message);
    }

    /**
     * Retrieves the chat history between two connected users.
     */
    public List<ChatMessage> getChatHistory(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("User 1 not found"));
        User user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("User 2 not found"));

        var connectionOpt = connectionRepository.findBySenderAndReceiver(user1, user2)
                .or(() -> connectionRepository.findBySenderAndReceiver(user2, user1));

        if (connectionOpt.isEmpty()) {
            return new java.util.ArrayList<>();
        }

        return chatMessageRepository.findByConnectionOrderByTimestampAsc(connectionOpt.get());
    }
}
