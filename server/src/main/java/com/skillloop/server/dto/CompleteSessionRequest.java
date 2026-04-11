package com.skillloop.server.dto;

/**
 * DTO for completing a session with optional review and rating.
 * 
 * WHY validate on server (not just frontend)?
 * → Anyone can call your API directly (Postman, curl, hackers).
 * → Frontend validation is for UX; server validation is for SECURITY.
 * → Never trust input from the client.
 */
public class CompleteSessionRequest {
    private String review;   // Optional student review text
    private Integer rating;  // Optional star rating (1-5)

    public CompleteSessionRequest() {
    }

    public CompleteSessionRequest(String review, Integer rating) {
        this.review = review;
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    /**
     * Server-side validation for rating.
     * Returns true if rating is valid (null is allowed, but if present must be 1-5).
     */
    public boolean isRatingValid() {
        return rating == null || (rating >= 1 && rating <= 5);
    }
}

