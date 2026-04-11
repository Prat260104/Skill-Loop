package com.skillloop.server.exception;

/**
 * Thrown when a user tries to perform an action on a session 
 * they don't have permission for.
 * 
 * Example: A random student tries to complete someone else's session.
 * 
 * HTTP Status: 403 FORBIDDEN
 * → 403 means "you're authenticated, but not authorized for this action"
 * → Different from 401 (not logged in at all)
 * 
 * INTERVIEW TIP: "I distinguished between 401 (unauthenticated) and 
 * 403 (unauthorized) to follow REST conventions. Custom exceptions 
 * make error handling self-documenting."
 */
public class UnauthorizedSessionAccessException extends RuntimeException {

    public UnauthorizedSessionAccessException(String message) {
        super(message);
    }
}
