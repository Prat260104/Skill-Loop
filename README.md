# Skill Loop

Skill Loop is a peer-to-peer skill-sharing and mentoring platform designed for university students. The platform allows students to connect, schedule video-based mentoring sessions, exchange technical expertise, and verify their skills through built-in artificial intelligence systems.

## Project Architecture

The application is built using a microservices-inspired architecture:

*   **Frontend**: Built with React 19, Vite, and Tailwind CSS. It features a responsive dashboard, interactive user profiling, real-time messaging, and an integrated WebRTC video calling interface.
*   **Backend API**: Developed using Spring Boot 3.3 and Java 21, connected to a PostgreSQL database. The backend manages the core business logic, session life cycles, real-time WebSocket communication, notifications, and gamification mechanics.
*   **Machine Learning Service**: A FastAPI service written in Python that handles natural language processing, vector retrieval, and background analytical tasks.

---

## Current Status and Features

The core application flow is operational, with key features implemented across the frontend, backend, and machine learning components:

### 1. Peer-to-Peer Mentoring and Session Management
*   **Connection Life Cycle**: Students can search for peer mentors, request connection details, and schedule sessions. The session states are managed dynamically (requested, accepted, completed, rejected).
*   **Real-Time Chat**: Integrated chat enabled through WebSockets (STOMP and SockJS) that is restricted to active, accepted session pairs.
*   **Integrated Video Calling**: Built-in video rooms using WebRTC (integrated via Zego UIKit), allowing students to conduct mentoring sessions within the application without external links.

### 2. Machine Learning and Intelligent Services
*   **AI Mock Interviewer (RAG)**: A technical interview prep tool that retrieves resume context stored in a persistent ChromaDB vector store using Gemini Embeddings and generates relevant questions using Gemini Flash.
*   **Resume Parser**: Extracts skills, education, and professional experience from uploaded resumes using a custom spaCy Named Entity Recognition (NER) model trained on annotated job and skill datasets.
*   **GitHub Scraper**: Automatically enriches student profiles by scraping their public repositories to identify and catalog languages and topics.
*   **Sentiment Analysis**: Evaluates written session reviews using a custom-trained LSTM model (trained on review corpora) to flag toxic feedback or identify high-quality mentoring interactions.
*   **Churn Prediction**: A background Spring Boot scheduler that queries student activity patterns and uses a prediction service to identify users at risk of becoming inactive, triggering re-engagement notifications.

### 3. Gamification and Social Features
*   **Dynamic Badges**: Automatically awards badges (such as Night Owl, early adopter achievements, or positive rating streaks) to students based on activity metrics.
*   **Leaderboards**: Ranks students by XP and earned points, with filtering capabilities by department.

---

## Future Work

To bring the project to enterprise-level and deployment readiness, the following enhancements are planned:

### 1. Security Hardening
*   **Authentication and Authorization**: Implement Spring Security 6 with JWT-based authentication to replace simple session management. Add password hashing using BCrypt.
*   **Endpoint Protection**: Enforce method-level and URL-level access control on backend routes.
*   **WebSocket Security**: Secure WebSocket connections by verifying JWT tokens during the STOMP connection handshake.
*   **Email Domain Validation**: Restrict registration to verified university email addresses using domain-matching filters.

### 2. Operations and Deployment (DevOps)
*   **Containerization**: Create Dockerfiles for the client, backend server, and machine learning service, and orchestrate them with a multi-container Docker Compose file including PostgreSQL.
*   **CI/CD Pipeline**: Set up a GitHub Actions workflow to run Maven tests, frontend builds, and python test suites on pull requests and merges.
*   **Rate Limiting**: Integrate rate-limiting filters (using tools like Bucket4j) on authentication, signup, and messaging endpoints to prevent abuse.

### 3. Reliability and Performance
*   **Resilience and Fallbacks**: Add timeout guards, retry logic with exponential backoff, and circuit breakers (like Resilience4j) around calls to the machine learning service.
*   **Database Optimization**: Analyze query execution plans and add database indexes on high-frequency query columns (such as user IDs in session and chat tables).
*   **API Pagination**: Implement pagination (Spring Data Pageable) on list endpoints, chat message history, and leaderboard queries to handle large datasets efficiently.

### 4. Feature Enhancements
*   **Moderation Dashboard**: Build an administrator dashboard to view and manage sessions and reviews flagged by the sentiment analysis model.
*   **Calendar Integration**: Sync session bookings with Google Calendar and automatically generate Google Meet links as fallbacks.
*   **Messaging Quality of Life**: Add delivery and read receipts (single and double checkmarks) to the WebSocket chat system.
*   **Observability**: Add Spring Boot Actuator for health checks and integrate structured JSON logging for API and machine learning endpoints.
