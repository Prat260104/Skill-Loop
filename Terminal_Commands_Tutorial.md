# 💻 Skill Loop: Terminal Commands & Troubleshooting Log

This file records every "Magic Spell" (Command) we used, why we used it, and how to fix errors.

---

## 1. Spring Boot & Java Commands ☕️

### `mvn spring-boot:run`
*   **What it does:** Starts your Backend Server.
*   **Why/When:** Whenever you want to test your API.
*   **Common Error:** `Port 8080 was already in use`.
    *   **Fix:** Either change port in `application.properties` (Switch to 9090) OR kill the old process.

### `mvn clean install`
*   **What it does:** Deletes old files (`clean`) and recompiles everything from scratch.
*   **Why/When:** If Java starts acting weird or says "Class not found" even though code is there.

---

## 2. Frontend Commands (React) ⚛️

### `npm run dev`
*   **What it does:** Starts the React Development Server (usually on `localhost:5173`).
*   **Location:** Run this inside the `client/` folder.
*   **Why:** To see your website in the browser.

### `npm install`
*   **What it does:** Downloads all JavaScript libraries (node_modules).
*   **When:** If you pull new code and it says "Module not found".

---

## 3. PostgreSQL & Database Commands 🐘

### `brew install postgresql`
*   **What it does:** Downloads the Database software on your Mac.

### `brew services start postgresql`
*   **What it does:** Turns on the Database Server in the background.
*   **Why:** Without this, your Spring Boot app will crash saying `Connection Refused`.

### `psql postgres`
*   **What it does:** Opens the "Chat Window" to talk to the database manually.
*   **Commands INSIDE psql:**
    *   `\l` : List all databases.
    *   `\c skillloop_db` : Switch to our project database.
    *   `\d users` : Describe/Show columns of the `users` table.
    *   `SELECT * FROM users;` : Show me all the data.
    *   `\q` : Quit/Exit.

---

## 4. Testing Commands (Curl) 🧪

### `curl -X POST ...`
*   **What it does:** Pretends to be a Frontend (React) and sends data to your Backend.
*   **Example (Signup):**
    ```bash
    curl -X POST http://localhost:9090/api/auth/signup \
         -H "Content-Type: application/json" \
         -d '{"name": "Prateek", "email": "abc@gmail.com", "password": "123"}'
    ```
*   **Why not browser?** Browsers can easily do `GET` (view page), but doing `POST` (sending data) is hard without a form. `curl` is faster.

---

## 5. Git Commands (Version Control) 🌳

### `git add .`
*   **Meaning:** "Stage" all changes. (Prepare them for saving).

### `git commit -m "messsage"`
*   **Meaning:** "Save" the changes permanently in history.

### `git push origin main`
*   **Meaning:** Upload the saved history to GitHub (Cloud).

---

## 6. Troubleshooting (The "Fix It" Section) 🔧

### Error 1: "Address already in use"
*   **Scenario:** You try to start server, it fails.
*   **Cause:** You have two terminals open running the same thing.
*   **Fix:** Find the running terminal and press `Ctrl + C` to stop it.

### Error 2: "Connection Refused" (Database)
*   **Scenario:** Spring Boot crashes on startup.
*   **Cause:** Postgres service is stopped.
*   **Fix:** usage `brew services start postgresql@14`.

---

## 7. Top Interview Questions (DevOps & Tools) 🎤

### Q1: Explain the difference between `git merge` and `git rebase`?
"Both integrate changes. `Merge` preserves history exactly as it happened (including the ugly 'merge commit'). `Rebase` rewrites history to make it look like a straight line, which is cleaner but dangerous if you rebase shared branches."

### Q2: What is CI/CD?
"Continuous Integration (CI) means automatically running tests/builds whenever code is pushed (e.g., GitHub Actions). Continuous Deployment (CD) means automatically releasing that code to the server if tests pass."

### Q3: Why do we use Docker?
"It solves the 'It works on my machine' problem. Docker packages the code *with* its environment (OS, libraries) into a Container, so it runs exactly the same on my laptop and the production server."

### Q4: What is the difference between `GET` and `POST`?
"GET is for retrieving data (safe, cacheable, data in URL). POST is for creating/sending data (not safe, data in Body, secure)."
