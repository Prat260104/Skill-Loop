package com.skillloop.server.exception;

/**
 * Thrown when someone tries to complete a session that is already completed.
 * 
 * WHY THIS EXISTS:
 * Without this, completing the same session twice would award double points
 * to the mentor (50 + 50 = 100), run sentiment analysis twice, etc.
 * This is called an "idempotency guard" — ensuring repeated actions
 * don't cause repeated side effects.
 * 
 * HTTP Status: 409 CONFLICT (not 400 Bad Request)
 * → 409 means "the request conflicts with the current state of the resource"
 * → This is the correct status for "already done" scenarios
 * 
 * INTERVIEW TIP: "I implemented idempotency guards to prevent duplicate
 * side effects from network retries or double-clicks."
 */
public class SessionAlreadyCompletedException extends RuntimeException {

    public SessionAlreadyCompletedException(Long sessionId) {
        super("Session " + sessionId + " is already completed.");
    }
}
