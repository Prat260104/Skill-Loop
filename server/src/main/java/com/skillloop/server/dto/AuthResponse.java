package com.skillloop.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean isProfileComplete;
    private String accessToken;
    private Long expiresIn;
    private String tokenType = "Bearer";
}
