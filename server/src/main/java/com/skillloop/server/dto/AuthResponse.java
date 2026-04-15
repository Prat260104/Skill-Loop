package com.skillloop.server.dto;

public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean isProfileComplete;
    private String accessToken;
    private Long expiresIn;
    private String tokenType = "Bearer";

    // Constructors
    public AuthResponse() {
    }

    public AuthResponse(Long id, String name, String email, String role, boolean isProfileComplete,
                      String accessToken, Long expiresIn, String tokenType) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.isProfileComplete = isProfileComplete;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.tokenType = tokenType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isProfileComplete() {
        return isProfileComplete;
    }

    public void setProfileComplete(boolean profileComplete) {
        isProfileComplete = profileComplete;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
