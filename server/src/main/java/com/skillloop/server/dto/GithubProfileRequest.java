package com.skillloop.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class GithubProfileRequest {

    @JsonProperty("user_id")
    private Long userId;

    private String username;

    @JsonProperty("top_projects_count")
    private int topProjectsCount;

    @JsonProperty("verified_languages")
    private List<String> verifiedLanguages;

    @JsonProperty("ai_analysis")
    private AiAnalysis aiAnalysis;

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getTopProjectsCount() {
        return topProjectsCount;
    }

    public void setTopProjectsCount(int topProjectsCount) {
        this.topProjectsCount = topProjectsCount;
    }

    public List<String> getVerifiedLanguages() {
        return verifiedLanguages;
    }

    public void setVerifiedLanguages(List<String> verifiedLanguages) {
        this.verifiedLanguages = verifiedLanguages;
    }

    public AiAnalysis getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(AiAnalysis aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    public static class AiAnalysis {
        private List<String> frameworks;
        private String seniority;
        private List<String> strengths;
        private String summary;

        // Getters and Setters for Inner Class
        public List<String> getFrameworks() {
            return frameworks;
        }

        public void setFrameworks(List<String> frameworks) {
            this.frameworks = frameworks;
        }

        public String getSeniority() {
            return seniority;
        }

        public void setSeniority(String seniority) {
            this.seniority = seniority;
        }

        public List<String> getStrengths() {
            return strengths;
        }

        public void setStrengths(List<String> strengths) {
            this.strengths = strengths;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(String summary) {
            this.summary = summary;
        }
    }
}
