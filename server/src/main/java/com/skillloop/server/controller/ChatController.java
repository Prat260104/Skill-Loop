package com.skillloop.server.controller;

import com.skillloop.server.dto.ChatMessageRequest;
import com.skillloop.server.dto.ChatMessageResponse;
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
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
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

        // 2. Convert Entity to DTO to prevent exposing database structure
        ChatMessageResponse responsePayload = new ChatMessageResponse(
                savedMsg.getId(),
                savedMsg.getSender().getId(),
                savedMsg.getReceiver().getId(),
                savedMsg.getContent(),
                savedMsg.getTimestamp());

        // 3. Broadcast it immediately to the receiver's private queue
        // STOMP Destination: /user/{receiverId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMsg.getReceiver().getId()),
                "/queue/messages",
                responsePayload);

        // 4. Also broadcast it back to the sender so their UI updates
        // STOMP Destination: /user/{senderId}/queue/messages
        messagingTemplate.convertAndSendToUser(
                String.valueOf(savedMsg.getSender().getId()),
                "/queue/messages",
                responsePayload);
    }

    /**
     * Standard REST endpoint for fetching history when the chat window opens.
     */
    @GetMapping("/api/chat/history/{userId1}/{userId2}")
    public ResponseEntity<?> getChatHistory(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {

        try {
            List<ChatMessage> history = chatService.getChatHistory(userId1, userId2);

            // Convert Entities to clean DTOs
            List<ChatMessageResponse> responseHistory = history.stream()
                    .map(msg -> new ChatMessageResponse(
                            msg.getId(),
                            msg.getSender().getId(),
                            msg.getReceiver().getId(),
                            msg.getContent(),
                            msg.getTimestamp()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responseHistory);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("ERROR: " + e.getMessage() + " | CAUSE: "
                    + (e.getCause() != null ? e.getCause().getMessage() : "none"));
        }
    }
}
