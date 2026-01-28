# 🧠 SkillLoop: AI Microservice Roadmap

**Goal:** Implement "True AI" capabilities using a Microservices Architecture.
**Feature:** Smart Resume Parser (Auto-fill Profile from PDF).

---

## 🏗️ Architecture Design (Industry Standard)

We will move from a "Monolithic" app to a "Microservices" pattern.

```mermaid
graph LR
    User[Client (React)] -- Upload PDF --> Java[Spring Boot Backend]
    Java -- POST /analyze --> Python[AI Service (FastAPI)]
    Python -- JSON Result --> Java
    Java -- Save to DB --> DB[(PostgreSQL)]
```

### 1. Java Backend (The Orchestrator)
*   **Role:** Receives the file, handles security, updates the database.
*   **Action:** Acts as a client calling the Python API.

### 2. Python Microservice (The Brain) 🐍
*   **Framework:** **FastAPI** (Modern, High-performance, widely used for ML).
*   **NLP Library:** **spaCy** (Industrial strength NLP) or **HuggingFace** (Transformer models).
*   **PDF Tool:** `pdfplumber` or `PyPDF2`.

---

## 🛠️ Implementation Steps (For Tomorrow)

### Phase 1: Setup Python Service
1.  **Folder Structure:** We will create a root level `ml-service` folder (next to `server` and `client`).
2.  **Environment:** Set up `venv` and install `fastapi uvicorn spacy pdfplumber`.
3.  **Endpoint:** Create a `POST /parse-resume` endpoint.

### Phase 2: Build the Resume Parser
1.  **Text Extraction:** Write logic to read PDF bytes and convert to String.
2.  **Entity Recognition (NER):** Use `spaCy` (e.g., `en_core_web_sm`) to identify:
    *   **SKILL:** (e.g., "Python", "React")
    *   **ORG:** (e.g., "Google", "IIT") -> *Map to Experience Section*
    *   **DATE:** (e.g., "2020-2022") -> *Map to Duration*
    *   **PERSON:** (Name)
3.  **JSON Response:** Structure data to include `experience` list alongside skills.

### Phase 3: Connect Java to Python
1.  **Java Client:** Use `RestTemplate` or `WebClient` in Spring Boot.
2.  **Controller:** Add `POST /api/user/{id}/resume` in `ProfileController`.
3.  **Flow:** Java receives file -> sends to Python -> receives JSON -> updates `User` entity.

### Phase 4: Frontend & Database Updates (Experience Section)
1.  **Database:** Update `User.java` to include an `experience` field (List of Objects or JSONString).
2.  **Frontend:** Update `ProfilePage.jsx` to show a new "**💼 Work Experience**" section.
3.  **Integration:** The Resume Parser will auto-fill this section too!

---

## 📝 Resume Keywords You Will Earn
*   **Microservices Architecture**
*   **Polyglot Programming (Java + Python)**
*   **Natural Language Processing (NLP)**
*   **FastAPI & REST Integration**
*   **Named Entity Recognition (NER)**

---

**Ready to execute TOMORROW!** 🚀
