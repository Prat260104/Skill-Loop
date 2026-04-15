package com.skillloop.server.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * This filter runs on EVERY request to validate JWT tokens.
 */
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // STEP 1: Extract JWT from header
            String jwt = extractJwtFromRequest(request);

            // STEP 2: Validate JWT
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {

                // STEP 3: Get user ID from JWT
                Long userId = tokenProvider.getUserIdFromToken(jwt);

                // STEP 4: Load user from database using user ID
                org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserById(userId);

                // STEP 5: Create authentication object
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                // STEP 6: Set request details (IP address, session ID, etc.)
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // STEP 7: Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("Set JWT authentication for user: {}", userId);
            }

        } catch (Exception e) {
            log.error("Could not set user authentication: ", e);
        }

        // Continue to next filter
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT from "Authorization: Bearer <token>" header
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }

        return null;
    }
}
