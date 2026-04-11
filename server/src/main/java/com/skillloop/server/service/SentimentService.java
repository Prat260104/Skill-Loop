package com.skillloop.server.service;

import com.skillloop.server.dto.SentimentRequest;
import com.skillloop.server.dto.SentimentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Service for analyzing sentiment using Python ML service
 * Calls the FastAPI sentiment analysis endpoint
 */
@Service
public class SentimentService {

    private static final Logger log = LoggerFactory.getLogger(SentimentService.class);

    @Value("${ml.service.url:http://localhost:8001}")
    private String mlServiceUrl;

    /**
     * WHY @Autowired instead of new RestTemplate()?
     * → When we write "new RestTemplate()", we bypass Spring's bean management.
     *   The timeouts we configured in AppConfig.java won't apply!
     * → With @Autowired, Spring injects the SAME bean with 3s connect + 5s read timeout.
     * 
     * This is called "Dependency Injection" — one of Spring's core concepts.
     */
    @Autowired
    private RestTemplate restTemplate;

    /**
     * Analyze sentiment of given text
     * 
     * @param text Text to analyze (review, comment, feedback)
     * @return SentimentResponse with score, label, and confidence
     * @throws RuntimeException if ML service call fails
     */
    public SentimentResponse analyzeSentiment(String text) {
        // PRIVACY: Log text length, NOT the actual text (PII protection)
        log.info("Analyzing sentiment for text of length {}", text.length());

        try {
            // Prepare request
            SentimentRequest request = new SentimentRequest(text);

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create HTTP entity
            HttpEntity<SentimentRequest> entity = new HttpEntity<>(request, headers);

            // Call ML service
            String url = mlServiceUrl + "/api/sentiment/analyze";
            ResponseEntity<SentimentResponse> response = restTemplate.postForEntity(
                    url,
                    entity,
                    SentimentResponse.class);

            SentimentResponse result = response.getBody();

            if (result != null) {
                log.info("Sentiment result — Score: {}, Label: {}, Confidence: {}",
                        result.getScore(), result.getLabel(), result.getConfidence());
                return result;
            } else {
                log.error("ML service returned null response");
                throw new RuntimeException("ML service returned null response");
            }

        } catch (RestClientException e) {
            log.error("Failed to call ML service for sentiment analysis: {}", e.getMessage());
            throw new RuntimeException("Sentiment analysis failed: " + e.getMessage(), e);
        }
    }

    /**
     * Check if text is toxic (highly negative)
     * 
     * @param text Text to check
     * @return true if sentiment score < -0.7
     */
    public boolean isToxic(String text) {
        SentimentResponse sentiment = analyzeSentiment(text);
        return sentiment.isToxic();
    }

    /**
     * Get sentiment score only (for quick checks)
     * 
     * @param text Text to analyze
     * @return Sentiment score (-1 to +1)
     */
    public Double getScore(String text) {
        SentimentResponse sentiment = analyzeSentiment(text);
        return sentiment.getScore();
    }
}
