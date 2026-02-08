package com.skillloop.server.service;

import com.skillloop.server.dto.SentimentRequest;
import com.skillloop.server.dto.SentimentResponse;
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

    @Value("${ml.service.url:http://localhost:8001}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate;

    public SentimentService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Analyze sentiment of given text
     * 
     * @param text Text to analyze (review, comment, feedback)
     * @return SentimentResponse with score, label, and confidence
     * @throws RuntimeException if ML service call fails
     */
    public SentimentResponse analyzeSentiment(String text) {
        System.out.println("Analyzing sentiment for text: " +
                (text.length() > 50 ? text.substring(0, 50) + "..." : text));

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
                System.out.println("Sentiment analysis result - Score: " + result.getScore() +
                        ", Label: " + result.getLabel() + ", Confidence: " + result.getConfidence());
                return result;
            } else {
                System.err.println("ML service returned null response");
                throw new RuntimeException("ML service returned null response");
            }

        } catch (RestClientException e) {
            System.err.println("Failed to call ML service for sentiment analysis: " + e.getMessage());
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
