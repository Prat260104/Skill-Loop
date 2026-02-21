package com.skillloop.server.controller;

import com.skillloop.server.dto.ChatMessageRequest;
import com.skillloop.server.model.ChatMessage;
import com.skillloop.server.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Handles live messages coming through the WebSocket connection
     * "ws://.../app/chat.sendMessage"
     */
    @MessageMapping("/chat.sendMessage")
    public void processMessage(@Payload ChatMessageRequest chatMessageRequest) {

        // 1. Save the message to the database via our service (acts as validation too)
        ChatMessage savedMsg = chatService.saveMessage(
                chatMessageRequest.getSenderId(),
                chatMessageRequest.getReceiverId(),
                chatMessageRequest.getContent());

        // 2. Broadcast it immediately to the receiver's private queue
        // STOMP Destination: /user/{receiverId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMsg.getReceiver().getId()),
                "/queue/messages",
                savedMsg);
    }

    /**
     * Standard REST endpoint for fetching history when the chat window opens.
     */
    @GetMapping("/api/chat/history/{userId1}/{userId2}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {

        List<ChatMessage> history = chatService.getChatHistory(userId1, userId2);
        return ResponseEntity.ok(history);
    }
}
