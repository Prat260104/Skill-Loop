# 🔐 Skill Loop: The Ultimate Authentication Guide (0 to Hero)

This file contains **Everything** you need to know about Auth. I have merged the concepts, the "Hinglish" analogies, and the technical details.

---

## Part 1: Concepts (Hinglish Explained) 🧠

### 1. AuthN vs AuthZ (The Basics)
*   **Authentication (AuthN):** "Tu kaun hai?" (Identity).
    *   *Real Life:* Bouncer checking your ID Card.
*   **Authorization (AuthZ):** "Tujhe kya allowed hai?" (Permission).
    *   *Real Life:* You have the ID, but do you have the "VIP Band" to enter the VIP area?

### 2. The Evolution: Session vs JWT
*   **Old Way (Session):** **"The Hotel Register"** 📒
    *   Server writes your name in a RAM register.
    *   *Problem:* Server RAM gets full. If server restarts, everyone is logged out.
*   **New Way (JWT):** **"The Wristband"** 🎫
    *   Server gives you a signed wristband (Token).
    *   Server forgets you immediately (Stateless).
    *   *Benefit:* Server is free. You carry your own proof.

### 3. Hashing (Password Safety) 🔒
*   **Never** store "123456" in the DB.
*   **Use BCrypt:** It turns "123456" into `$2a$10$Xj9...` (Kichdi).
*   Even if a hacker steals the DB, they can't reverse-engineer the password.

---

## Part 2: What is OAuth 2.0? (Login with Google) 🌐

You asked: *"Abhi kisse karte hain aur OAuth kya hai?"*

### The Concept
Imagine you want to enter a new club, but you forgot your ID.
*   **Manual Signup:** You fill a form, verify email, set password. (Tedious 😫).
*   **OAuth:** You tell the Bouncer: *"I don't have my ID, but see this guy? He is **Google**. He knows me. If he says I'm cool, will you let me in?"*
*   The Club (Skill Loop) asks Google: *"Is this guy Prateek?"*
*   Google says: *"Yes, here is his email."*
*   The Club lets you in WITHOUT you ever setting a password at the Club.

### Are we using it?
**Not right now.** We are building **Custom Auth (JWT)** first.
*   **Why?** Because as a developer, you MUST know how to build your own auth system (Database, Hashing, Tokens). This is what Interviewers ask.
*   **OAuth is an "Add-on":** Once our Custom Auth works, we can easily add "Login with GitHub" later using a library. But the *core* must be yours.

---

## Part 3: The "Skill Loop" Implementation Plan 🛠️

We are building a **Stateless JWT Architecture** using **Spring Security**.

### Step 1: Signup (The Registration)
*   **Input:** Name, Email, Password.
*   **Action:**
    1.  Check if Email exists.
    2.  **Hash** the password (BCrypt).
    3.  Save `User` to Postgres DB.

### Step 2: Login ( The Verification)
*   **Input:** Email, Password.
*   **Action:**
    1.  Find User by Email.
    2.  Match Password Hash.
    3.  **Generate JWT Token** (The Wristband).
    4.  Send Token to Frontend.

### Step 3: Protection (The Filter Chain)
*   React sends: `GET /api/profile` + Header: `Authorization: Bearer <token>`
*   Spring Boot (`JwtFilter`):
    1.  Intercepts request.
    2.  Checks signature of Token.
    3.  If valid, sets "User is Logged In".
    4.  Lets request pass to Controller.

---

## Part 4: Interview Answers (English) 🎤

**Q: How did you handle Authentication?**
"I implemented **Stateless Authentication** using **Spring Security** and **JWT**.
1.  **Security Architecture:** I configured a `SecurityFilterChain` where requests are intercepted by a custom `JwtAuthenticationFilter`.
2.  **User Identity:** For Registration, I verify if the user exists, hash their password using `BCrypt`, and save them to **PostgreSQL**.
3.  **Login Flow:** Upon successful login, I generate a JWT signed with a secret key. The Frontend attaches this token to the header for future requests."

**Q: Why not use Sessions?**
"Sessions are stateful and difficult to scale horizontally (if I add more servers). JWTs are stateless, meaning the token itself contains the user data, reducing load on the server memory."
