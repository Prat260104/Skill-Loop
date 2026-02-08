package com.skillloop.server.dto;

/**
 * Response DTO from ML service sentiment analysis
 * Contains sentiment score, label, and confidence
 */
public class SentimentResponse {

    /**
     * Sentiment score from -1 (very negative) to +1 (very positive)
     * Example: -0.85 = strongly negative, 0.92 = strongly positive
     */
    private Double score;

    /**
     * Sentiment label: "POSITIVE" or "NEGATIVE"
     */
    private String label;

    /**
     * Confidence level from 0 to 1
     * Example: 0.95 = 95% confident in the prediction
     */
    private Double confidence;

    // Constructors
    public SentimentResponse() {
    }

    public SentimentResponse(Double score, String label, Double confidence) {
        this.score = score;
        this.label = label;
        this.confidence = confidence;
    }

    // Getters and Setters
    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    // Helper Methods

    /**
     * Check if review is toxic (highly negative)
     * Threshold: score < -0.7
     */
    public boolean isToxic() {
        return score != null && score < -0.7;
    }

    /**
     * Check if review is positive
     */
    public boolean isPositive() {
        return score != null && score > 0;
    }
}
