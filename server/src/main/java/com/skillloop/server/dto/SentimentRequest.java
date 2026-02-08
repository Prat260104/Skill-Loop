package com.skillloop.server.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for sentiment analysis
 * Sent to ML service for analyzing review sentiment
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentimentRequest {

    /**
     * Text to analyze for sentiment (review, comment, feedback)
     */
    @NotBlank(message = "Text cannot be empty")
    private String text;
}
