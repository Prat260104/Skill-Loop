package com.skillloop.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple memory-based message broker to carry the messages
        // back to the client on destinations prefixed with "/topic" and "/queue" (for
        // private messages)
        config.enableSimpleBroker("/topic", "/queue");

        // Designate the "/app" prefix for messages that are bound for methods annotated
        // with @MessageMapping
        config.setApplicationDestinationPrefixes("/app");

        // Designate the "/user" prefix for setting up private routing destinations
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the "/ws" endpoint, enabling the SockJS protocol options so that we
        // have a fallback option if WebSockets are not available.
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173") // Allow Frontend URL
                .withSockJS();
    }
}
