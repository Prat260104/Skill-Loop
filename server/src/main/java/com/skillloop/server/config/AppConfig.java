package com.skillloop.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

/**
 * Application configuration for shared beans.
 * 
 * KEY CONCEPT: RestTemplate Timeout
 * Without timeouts, if the ML service hangs (server crash, network issue),
 * our thread waits FOREVER → eventually all threads are blocked → OUR server crashes too.
 * 
 * Connection Timeout (3s) = how long to wait to CONNECT to ML service
 * Read Timeout (5s) = how long to wait for ML service to RESPOND
 * 
 * INTERVIEW TIP: "I configured RestTemplate with timeouts to prevent thread
 * starvation. This follows the fail-open resilience pattern — if the ML service
 * is slow, the main business flow still completes."
 */
@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);  // 3 seconds to establish connection
        factory.setReadTimeout(5000);     // 5 seconds to read response
        return new RestTemplate(factory);
    }
}

