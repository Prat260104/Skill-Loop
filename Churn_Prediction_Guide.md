# 🤖 MasterClass: AI-Powered Churn Prediction System

Is guide mein hum seekhenge ki **Skill Loop** mein hum ek **Real-World AI Feature** kaise implement karne wale hain.

---

## 🚀 1. What is the Problem? (Why needed?)

**Scenario:**
Skill Loop ek platform hai jahan students aur mentors connect hote hain.
Agar koi user **15-20 din tak login nahi karta**, to high chance hai ki wo **platform chod kar chala gaya hai** (Churn).

**Goal:**
Humein aise users ko **identify** karna hai aur unhe **wapas laana** hai (Retention).

**Old Way (Rule-Based):**
"Jo 15 din se nahi aya, usse email bhej do."
(Problem: Ye "Reactive" hai. Nuksaan ho chuka hai.)

**New Way (AI/ML):**
"User ka behaviour dekho aur **predict** karo ki kaun chodne wala hai, usse pehle hi rok lo!"
(Benefit: Ye "Proactive" hai.)

---

## 🏗️ 2. High-Level Architecture (The Big Picture)

Humara system 4 components se mil kar banega:

```mermaid
graph TD
    A[🕒 Spring Scheduler] -->|1. Wakes up at 2 AM| B[☕ Java Backend Service]
    B -->|2. Fetches User Data| D[📂 Database]
    B -->|3. Sends Data for Prediction| E[🧠 ML Service (Python)]
    E -->|4. Returns Probability Score (0-100%)| B
    B -->|5. If Risk > 70%| F[📧 Email/Notification Service]
    F -->|6. Sends 'Miss You' Email| G[👤 User]
```

### Components Breakdown:

1.  **Spring Scheduler (The Alarm Clock):**
    *   Roz raat 2 baje uthega.
    *   Initialize karega process ko.

2.  **Java Backend (The Manager):**
    *   Database se users ka data nikaalega.
    *   ML Service se baat karega (API Call).
    *   Decision lega (Email bhejna hai ya nahi).

3.  **ML Service (The Brain):**
    *   Iske paas ek trained Model hai using **Random Forest Classifier** (ya **XGBoost** for advanced cases).
    *   **Why Random Forest?** Kyunki ye non-linear patterns (complex user behavior) ko better samajhta hai compared to simple queries.
    *   Input: `DaysSinceLogin`, `SessionsAttended`, `ProfileCompletion`, `ResponseTime`.
    *   Output: `Churn Probability` (e.g., 0.85).

4.  **Notification Service (The Messenger):**
    *   User ko personalized message bhejega.

---

## 🛠️ 3. Implementation Steps (Kaise Banayenge?)

Hum isse **Step-by-Step** implement karenge:

### Step 1: Data Tracking (Java Backend)
Sabse pehle humein data collect karna hoga.
*   **Action:** `User` table mein `last_login_date` add karenge.
*   **Logic:** Jab bhi user login karega, ye date update hogi.

### Step 2: The Brain (ML Service)
Python mein ek simple API banayenge jo prediction degi.
*   **Endpoint:** `POST /predict-churn`
*   **Input JSON:**
    ```json
    {
      "days_since_last_login": 20,
      "sessions_attended": 2,
      "profile_score": 40
    }
    ```
*   **Logic (Simplified):**
    ```python
    # Agar 15 din se zyada ho gaye aur sessions kam hain -> HIGH RISK
    if days > 15 and sessions < 5:
        return 0.90  # 90% chance of churn
    else:
        return 0.10  # 10% chance
    ```
*(Note: Real world mein yahan scikit-learn ka model load hoga)*.

### Step 3: The Manager (Scheduler)
`ChurnScheduler.java` likhenge.

```java
// Logic inside Scheduler
List<User> users = userRepository.findAll();

for (User user : users) {
    // 1. Calculate Data
    int days = calculateDaysSinceLogin(user.getLastLogin());
    
    // 2. Ask ML Service
    double riskScore = mlClient.getChurnProbability(days, user.getSessionCount(), user.getProfileScore());
    
    // 3. Take Action
    if (riskScore > 0.70) {
        notificationService.sendRetentionEmail(user);
    }
}
```

---

## 🎓 4. Placement & Interview Q&A

**Q: Why did you use a Scheduler?**
**A:** Because checking churn is a batch process. Doing it in real-time (e.g., on every API call) would slow down the app. Running it at night (2 AM) ensures no impact on active users.

**Q: Why separate ML Service?**
**A:** Decoupling. The heavy math/prediction logic stays in Python (best for ML), while the business logic stays in Java. They communicate via REST API. This is a Microservices pattern.

**Q: How do you handle scalability?**
**A:** If we have 1 Million users, fetching all at once will crash the server. We would use **Pagination** (fetch 1000 users at a time) in the Scheduler loop.

---

## ✅ Ready?

Agar concept clear hai, to hum coding start karein?
**Order:**
1.  Backend Tracking (`User.java`, `AuthService`).
2.  ML Service Logic (`churn_model.py`).
3.  Connecting them (`ChurnScheduler.java`).
