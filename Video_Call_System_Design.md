# 📹 Skill Loop: Integrated Video Calling System Design

Bhai, this document explains the architecture, flow, and integration strategy for the **Integrated Video Calling** feature in Skill Loop. The goal is simple: Users shouldn't leave our app for Google Meet or Zoom. The class happens right here, inside the platform.

---

## 1. The Core Concept (WebRTC & Signaling) 🌐

Integrated video calling runs on a technology called **WebRTC (Web Real-Time Communication)**. It allows browsers to talk directly to each other (Peer-to-Peer) for audio/video without passing the heavy stream through our Spring Boot server.

However, browsers can't just find each other magically. They need to exchange "Addresses" (ICE Candidates & Session Descriptions) first. This initial handshake is called **Signaling**.

*   **Signaling Server:** Our Spring Boot WebSocket server (or a 3rd party like ZegoCloud).
*   **Media Server:** Directly Browser-to-Browser (WebRTC).

---

## 2. The Development Options 🛠️

For an interviewer/resume perspective, here are the two paths:

### Option A: The "I Built Core WebRTC" Way (Using PeerJS)
*   **What it is:** `peerjs` simplifies raw WebRTC.
*   **How:** You build the UI entirely from scratch (buttons, grids). You use our existing Spring WebSocket to pass "Peer IDs" between the Mentor and Student.
*   **Pros:** Massive resume flex. Shows deep understanding of realtime networking. Total UI freedom.
*   **Cons:** Hard to build. Edge cases (network drops, browser permissions) require custom code. Screen sharing takes extra effort to wire up.

### Option B: The "Production Startup" Way (Using ZegoCloud / LiveKit) **(RECOMMENDED)**
*   **What it is:** "Video Calling as a Service" (SDKs).
*   **How:** Spring Boot generates a secure "Room Token". React takes that Token and opens a pre-built (but customizable) video interface.
*   **Pros:** Super fast to integrate (1-2 days). Highly stable. Built-in Screen Sharing, Chat, and Recording out of the box. Feels like a real startup product.
*   **Cons:** You don't learn raw WebRTC under the hood. It's a 3rd party dependency.

> **💡 Suggestion for Phase 2:** Build it with **ZegoCloud/LiveKit** first to get the feature live and look professional instantly. If time permits later, rebuild it with raw React + PeerJS to flex your coding muscles.

---

## 3. The Video Call Flow & UX 🔄

Here is exactly when, where, and how the user interacts with this feature.

### Step 1: The "Join Class" Button (Dashboard)
*   **Where:** In `/dashboard` under the "My Sessions" tab.
*   **Condition:** Only visible on Session Cards where `status == 'ACCEPTED'`.
*   **Time Check Logic:** The button should be disabled (grey) until 5 minutes before the `meeting_time`. When active, it turns vibrant Green ("📹 Join Class").

### Step 2: Entering the Room (React Route)
*   User clicks "Join Class" and is routed to `/room/:sessionId` (e.g., `/room/123`).
*   **Security:** On load, a quick `GET /api/sessions/123` call verifies that the logged-in user is actually the `student_id` or `mentor_id` for this session. If not, redirect to Dashboard.

### Step 3: The "Lobby" & Setup
*   Before the video grid appears, prompt the user for Camera & Mic permissions cleanly.
*   Show a placeholder: *"Waiting for [Other User] to join..."*
*   Once both connect to the Signaling Server for `Room 123`, establish the Peer Connection.

### Step 4: Live Class Experience
*   **Layout:** Full-screen mode (hide the main app Navbar). The Mentor/Learner is the large primary video, and your own camera is a small floating PIP (Picture-in-Picture) at the bottom right.
*   **Control Bar (Bottom Center):**
    *   Toggle Mic (Mute/Unmute)
    *   Toggle Camera (On/Off)
    *   Screen Share (Critical for coding sessions)
    *   **End Class (Red Button)**

---

## 4. The Critical "End Class" Workflow 🛑

Video calling isn't just about video—it's tied directly to our Gamification & Review system. The ending is the most important part of the flow.

1.  **Clicking End:** When either user clicks the Red "End Class" button, the WebRTC connection is explicitly closed.
2.  **State Update:** The React app immediately fires `PUT /api/sessions/{sessionId}/complete`.
3.  **Backend Magic:**
    *   Session status changes from `ACCEPTED` -> `COMPLETED`.
    *   **Gamification:** The `mentor_id` receives their +50 Skill Points for teaching.
4.  **Feedback Loop:** After the API success, React routes the user back to the Dashboard, but instantly mounts the **Review Modal** ("How was your session? Rate and Review!").
    *   *This is where your Sentiment Analysis Model kicks in!*

---

## 5. Next Steps / Action Items for Implementation

If moving forward with ZegoCloud/LiveKit (The Fast Route):
- [ ] Sign up for ZegoCloud/LiveKit API Keys.
- [ ] Create `VideoController.java` to generate secure Room Tokens based on `SessionID`.
- [ ] Create `/room/:id` route in React.
- [ ] Install the NPM SDK and mount the Video component.
- [ ] Wire the "End Call" event listener to trigger the `/complete` session flow.
