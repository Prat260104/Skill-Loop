# Skill Loop: Session System Design Guide

Bhai, this document is for you to understand **HOW** we are building the Session System. Read this to understand the logic behind the code.

---

## 1. The Core Concept: "The Handshake" 🤝

In a normal app, you just click "Buy" and it's done.
But in **Skill Loop**, a Session is a **Negotiation** between two humans.

1.  **Student:** "I want to learn React on Tuesday." -> `REQUEST`
2.  **Mentor:** "Okay, I am free." -> `ACCEPT`
3.  **System:** "Cool, here is a meeting link." -> `SCHEDULED`
4.  **After Class:** "Done!" -> `COMPLETED` -> **Points Transfer**.

---

## 2. Database Design (The Memory) 🧠

We need a table to remember these negotiations. We will call it structure `Session`.

### The Columns (What we save):
| Column | Type | Why? |
| :--- | :--- | :--- |
| `id` | Long | Unique ID for every meeting. |
| `student_id` | User | **Who entered the request?** (The Learner) |
| `mentor_id` | User | **Who received the request?** (The Teacher) |
| `skill` | String | What is the topic? (e.g., "Java") |
| `status` | Enum | Is it `PENDING`, `ACCEPTED`, or `REJECTED`? |
| `meeting_time` | Date | When is it happening? |

> **Key Learning:** We use **Two Foreign Keys** (`student_id` and `mentor_id`) pointing to the *same* `User` table. This allows any user to be a student in Row 1 and a mentor in Row 2. This is called a **Self-Referencing Relationship** logic.

---

## 3. The Backend Logic (The Brain) ⚙️

We need 3 main functions in our Spring Boot `SessionController`:

### A. "Request a Session" (`POST /request`)
*   **Input:** "I want to learn **Java** from **User 55**".
*   **Logic:**
    1.  Check if User 55 actually offers "Java".
    2.  Check if you have enough points (Optional for now).
    3.  Save a new row in DB with status `PENDING`.

### B. "Accept/Reject" (`PUT /respond`)
*   **Input:** "I accept Request #99".
*   **Logic:**
    1.  Find Request #99.
    2.  Check if *you* are the mentor for #99 (Security check!).
    3.  Change status to `ACCEPTED`.

### C. "My Sessions" (`GET /my-sessions`)
*   **Logic:** This is the tricky part!
    *   Find all rows where `student_id == ME`. (What I am learning)
    *   **PLUS**
    *   Find all rows where `mentor_id == ME`. (What I am teaching)
    *   Combine them and send to React.

---

## 4. The Frontend (The Interface) 💻

### The Flow:
1.  **User Card:** You see a user card.
    *   *Old:* Just a "Connect" button.
    *   *New:* "Connect" opens a **Popup Modal**.
    *   **Modal asks:** "Which skill do you want to learn?" (Dropdown of their skills).

2.  **Dashboard:** A new tab "My Sessions".
    *   **Incoming Requests:** "Prateek wants to learn Java." [Accept] [Decline]
    *   **Upcoming:** "Class with Rahul tomorrow at 5 PM."

---

## Summary for Construction 🏗️
1.  **Step 1:** Create `Session.java` (The Box).
2.  **Step 2:** Create `SessionRepository` (The Shelf).
3.  **Step 3:** Create `SessionController` (The Manager).
4.  **Step 4:** Update React to talk to the Manager.
