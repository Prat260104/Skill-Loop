# 🏆 Skill Loop: Gamification Master Plan

Bhai, here is the complete roadmap for turning our app into a **Game**.

## 1. The Core Logic (The "Why")
We want to reward Mentors for teaching.
*   **Trigger:** Session finishes.
*   **Action:** Student clicks "Mark as Completed".
*   **Reward:** Mentor gets **+50 Skill Points**.
*   **Glory:** Mentor moves up on the **Leaderboard**.

---

## 2. Backend Architecture (Spring Boot) ⚙️

### A. The Database (`User` Entity)
We already have `private int skillPoints;` in our User model. We just need to check if it's working properly.

### B. The Logic Layer (`SessionService.java`)
We need a new function: `completeSession(sessionId)`.
```java
public void completeSession(Long sessionId) {
    // 1. Find Session
    Session session = repo.findById(sessionId);
    
    // 2. Change Status
    session.setStatus("COMPLETED");
    
    // 3. Award Points to Mentor
    User mentor = session.getMentor();
    mentor.setSkillPoints(mentor.getSkillPoints() + 50); // The Magic Number
    
    // 4. Save Both
    userRepo.save(mentor);
    sessionRepo.save(session);
}
```

### C. The API Layer (`SessionController.java`)
We need a new Endpoint:
*   `PUT /api/sessions/{id}/complete`
*   This will trigger the logic above.

### D. The Leaderboard API (`UserController.java`)
We need an endpoint to get the "Top Players":
*   `GET /api/user/leaderboard`
*   Query: `SELECT * FROM users ORDER BY skill_points DESC LIMIT 10`

---

## 3. Frontend Architecture (React) ⚛️

### A. The "Mark Complete" Button (`SessionCard.jsx`)
We will update the card.
*   **If** you are the Student **AND** status is `ACCEPTED`:
*   Show a button: **"Mark Complete"**.
*   Clicking it calls `sessionApi.completeSession()`.

### B. The Leaderboard Page (`Leaderboard.jsx`)
A brand new page!
*   It will fetch `/api/user/leaderboard`.
*   It will display a stylish list:
    *   🥇 **Rank 1:** Name (Points)
    *   🥈 **Rank 2:** Name (Points)
    *   🥉 **Rank 3:** Name (Points)

### C. The Navbar (`Navbar.jsx`)
Add a shiny "Leaderboard" link so people can find it.

---

## 4. Execution Steps (How we will code it) 🛠️

1.  **Backend First:**
    *   Create `completeSession` logic in Backend.
    *   Create `leaderboard` query in Backend.
    *   Test with Swagger/Postman (Optional).

2.  **Frontend Second:**
    *   Update `sessionApi.js` (Add `completeSession`).
    *   Update `SessionCard.jsx` (Add Button).
    *   Create `Leaderboard.jsx` design.

**Sound like a plan?** Shall I start with Step 1 (Backend)?
