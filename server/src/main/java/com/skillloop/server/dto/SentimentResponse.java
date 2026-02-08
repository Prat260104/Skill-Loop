package com.skillloop.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO from ML service sentiment analysis
 * Contains sentiment score, label, and confidence
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
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
