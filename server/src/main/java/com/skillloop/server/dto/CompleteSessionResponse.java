package com.skillloop.server.dto;

/**
 * Response DTO for session completion.
 * 
 * WHY THIS EXISTS (DTO Pattern):
 * Instead of returning the raw Session entity (which exposes internal fields
 * like student passwords, mentor details, etc.), we return only what the
 * client needs. This prevents accidental data leakage.
 * 
 * INTERVIEW TIP: "I used the DTO pattern to decouple the API contract
 * from the internal entity model, preventing data leakage and giving
 * us full control over the response shape."
 */
public class CompleteSessionResponse {

    private Long sessionId;
    private String status;            // "COMPLETED"
    private boolean reviewSubmitted;  // Did the student write a review?
    private String sentimentLabel;    // "POSITIVE" / "NEGATIVE" / null (if ML failed)
    private boolean flaggedForReview; // Was the review toxic?
    private boolean pointsAwarded;    // Did mentor get +50 points?
    private String message;           // Human-readable result message

    // ===== Constructor =====
    public CompleteSessionResponse() {
    }

    // ===== Builder-style static factory (clean way to create DTOs) =====
    public static CompleteSessionResponse success(
            Long sessionId,
            boolean reviewSubmitted,
            String sentimentLabel,
            boolean flaggedForReview,
            boolean pointsAwarded
    ) {
        CompleteSessionResponse response = new CompleteSessionResponse();
        response.sessionId = sessionId;
        response.status = "COMPLETED";
        response.reviewSubmitted = reviewSubmitted;
        response.sentimentLabel = sentimentLabel;
        response.flaggedForReview = flaggedForReview;
        response.pointsAwarded = pointsAwarded;
        response.message = flaggedForReview
                ? "Session completed. Your feedback will be reviewed by the team."
                : "Session completed successfully!";
        return response;
    }

    // ===== Getters (Jackson needs these to serialize to JSON) =====

    public Long getSessionId() {
        return sessionId;
    }

    public String getStatus() {
        return status;
    }

    public boolean isReviewSubmitted() {
        return reviewSubmitted;
    }

    public String getSentimentLabel() {
        return sentimentLabel;
    }

    public boolean isFlaggedForReview() {
        return flaggedForReview;
    }

    public boolean isPointsAwarded() {
        return pointsAwarded;
    }

    public String getMessage() {
        return message;
    }

    // ===== Setters =====

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setReviewSubmitted(boolean reviewSubmitted) {
        this.reviewSubmitted = reviewSubmitted;
    }

    public void setSentimentLabel(String sentimentLabel) {
        this.sentimentLabel = sentimentLabel;
    }

    public void setFlaggedForReview(boolean flaggedForReview) {
        this.flaggedForReview = flaggedForReview;
    }

    public void setPointsAwarded(boolean pointsAwarded) {
        this.pointsAwarded = pointsAwarded;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
