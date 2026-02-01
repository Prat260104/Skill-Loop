# Smart Matching & Recommendation System Implementation Plan 🧠🤝

**Objective:**
Implement a "Recommended Mentors" feature that suggests the best matching mentors for a student based on their `Skills Wanted` vs. Mentors' `Skills Offered` and `Bio`.

**Approach:**
We will use **Content-Based Filtering** with **TF-IDF (Term Frequency-Inverse Document Frequency)** and **Cosine Similarity**. This handles semantic matching better than simple exact keyword matching (e.g., relating "Frontend" contextually to "React" if they appear together in profiles).

---

## 1. High-Level Architecture 🏗️

1.  **Frontend (React):** request recommendations for the logged-in user.
2.  **Backend (Spring Boot):** Acts as a bridge. It fetches the current user's profile and asks the ML Service for matches.
3.  **ML Service (Python):**
    *   Receives the target user's "Query" (Skills Wanted + Bio).
    *   Fetches potential candidates (All Mentors) from the Database (or receives them from Backend).
    *   Calculates similarity scores using TF-IDF & Cosine Similarity.
    *   Returns the top 5 User IDs.

---

## 2. Step-by-Step Implementation Guide 📝

### Phase 1: ML Service (The Brain) 🐍
**File:** `ml-service/app/services/recommendation.py` (New File)

1.  **Dependencies:** Add `scikit-learn` and `numpy` to `requirements.txt`.
2.  **Logic:**
    *   Create a class `RecommenderSystem`.
    *   **Data Prep:** Combine `skills_offered`, `bio`, and `role` into a single "text features" string for every user.
    *   **Vectorization:** Use `sklearn.feature_extraction.text.TfidfVectorizer` to convert these text strings into number vectors.
    *   **Similarity:** Use `sklearn.metrics.pairwise.cosine_similarity` to calculate the angle between the Current User's "Wanted" vector and every Mentor's "Offered" vector.
    *   **Ranking:** Sort by score (Highest first) and return top N results.

### Phase 2: Backend (The Orchestrator) ☕
**File:** `server/src/.../controller/UserController.java`

1.  **New Endpoint:** `GET /api/users/recommendations`
2.  **Process:**
    *   Fetch the current logged-in user.
    *   Fetch all other users (Candidates) from `UserRepository`.
    *   Prepare a JSON payload containing the Current User + Candidate List.
    *   **POST** this payload to ML Service (`http://localhost:8000/api/v1/recommend`).
    *   Receive the list of Top Matches.
    *   Return this list to the Frontend.

### Phase 3: Frontend (The UI) ⚛️
**File:** `client/src/components/Dashboard/RecommendedMentors.jsx` (New Component)

1.  **UI Design:**
    *   A horizontal scrollable list or grid cards.
    *   Card shows: Mentor Name, Avatar, Top Skills, and a **"Match Score"** (e.g., "95% Match").
    *   "Connect" button (Logic can come later).
2.  **Integration:**
    *   Call `GET /api/users/recommendations` on Dashboard load.
    *   Show a "Skeleton Loader" while fetching.

---

## 3. Future Enhancements (The "Pro" Move) 🚀

*   **Kaggle Dataset Pre-training:**
    *   Later, we can train the TF-IDF model on a large generic dataset of developer resumes from Kaggle.
    *   This will help the model understand that "React" and "Redux" are related even if they never appear together in *our* small database (fixing the Cold Start/Sparse Data problem).
*   **Weighted Scoring:** Give more weight to "Verified Skills" vs unverified ones.

---

## 4. Next Actions for "Tomorrow" ☀️
1.  Run `pip install scikit-learn` in `ml-service`.
2.  Create the `recommendation.py` logic.
3.  Connect the Backend endpoint.
