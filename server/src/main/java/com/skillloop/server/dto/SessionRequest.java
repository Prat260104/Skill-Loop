package com.skillloop.server.dto;

import lombok.Data;

@Data
public class SessionRequest {
    private Long mentorId; // Who I want to learn from
    private String skill; // What I want to learn
    // We can add scheduledTime later
}
