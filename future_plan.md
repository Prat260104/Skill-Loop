# 🚀 Skill Loop: Future Engineering Roadmap

This document outlines the **missing features** from the original Startup Plan that need to be implemented to reach "Phase 2" & "Phase 3" maturity. Use this as a step-by-step guide.

## ⭐ PLACEMENT SUCCESS STRATEGY (Suggested Changes)
*(Prioritized for maximum engineering impact in interviews)*

### **1. Sentiment Analysis (Custom Neural Network) 🧠**
*   **Change:** Instead of just using an API (Gemini/TextBlob), we will build a **Custom Neural Network (LSTM/Dense)**.
*   **Why:** Demonstrates deep understanding of NLP pipeline (Preprocessing -> Training -> Inference).
*   **Tech:** TensorFlow/Keras, Python, IMDB/Twitter Dataset.

### **2. Recommendation Engine (Custom Algorithm) 🤝**
*   **Change:** Implement a **Weighted Cosine Similarity** algorithm for matchmaking.
*   **Why:** Shows grasp of core Data Structures & Algorithms, not just database queries.
*   **Logic:** Match users based on Skills (50%), Experience (30%), and Activity (20%).

### **3. AI Interviewer (RAG - Retrieval Augmented Generation) 📚**
*   **Change:** Upgrade from Gemini Wrapper to **RAG Architecture**.
*   **Why:** "RAG" is the hottest topic. Shows you know **Vector Databases (ChromaDB)** and **Embeddings**.
*   **Tech:** LangChain, ChromaDB, Gemini Embedding Model.

### **4. Resume Parser (Custom NER - Named Entity Recognition) 🕵️‍♂️**
*   **Change:** Replace Regex with a **Custom spaCy Model**.
*   **Why:** Regex is basic. Training a custom NER model for "Job Roles" and "Skills" is a true Data Science task.
*   **Tech:** spaCy, Python, Custom Annotations.

---

## 🧠 1. AI & ML Expansions (The "Smart" Layer)

### **A. Smart Profile Builder (GitHub/LinkedIn Scraper)**
**Goal:** Reduce manual entry by auto-fetching skills from a user's GitHub.
**Implementation Steps:**
1.  **Backend (`server`):** Add `githubUrl` field to `User` entity.
2.  **ML Service (`ml-service`):**
    *   Create `services/github_scraper.py`.
    *   Use `requests` to fetch public repo data (languages, README topics).
    *   **Logic:** If user has 5 repos with "Python" > Add "Python" to `skills_offered`.
3.  **Frontend:** Add "Connect GitHub" button in Profile Edit.
4.  **DONE:** ✅ Implemented with Orbiting Animations & Dino Loader.

### **A2. AI Mock Interviewer 2.0 (Deep Dive) ✅**
**Goal:** Project-specific technical interviews using scraped data.
**Implementation Steps:**
1.  **Context:** Use `GithubProfile` data (languages, repos) + `Resume` (experience).
2.  **ML Service:** Verify code logic, ask "Why did you use Redux here?", assess architectural choices.
3.  **Voice Mode:** Use WebSpeech API or OpenAI Realtime API for voice-to-voice interviews.

### **A3. Resume Parser Refinement ✅**
**Goal:** Fix existing bugs in Bio/Experience extraction.
**Implementation Steps:**
1.  **Refine Logic:** Better regex/NLP to identify "Experience" section boundaries.
2.  **Bio Extraction:** Smartly summarize "Summary" or "Objective" instead of taking random text.

### **B. Sentiment Analysis for Feedback ✅**
**Status:** Backend complete; session completion UI includes review + rating (`SessionReviewModal`). **Still pending:** surfacing sentiment score to the user and an **admin panel** for flagged reviews (`needsReview`).
**Goal:** Detect toxic behavior or high-quality teaching from written reviews.
**Implementation Steps:**
1.  **ML Service:** ✅ **COMPLETED**
    *   ✅ Created `services/sentiment_analyzer.py`.
    *   ✅ Trained custom LSTM model on IMDB dataset (84.15% accuracy).
    *   ✅ API Endpoint: `POST /api/sentiment/analyze`.
    *   ✅ **Output:** `{"score": -0.91, "label": "NEGATIVE", "confidence": 0.91}`.
2.  **Backend:** ✅ **COMPLETED**
    *   ✅ `SentimentService.java` - calls ML API.
    *   ✅ `SessionService.completeSession()` - analyzes review on session completion.
    *   ✅ If score < -0.7 (toxic) → No points awarded, flagged for admin review.
    *   ✅ Database fields: `review`, `sentimentScore`, `needsReview`.
3.  **Frontend:** ⚠️ **PARTIAL**
    *   ✅ Review textarea + stars on session completion (`SessionReviewModal`).
    *   ❌ Display sentiment score/label to the user after submit.
    *   ❌ Admin panel to view flagged reviews.
4.  **Future Production Improvements:**
    *   🔄 **Retrain with RateMyProfessors Dataset** (~18M professor reviews for better domain fit).
    *   📈 **Collect Real Skill Loop Reviews** (gather actual mentor feedback data).
    *   🎯 **Fine-tune on Custom Data** (domain-specific training for 90%+ accuracy).
    *   📊 **A/B Test Thresholds** (optimize toxic score cutoff beyond -0.7).
    *   🌐 **Multi-language Support** (Hindi/regional language sentiment analysis).

### **C. Auto-Summarization & Notes**
**Goal:** Provide "Key Takeaways" after a session.
**Dependency:** Requires **Video Call** implementation first.
**Implementation Steps:**
1.  **Tech:** OpenAI Whisper (Speech-to-Text).
2.  **Flow:** Record audio -> Send to Whisper -> Get Text -> Send to Gemini -> "Summarize this in bullet points".

### **D. Churn Prediction (Retention Logic)**
**Goal:** Identify users who haven't logged in for 30 days.
**Implementation Steps:**
1.  **Backend:** Create a Scheduled Job (`@Scheduled`).
2.  **Logic:** Check `lastLoginDate`. If > 2 weeks, send a "We miss you!" email via `NotificationService`.

---

## 🤝 2. Session Experience (The "Core" Product)

### **A. Integrated Video Calling (WebRTC) ✅**
**Goal:** Users shouldn't leave the app to take the class.
**Status:** **Done** using **Zego UIKit Prebuilt** (managed WebRTC). Route: `/room/:roomId`. Env: `VITE_ZEGO_APP_ID`, `VITE_ZEGO_SERVER_SECRET`.
**Original plan note:** PeerJS/LiveKit + custom signaling was optional; current stack avoids a separate signaling server.

### **B. Calendar Sync**
**Goal:** Avoid scheduling conflicts.
**Implementation Steps:**
1.  **Tech:** Google Calendar API.
2.  **Flow:** OAuth2 "Sign in with Google" -> Grant Calendar Access -> Auto-create Google Meet link.

### **C. Real-time Chat (Post-Acceptance) ✅**
**Goal:** Enable communication only *after* a session is accepted.
**Done:**
1.  **Backend:** STOMP over SockJS (`/ws`), `ChatController` `@MessageMapping("/chat.sendMessage")`.
2.  **Restriction:** `ChatService.saveMessage` allows messages only when `Session.status == ACCEPTED`.
3.  **Database:** `ChatMessage` (sender, receiver, session, content, timestamp).
4.  **Frontend:** Chat UI + `useChat` hook; SockJS URL built from `VITE_API_URL` (no hardcoded host).
5.  **Future Enhancements:**
    *   Add **Double Tick (Delivered)** and **Blue Tick (Read Receipts)** features via WebSockets to mimic WhatsApp-like UX.

---

## 🎮 3. Advanced Gamification (The "Hook")

### **A. Badges System ✅**
**Goal:** Visual achievements.
**Done:** `Badge` enum on `User` (element collection `user_badges`), `GamificationService` awards Icebreaker, Night Owl, Early Bird, Five Star, Code Ninja, etc.; `BadgeIcon` on profile/cards.
**Note:** Stored as enum + set, not a separate `Badge`/`UserBadge` relational table (sufficient for current scope).

### **B. Leaderboards (Department-wise) ✅**
**Goal:** Competitive spirit.
**Done:** `User.department`, `GET /api/user/leaderboard?department=...`, `Leaderboard.jsx` filter, `ProfileSetup` collects department.

---

## 🛡️ 4. Trust & Safety

### **A. University Email Verification**
**Goal:** Ensure only students join.
**Implementation Steps:**
1.  **Auth Service:** Regex check on Signup: `^[a-zA-Z0-9._%+-]+@university\.edu$`.
2.  **Logic:** Reject registration if domain doesn't match allow-list.

---

## 🏗️ 5. Production-Grade Architecture Refactoring
*(To demonstrate enterprise-level frontend architecture)*

### **A. Centralized Axios Interceptors ✅**
**Goal:** Remove repetitive `fetch()` calls and handle Auth/Errors globally.
**Done:** `src/api/axiosConfig.js` — shared instance, request interceptor for `Authorization`, response interceptor for 401 → clear storage → `/login`.

### **B. Environment Variables (.env) ✅**
**Goal:** Make the app deployable across Local, Staging, and Production environments without code changes.
**Done:** `VITE_API_URL` for REST (`axiosConfig`, API modules, recommendations via `api` instance). **SockJS:** `useChat` builds `/ws` from the same `VITE_API_URL`. **Video:** `VITE_ZEGO_*` in `.env`.
**Note:** `axiosConfig` still falls back to `http://localhost:9090` when env is unset (dev convenience).
**Security:** Do not commit secrets; add a `.env.example` for teammates (recommended).

---

## 🏗️ 6. Project Structure & Codebase Organization

### **A. Frontend (`client`) Revamp**
*   **Pages vs. Components:** Move full views (like `Home.jsx`, `Profile.jsx`) into a `src/pages/` folder, reserving `src/components/` strictly for reusable elements (buttons, cards).
*   **Layouts Folder:** Create `src/layouts/` for persistent UI like Navbar, Sidebar, and Footer.
*   **Centralized Utilities:** Create `src/utils/` for helper functions (date formatting, regex logic).

### **B. Backend (`server`) Enhancements**
*   **Global Exception Handling:** Use `@ControllerAdvice` in an `exceptions/` package to map errors to standard JSON error responses instead of returning raw stack traces.
*   **DTO Mappers:** Implement `MapStruct` or a dedicated `mapper/` package to cleanly convert Entities to DTOs outside of Services.

### **C. ML Service (`ml-service`) Refinement**
*   **Clear Separation of Concerns:** Ensure `routes/` (for FastAPI endpoints), `services/` (for execution logic), and `models/` (for serialized weight files like `.h5`/`.pkl`) are distinctly separated.

---

## 👶 7. Beginner-Friendly UX & Onboarding

### **A. "Zero State" / Empty State Designs**
*   **Goal:** Replace blank screens or dry "No sessions found" text with friendly illustrations and clear calls to action (e.g., "Looks like your schedule is clear! 🌟 Click here to find a mentor.").

### **B. Interactive Guided Onboarding**
*   **Goal:** Use a library like `react-joyride` for a 3-step pop-up tour on a user's first login (highlighting Profile, Dashboard, and AI Interview sections).

### **C. "Demo" or "Ghost" Data**
*   **Goal:** Provide a "Skill Loop Bot" or "Demo Mentor" for new users to safely practice clicking "Accept", "Chat", and "Start Video" without fear of making action with a real person.

### **D. AI Explainability Tooltips**
*   **Goal:** Add `(?)` tooltip hover icons next to complex features (like AI Interviewer) explaining how it works simply (e.g., "We use your GitHub and Resume to generate custom questions!").

### **E. Instant Gratification (Gamification UX)**
*   **Goal:** Reinforce positive actions (completing a profile, finishing a session) with immediate visual feedback like a toast notification or CSS confetti ("Awesome! You earned +50 Skill Points!").

---

## ❌ Current Status Checklist

- [x] GitHub Scraper (Completed)
- [x] Sentiment Analysis (backend + review UI; score display & admin queue still open)
- [x] Recommendation Engine (Custom Algo)
- [x] Churn Prediction Job
- [x] Real-time Chat (Post-Acceptance; STOMP + env-based WS URL)
- [x] AI Mock Interviewer 2.0 (RAG)
- [x] Resume Parser (Custom NER)
- [x] Production-Grade Axios Interceptors & Env Variables (`VITE_API_URL`; recommendations + chat WS aligned)
- [x] Video Calling (Zego UIKit Prebuilt + `/room/:roomId`)
- [x] Badges System (enum + `GamificationService`)
- [x] Department-wise Leaderboards (API + UI)
- [ ] University Email Regex

