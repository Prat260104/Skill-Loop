# 🚀 Skill Loop: Future Engineering Roadmap

This document outlines the **missing features** from the original Startup Plan that need to be implemented to reach "Phase 2" & "Phase 3" maturity. Use this as a step-by-step guide.

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

### **B. Sentiment Analysis for Feedback**
**Goal:** Detect toxic behavior or high-quality teaching from written reviews.
**Implementation Steps:**
1.  **ML Service:**
    *   Create `services/sentiment.py`.
    *   Use `TextBlob` or `VADER` (Simple & Fast) or HuggingFace `distilbert` (more accurate).
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

- [ ] GitHub Scraper
- [ ] Sentiment Analysis
- [ ] Churn Prediction Job
- [ ] Video Calling (WebRTC)
- [ ] Badges System
- [ ] Department-wise Leaderboards
- [ ] University Email Regex
