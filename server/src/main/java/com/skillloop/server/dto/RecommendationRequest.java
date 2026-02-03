package com.skillloop.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RecommendationRequest {

    // "target_user" in Python
    @JsonProperty("target_user")
    private UserSummaryDTO targetUser;

    // "candidates" in Python
    @JsonProperty("candidates")
    private List<UserSummaryDTO> candidates;

    // "top_k" in Python (Optional, default 5)
    @JsonProperty("top_k")
    private int topK = 5;

    // Constructors
    public RecommendationRequest() {
    }

    public RecommendationRequest(UserSummaryDTO targetUser, List<UserSummaryDTO> candidates, int topK) {
        this.targetUser = targetUser;
        this.candidates = candidates;
        this.topK = topK;
    }

    // Getters and Setters
    public UserSummaryDTO getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(UserSummaryDTO targetUser) {
        this.targetUser = targetUser;
    }

    public List<UserSummaryDTO> getCandidates() {
        return candidates;
    }

    public void setCandidates(List<UserSummaryDTO> candidates) {
        this.candidates = candidates;
    }

    public int getTopK() {
        return topK;
    }

    public void setTopK(int topK) {
        this.topK = topK;
    }
}
