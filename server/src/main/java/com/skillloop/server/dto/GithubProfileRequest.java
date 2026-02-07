package com.skillloop.server.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
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

    @Data
    public static class AiAnalysis {
        private List<String> frameworks;
        private String seniority;
        private List<String> strengths;
        private String summary;
    }
}
