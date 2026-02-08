package com.skillloop.server.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for sentiment analysis
 * Sent to ML service for analyzing review sentiment
 */
public class SentimentRequest {

    /**
     * Text to analyze for sentiment (review, comment, feedback)
     */
    @NotBlank(message = "Text cannot be empty")
    private String text;

    // Constructors
    public SentimentRequest() {
    }

    public SentimentRequest(String text) {
        this.text = text;
    }

    // Getter and Setter
    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
