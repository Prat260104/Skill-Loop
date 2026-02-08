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

### **A2. AI Mock Interviewer 2.0 (Deep Dive)**
**Goal:** Project-specific technical interviews using scraped data.
**Implementation Steps:**
1.  **Context:** Use `GithubProfile` data (languages, repos) + `Resume` (experience).
2.  **ML Service:** Verify code logic, ask "Why did you use Redux here?", assess architectural choices.
3.  **Voice Mode:** Use WebSpeech API or OpenAI Realtime API for voice-to-voice interviews.

### **A3. Resume Parser Refinement**
**Goal:** Fix existing bugs in Bio/Experience extraction.
**Implementation Steps:**
1.  **Refine Logic:** Better regex/NLP to identify "Experience" section boundaries.
2.  **Bio Extraction:** Smartly summarize "Summary" or "Objective" instead of taking random text.

### **B. Sentiment Analysis for Feedback**
**Goal:** Detect toxic behavior or high-quality teaching from written reviews.
**Implementation Steps:**
1.  **ML Service:**
    *   Create `services/sentiment.py`.
    *   **UPDATED PLAN:** Train custom Keras model on IMDB dataset.
    *   **Input:** "He was rude and didn't explain well." -> **Output:** `Sentiment: NEGATIVE (-0.8)`.
2.  **Backend:**
    *   In `SessionService.completeSession`, when saving a review, call this ML endpoint.
    *   If Sentiment is Very Negative (< -0.5), auto-flag for Admin Review.

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

### **A. Integrated Video Calling (WebRTC)**
**Goal:** Users shouldn't leave the app to take the class.
**Implementation Steps:**
1.  **Tech:** **PeerJS** (easiest wrapper for WebRTC) or **LiveKit** (production grade).
2.  **Frontend:** Create `VideoRoom.jsx`.
3.  **Backend:** Signaling Server (WebSocket) to exchange Peer IDs.

### **B. Calendar Sync**
**Goal:** Avoid scheduling conflicts.
**Implementation Steps:**
1.  **Tech:** Google Calendar API.
2.  **Flow:** OAuth2 "Sign in with Google" -> Grant Calendar Access -> Auto-create Google Meet link.

### **C. Real-time Chat (Post-Acceptance)**
**Goal:** Enable communication only *after* a session is accepted.
**Implementation Steps:**
1.  **Backend (`ChatController`):**
    *   Use **Spring WebSocket (STOMP)** for real-time messaging.
    *   **Restriction:** Check `SessionService.isSessionAccepted(userId, peerId)` before allowing message send.
2.  **Database:** `ChatMessage` entity (senderId, receiverId, content, timestamp, sessionId).
3.  **Frontend:**
    *   Show "Chat" button on `SessionCard` only if status is `ACCEPTED`.
    *   Open a floating Chat Window on click.

---

## 🎮 3. Advanced Gamification (The "Hook")

### **A. Badges System**
**Goal:** Visual achievements.
**Implementation Steps:**
1.  **Database:** Create `Badge` entity (Name, Icon, Description) and `UserBadge` (UserId, BadgeId).
2.  **Triggers:**
    *   *First Session:* Award "Newbie" Badge.
    *   *5 Star Rating:* Award "Verified Tutor" Badge.
    *   *Night Owl:* Session after 10 PM.

### **B. Leaderboards (Department-wise)**
**Goal:** Competitive spirit.
**Implementation Steps:**
1.  **Backend:** Add `department` field to `User`.
2.  **Query:** `SELECT * FROM users WHERE department = 'CS' ORDER BY skill_points DESC LIMIT 10`.
3.  **Frontend:** Filter dropdown on Leaderboard page.

---

## 🛡️ 4. Trust & Safety

### **A. University Email Verification**
**Goal:** Ensure only students join.
**Implementation Steps:**
1.  **Auth Service:** Regex check on Signup: `^[a-zA-Z0-9._%+-]+@university\.edu$`.
2.  **Logic:** Reject registration if domain doesn't match allow-list.

---

## ❌ Current Status Checklist

- [x] GitHub Scraper (Completed)
- [ ] Sentiment Analysis (Custom Model)
- [ ] Recommendation Engine (Custom Algo)
- [ ] Churn Prediction Job
- [ ] Video Calling (WebRTC)
- [ ] Badges System
- [ ] Department-wise Leaderboards
- [ ] University Email Regex
