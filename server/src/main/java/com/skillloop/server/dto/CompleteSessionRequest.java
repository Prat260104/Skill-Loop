package com.skillloop.server.dto;

/**
 * DTO for completing a session with optional review
 */
public class CompleteSessionRequest {
    private String review; // Optional student review

    public CompleteSessionRequest() {
    }

    public CompleteSessionRequest(String review) {
        this.review = review;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }
}
