# Skill Loop — Placement & Interview Training Guide

Use this document alongside [`future_plan.md`](future_plan.md). **Product features** live in `future_plan.md`; **what interviewers expect** for strong campus / 20+ LPA–tier shortlists is captured here.

---

## 1. Honest bar: what “10/10” means

- **10/10** (placement lens): looks like a **small shippable product** — security, tests, deploy story, and **clear tradeoffs** you can defend for 30 minutes.
- **Solo student reality**: **8–9/10** is already exceptional; **10** needs polish most portfolios skip (tests, observability, hardening).
- **Skill Loop’s edge**: Spring Boot + PostgreSQL + **Python ML microservice** + React + **real-time chat** + session domain — good bones; **auth and shipping** close the gap.

---

## 2. Pick one “hero narrative” for interviews

Don’t claim equal depth on everything. Choose **one** thread you can whiteboard:

| Track | You emphasize |
|--------|----------------|
| **Full-stack + real-time** | Session lifecycle, STOMP chat, server-side `ACCEPTED` gate, PostgreSQL. |
| **ML integration** | Recommendations, sentiment pipeline, churn job — failures, timeouts, domain gap (IMDB vs mentor text). |
| **Production** | Security, Docker, CI, OpenAPI, degradation when ML is down. |

Mention the others on the resume; **go deep** on one.

---

## 3. Rating you vs. the bar (rough self-check)

| Dimension | What moves the needle |
|-----------|------------------------|
| **Security / auth** | Spring Security, JWT, BCrypt; protected APIs; WebSocket auth story. |
| **Shipping** | Docker Compose, README one-command run, `.env.example`. |
| **API discipline** | OpenAPI/Swagger, consistent errors, validation. |
| **Data** | Indexes, pagination, avoid N+1 on hot lists. |
| **ML credibility** | Metrics, limitations, graceful degradation. |
| **Tests** | A few integration tests > zero coverage with buzzwords. |

---

## 4. Checklist toward “premium interview” readiness

### 4.1 Security & identity (highest ROI)

- [ ] **Spring Security 6** + **JWT** (access token; optional refresh).
- [ ] **BCrypt** (or Argon2) for passwords; migrate dev users once.
- [ ] **Authorize every sensitive endpoint** — not only UI hiding.
- [ ] **STOMP/WebSocket**: validate principal (JWT in connect header, or short-lived STOMP ticket from REST).
- [ ] **Rate limiting** on login/signup and chat (even bucket4j in-memory for demo).
- [ ] **Secrets in env only**; never commit real keys.

### 4.2 Production shape

- [ ] **`docker-compose.yml`**: PostgreSQL + `server` + `ml-service` (+ optional `client` or static nginx).
- [ ] **GitHub Actions**: `mvn test`, `npm run build`, `pytest` (start small).
- [ ] **Health**: Spring Actuator `/actuator/health` (or equivalent) + ML health route.

### 4.3 API & contracts

- [ ] **OpenAPI / Swagger UI** for Spring.
- [ ] Stable **error JSON** via `@ControllerAdvice` (already partially there — keep consistent).
- [ ] **`@Valid`** on write DTOs; meaningful 400 responses.

### 4.4 Data & performance

- [ ] **Indexes**: `email`, session lookups, `chat` by `session_id`, leaderboard-related columns.
- [ ] **Pagination** for chat history and long user/session lists.
- [ ] (Optional) **Redis** for leaderboard cache or rate limits — only if you can explain **why**.

### 4.5 ML narrative (README: ~1 page)

- Problem → model → **metrics** on holdout → **limitations** (domain shift) → mitigations (threshold, human review).
- **Degraded mode**: ML unavailable → still complete session; log + optional neutral sentiment.

### 4.6 Testing

- [ ] **Server**: unit tests for `SessionService`, `ChatService`; MockMvc on a few critical APIs.
- [ ] **Client**: 1–2 RTL tests (login + one dashboard path).
- [ ] **ML**: pytest for parser/API contracts.

### 4.7 Observability

- [ ] Structured logging; correlation id (optional).
- [ ] Metrics endpoint or clear error logging for ops questions.

### 4.8 UX / trust (product + interview)

- [ ] Sentiment **score/label** after review (where appropriate).
- [ ] **Admin queue** for `needsReview` sessions.
- [ ] Empty/error states on main flows.

---

## 5. Resume bullet pattern

**Action + tech + outcome** (avoid vague “AI-powered”):

- *Implemented session lifecycle in **Spring Boot** with **JPA**; enforced chat only when session **ACCEPTED** (server-side).*
- *Integrated **FastAPI** microservice for matching and sentiment; **resilient** calls when ML is unavailable.*
- *Real-time messaging with **STOMP/SockJS**; messages stored in **PostgreSQL**.*

---

## 6. Interview questions to rehearse

- What breaks at **10× users**? (DB, WebSocket stickiness, ML latency.)
- How do you **prevent abuse** of reviews / chat?
- Why **separate ML service**? Why **JWT** vs cookies?
- **Tradeoff**: Zego vs raw WebRTC (time to market vs control).

---

## 7. Realistic targets

| Target | Typical bundle |
|--------|----------------|
| **~8/10** | Security + JWT + BCrypt + Docker Compose + README + Swagger |
| **~9/10** | Above + tests + indexes + admin sentiment + ML README section |
| **~10/10** | Above + observability + rate limits + WebSocket auth + polish |

---

## 8. Link to repo work

Track concrete tasks in **`future_plan.md`** → section **“Placement & engineering bar”** and the **checklist** at the bottom. Update checkboxes as you ship.
