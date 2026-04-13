# 🎯 Skill Loop - Project Analysis & Placement Roadmap

**Date:** April 2026  
**Assessment Level:** 7/10 (Good foundation, needs hardening for interviews)  
**Target:** 9/10 (Placement-ready)

---

## 📊 PART 1: CURRENT CODE STRUCTURE OVERVIEW

### **Architecture Layers**

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React 19 + Vite + Tailwind)              │
│  - SPA with real-time updates                        │
│  - Component-based (reusable UI)                     │
└──────────────┬──────────────────────────────────────┘
               │ REST API + WebSocket
┌──────────────▼──────────────────────────────────────┐
│  Backend (Spring Boot 3.3 + Java 21)                │
│  - REST Controllers                                  │
│  - Service Layer (Business Logic)                    │
│  - Repository Layer (Database)                       │
│  - Schedulers (Background Jobs)                      │
└──────────────┬──────────────────────────────────────┘
               │ HTTP Microservice API
┌──────────────▼──────────────────────────────────────┐
│  ML Service (FastAPI + Python)                      │
│  - Sentiment Analysis                                │
│  - Recommendations                                   │
│  - Churn Prediction                                  │
│  - Resume Parsing                                    │
│  - GitHub Scraper                                    │
└──────────────┬──────────────────────────────────────┘
               │ PostgreSQL
┌──────────────▼──────────────────────────────────────┐
│  Database (PostgreSQL)                              │
│  - Users, Sessions, Chat, Connections               │
│  - Notifications, Badges                            │
└─────────────────────────────────────────────────────┘
```

### **Component Distribution**

#### **Backend (`server/`)**
✅ **Implemented:**
- `User` Entity (Skills, XP, Badges, Department)
- `Session` Entity + `SessionStatus` enum
- `ChatMessage` Entity + Real-time STOMP/SockJS
- `ConnectionRequest` (Skill exchange requests)
- `GithubProfile` (Auto-fetched data)
- `Notification` system
- Controllers: Auth, Profile, Session, Chat, Connection, Notification, Recommendation, Verification
- Services: Auth, Session, Chat, Connection, Gamification, Notification, GitHub, Recommendation
- Repositories: Custom JPA queries for Leaderboard, Churn
- Scheduler: `ChurnScheduler` (background job)
- Exception Handling: Global exception handler (partial)
- CORS configured

❌ **Missing/Incomplete:**
- Spring Security 6 + JWT authentication (CRITICAL)
- BCrypt password hashing
- Method-level authorization on endpoints
- WebSocket authentication
- API validation (@Valid on DTOs)
- Rate limiting
- OpenAPI/Swagger documentation
- Database indexes
- Pagination on list endpoints
- Integration & unit tests
- Health checks / Actuator
- Proper error response structure
- Transactional boundary management
- Async/Reactive patterns for ML calls

#### **Frontend (`client/`)**
✅ **Implemented:**
- Login/Signup pages
- Profile setup (skills, department)
- Dashboard with user card + features
- Session discovery & request flow
- Session card UI
- Real-time chat (WebSocket)
- Leaderboards (department-wise)
- Badge display system
- GitHub scraper integration
- Mock Interview modal
- Notification bell
- Theme toggle (Dark/Light)
- Responsive Tailwind + Framer Motion animations
- Axios config with interceptors
- API modules (auth, session, chat, etc.)

❌ **Missing/Incomplete:**
- Admin sentiment review dashboard
- Sentiment score display after review
- Pagination for chat history
- Calendar sync feature
- Video call integration (Zego setup pending)
- Whiteboard/code share UI
- Email verification page
- Profile completeness indicators
- Error states & loading patterns on key flows
- Form validation feedback
- Access token refresh logic
- Logout cleanup

#### **ML Service (`ml-service/`)**
✅ **Implemented:**
- Custom LSTM Sentiment Analyzer (84.15% accuracy on IMDB)
- FastAPI routes (`/api/sentiment/analyze`)
- **RAG Architecture for AI Interviewer** ✅ (LangChain + ChromaDB + Gemini embeddings)
  - Document ingestion with user-aware filtering
  - Interview question generation with resume context
  - Answer evaluation with scoring & feedback
  - Routes: `POST /interview/generate`, `POST /interview/evaluate`
- **Custom spaCy NER Model** ✅ (Job roles & skills extraction from resumes)
  - Training script: `scripts/train_ner_model.py`
  - Integration test: `scripts/test_integration.py`
- Resume Parser (NER-based + regex fallback)
- GitHub scraper
- Recommendation engine (cosine similarity)
- Churn prediction model
- Integrated with Java backend via HTTP

❌ **Missing/Incomplete:**
- Error handling & retry logic on ML calls (timeouts, circuit breaker)
- Request timeouts enforced
- Graceful degradation (fallback when ML is down)
- Model versioning & model cards
- Structured logging & observability
- Unit tests (`pytest`) for each service
- Endpoint health checks (`GET /health`)
- Request validation on all endpoints

---

## ✅ PART 2: FEATURES ALREADY IMPLEMENTED

### **Core Features (MVP)**
1. ✅ User authentication (Email/Password, no JWT yet)
2. ✅ Profile creation with skills (offer/want)
3. ✅ Skill discovery & filtering
4. ✅ Session request/accept/reject workflow
5. ✅ Real-time chat (STOMP over SockJS) - restricted to ACCEPTED sessions
6. ✅ Points/XP system (Skill points awarded on session completion)
7. ✅ Badge gamification (Enum-based badges)
8. ✅ Department-wise leaderboards
9. ✅ Notifications system (in-app)

### **Advanced Features (Phase 2)**
1. ✅ GitHub profile auto-fetch (scraper)
2. ✅ Sentiment analysis on session reviews (LSTM model)
3. ✅ Resume parsing (NER + regex extraction)
4. ✅ Churn prediction scheduler (daily job flagging inactive users)
5. ✅ Recommendation engine (skill matching with cosine similarity)
6. ✅ **AI Mock Interviewer 2.0 (RAG-based)** - Full RAG pipeline with Vector DB
   - LangChain + ChromaDB + Gemini embeddings
   - Context-aware question generation from user resumes
   - Answer evaluation with scoring
7. ✅ Centralized Axios interceptors
8. ✅ Environment variables (.env support)
9. ✅ **Custom spaCy NER Model** for job roles & skills extraction

### **UI/UX Polish**
1. ✅ Smooth animations (Framer Motion)
2. ✅ Dino loader (Interactive feedback)
3. ✅ Dark/Light theme toggle
4. ✅ Responsive design (Tailwind)
5. ✅ Session status tracking UI

---

## ❌ PART 3: FEATURES LEFT TO IMPLEMENT

### **🔴 CRITICAL (Blocking Placement Success)**

#### **1. Security Hardening (MUST DO - HIGH IMPACT)**
**Current State:** Plain text passwords, no JWT, no authorization checks  
**Why Critical:** Interns/entry-level are HEAVILY filtered on "Can you secure an app?"

| Feature | Effort | Impact | Timeline |
|---------|--------|--------|----------|
| Spring Security 6 + JWT | 6-8h | 40% | Week 1 |
| BCrypt password migration | 4h | 20% | Week 1 |
| Method-level @PreAuthorize | 4h | 15% | Week 1 |
| WebSocket JWT auth | 4h | 10% | Week 1 |
| Rate limiting (login/signup) | 3h | 10% | Week 2 |
| **Total effort** | **~24h** | | |

**Implementation Roadmap:**
1. Add `spring-boot-starter-security` + `jjwt` to `pom.xml`
2. Create `JwtTokenProvider` (sign/validate tokens)
3. Create `JwtAuthenticationFilter` (intercept requests)
4. Update `AuthService` to use `BCryptPasswordEncoder`
5. Annotate sensitive endpoints: `@PreAuthorize("hasRole('USER')")`
6. Update WebSocket STOMP config for JWT validation
7. Add rate limiting with `bucket4j` or custom interceptor

**Placement Impact:** This alone puts you in **top 2%** of campus candidates.

---

#### **2. Docker & CI/CD Pipeline (INTERVIEW PROOF)**
**Current State:** No Docker, no GitHub Actions, manual setup required  
**Why Critical:** "Can you ship and maintain this?" - Essential for DevOps interviews

| Feature | Effort | Impact | Timeline |
|---------|--------|--------|----------|
| docker-compose.yml | 3-4h | 25% | Week 1 |
| GitHub Actions CI | 4-5h | 20% | Week 2 |
| Health checks | 2h | 10% | Week 2 |
| .env.example setup | 1h | 5% | Week 1 |
| **Total effort** | **~12h** | | |

**Implementation Roadmap:**
1. Create `docker-compose.yml`:
   - PostgreSQL service
   - Spring Boot service (multi-stage build)
   - ML service (Python)
   - Optional: Nginx reverse proxy
2. Create `Dockerfile` for each service
3. GitHub Actions workflow (`.github/workflows/ci.yml`):
   - `mvn test` (Java)
   - `npm run build` (React)
   - `pytest` (Python)
   - Push to Docker Hub (optional)

**Placement Impact:** Immediate discussion point: "Walk me through your DevOps setup."

---

#### **3. API Documentation (OpenAPI/Swagger)**
**Current State:** No contract documentation, hard to integrate  
**Why Critical:** Professional APIs require this (20+ LPA expectation)

| Feature | Effort | Impact | Timeline |
|---------|--------|--------|----------|
| springdoc-openapi setup | 2h | 20% | Week 1 |
| Annotate endpoints (@Operation) | 4h | 30% | Week 2 |
| Document response/request DTOs | 2h | 20% | Week 2 |
| Swagger UI hosted | 1h | 10% | Week 2 |
| **Total effort** | **~9h** | | |

**Implementation:**
```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.0.0</version>
</dependency>
```

Then access: `http://localhost:9090/swagger-ui.html`

---

#### **4. Database Performance (Indexes + Pagination)**
**Current State:** No indexes, unbounded queries (N+1 risk)  
**Why Critical:** "What happens at 10,000 users?" - Scale discussion

| Feature | Effort | Impact | Timeline |
|---------|--------|--------|----------|
| Index hot columns | 2h | 25% | Week 1 |
| Pagination on lists | 4-5h | 35% | Week 2 |
| Query optimization | 3h | 20% | Week 2 |
| Load testing | 2h | 10% | Week 3 |
| **Total effort** | **~11h** | | |

**Quick Wins:**
```sql
-- Add these immediately
CREATE INDEX idx_user_email ON users(email); -- Auth queries
CREATE INDEX idx_session_status ON sessions(status); -- Active sessions
CREATE INDEX idx_chat_session ON chat_messages(session_id); -- Chat history
CREATE INDEX idx_notification_user ON notifications(user_id); -- Feed
CREATE INDEX idx_user_department ON users(department); -- Leaderboard
```

---

### **🟠 HIGH PRIORITY (Interview-Strength Features)**

#### **5. Testing Framework**
**Current State:** Zero test coverage in backend (Java); ML scripts have verification scripts but no pytest framework  
**Why Important:** "How do you ensure quality?" - Expected at 15+ LPA

```
Tests needed:
- SessionService.completeSession() ✅ (2h)
- ChatService.saveMessage() - must check ACCEPTED status (2h)
- AuthService.loginUser() + BCrypt flow (2h)
- REST layer: MockMvc for 3-4 critical endpoints (3h)
- E2E: Session workflow (request→accept→complete) (2h)
Total: ~11h for 70%+ coverage on critical paths
```

**Sample Test:**
```java
@Test
public void testChatRestrictedToAcceptedSessions() {
    Session s = sessionRepo.save(new Session(..., PENDING));
    assertThrows(Exception.class, 
        () -> chatService.saveMessage(s.getId(), "Hello"));
    
    s.setStatus(ACCEPTED);
    sessionRepo.save(s);
    chatService.saveMessage(s.getId(), "Now it works");
}
```

---

#### **6. ML Integration Hardening**
**Current State:** ML services (RAG, NER, sentiment) are implemented but lack resilience patterns  
**Why Important:** "What if ML is down?" - Essential for production stability

```
Roadmap:
- Add timeout guards on ML calls (RestTemplate timeout: 5-10s) (2h)
- Fallback: if sentiment fails, log & proceed with neutral score (1h)
- Retry logic with exponential backoff (max 3 retries) (2h)
- Health endpoint: GET /health on ML service (1h)
- Circuit breaker pattern for ML service calls (2h)
- Graceful degradation README (30m)
Total: ~8.5h
```

---

#### **7. Email Verification (University Domain Check)**
**Current State:** No domain validation  
**Why Important:** Trust & safety (placement narrative)

```
- Add @university domain validation in SignupRequest (1h)
- Email OTP verification (optional, but impressive) (4h)
- Whitelist allowed domains in application.properties (30m)
Total: ~5.5h
```

---

### **🟡 MEDIUM PRIORITY (Polish)**

#### **8. Admin Dashboard**
- Sentiment review queue (flag `needsReview = true` sessions)
- User management
- Abuse reports
- Category: 6-8 hours for MVP

#### **9. Video Call Integration**
- Complete Zego UIKit setup (currently partial)
- Test streaming quality
- Category: 3-4 hours (mostly config)

#### **10. Chat Enhancements**
- Read receipts (blue tick/delivered tick)
- Typing indicators
- Message reactions
- Category: 5-6 hours

#### **11. Calendar Sync**
- Google Calendar OAuth
- Auto-create Google Meet links
- Category: 6-8 hours

#### **12. Code Refactoring**
- Move pages to `src/pages/` folder
- Create `src/utils/` helpers
- Create `src/layouts/` for persistent UI
- DTOs to separate mapper layer
- Category: 4 hours

---

## 🎯 PART 4: BEST PRACTICES FOR PLACEMENT SUCCESS

### **A. Security Best Practices**

| Practice | Why | Implementation |
|----------|-----|-----------------|
| **Never trust the client** | Lateral movement risk | Server-side `ACCEPTED` check before chat |
| **Parameterized queries** | SQL injection | Already using JPA (native query check) |
| **JWT over sessions** | Scalability | Stateless tokens for distributed systems |
| **Secrets in env, never hardcoded** | Leakage risk | Use `@Value("${secret.key}")` + `.env` |
| **HTTPS in prod** | Data interception | AWS/Azure SSL certificates |
| **CORS only to trusted domains** | CSRF risk | Restrict to frontend domain in prod |
| **Rate limiting** | DDoS/brute force | `bucket4j` or Spring limiters |

---

### **B. Code Quality Best Practices**

| Practice | Placement Signal | Implementation |
|----------|-----------------|-----------------|
| **Global Exception Handling** | "Production-ready" | Enhance `GlobalExceptionHandler` with consistent error DTO |
| **DTO Validation** | "Prevents bugs" | Add `@NotNull`, `@Email`, `@Pattern` on request DTOs |
| **Pagination** | "Scalable thinking" | Add `Pageable` param to list endpoints |
| **Logging (Structured)** | "Observability" | Use SLF4J + logback with JSON format |
| **API Versioning** | "Future-proof" | (Low priority but shows maturity) |
| **Async Processing** | "High throughput" | @Async on notification sends, ML calls |
| **Caching** | "Performance" | @Cacheable on leaderboard queries |

---

### **C. Interview Narrative Best Practices**

**Your "Hero Story" (Pick ONE):**

```
OPTION A: Full-Stack + Real-Time
"I built a peer-to-peer skill exchange platform with:
- Spring Boot REST API (Sessions, Auth, Gamification)
- PostgreSQL with optimized queries (leaderboards)
- Real-time chat via WebSocket (STOMP) with server-side 
  access control (ACCEPTED status gate)
- React SPA with 7+ interactive components
Under scale: 10×users → discuss DB indexes + Redis cache"

OPTION B: ML-First
"I integrated an ML microservice into a full-stack app:
- Custom LSTM sentiment analyzer (84% accuracy)
- Graceful fallback when ML is unavailable
- Churn prediction job (background scheduler)
- Challenges: domain shift (IMDB → mentor feedback), 
  response latency. Mitigation: caching + threshold tuning"

OPTION C: DevOps/Shipping
"I made a portfolio app production-ready:
- Docker Compose with 3 microservices
- GitHub Actions CI (build, test, push)
- Security: JWT auth + BCrypt + HTTPS
- Health checks + structured observability"
```

---

## 📋 PART 5: PRIORITY-BASED IMPROVEMENT ROADMAP

### **Phase 1: Security Hardening (Weeks 1-2) — CRITICAL**
**Goal:** Make attacks impossible; prove you understand auth  
**Effort:** ~30 hours  
**Placement ROI:** 40%

- [ ] Implement Spring Security 6 + JWT
- [ ] BCrypt password migration + AuthService refactor
- [ ] Protected REST + WebSocket endpoints
- [ ] Rate limiting on auth routes
- [ ] .env setup with secrets

**Interview Question This Solves:**
> "Walk me through your authentication flow. Why JWT over sessions?"

---

### **Phase 2: Shipping & DevOps (Weeks 2-3) — CRITICAL**
**Goal:** One command run; CI/CD proof  
**Effort:** ~15 hours  
**Placement ROI:** 30%

- [ ] Docker Compose file (Postgres + Spring + ML + Nginx)
- [ ] GitHub Actions workflow (.yml)
- [ ] Spring Actuator health checks
- [ ] .env.example across all services
- [ ] README with architecture diagram

**Interview Question This Solves:**
> "How do you deploy this? Walk me through your CI/CD."

---

### **Phase 3: API Professionalism (Weeks 3-4) — HIGH PRIORITY**
**Goal:** Swagger docs + pagination + error handling  
**Effort:** ~15 hours  
**Placement ROI:** 25%

- [ ] OpenAPI/Swagger documentation
- [ ] Pagination on list endpoints
- [ ] Consistent error response DTO
- [ ] @Valid on all request DTOs
- [ ] Global exception handler enhancements

**Interview Question This Solves:**
> "How do you scale this to 100K users?"

---

### **Phase 4: Testing & Reliability (Weeks 4-5) — HIGH PRIORITY**
**Goal:** Prove quality; prevent regressions  
**Effort:** ~12 hours  
**Placement ROI:** 20%

- [ ] Unit tests (SessionService, ChatService, AuthService)
- [ ] Integration tests (3-4 critical REST endpoints)
- [ ] ML fallback tests
- [ ] E2E test (session workflow)
- [ ] Load test (100K session queries)

**Interview Question This Solves:**
> "How do you test this? What's your coverage?"

---

### **Phase 5: ML Production Narrative (Weeks 5-6) — MEDIUM PRIORITY**
**Goal:** Document ML reliability; domain limitations  
**Effort:** ~8 hours  
**Placement ROI:** 15%

- [ ] ML Service README (Problem → Solution → Metrics → Limitations)
- [ ] Timeout guards on sentiment/recommendation calls
- [ ] Fallback behavior when ML fails
- [ ] Metrics tracked (model latency, accuracy on holdout)
- [ ] Monitoring dashboard (optional)

**Interview Question This Solves:**
> "Your sentiment model is trained on IMDB movie reviews. How does that affect real mentor feedback?"

---

### **Phase 6: Polish & Nice-to-Have (Weeks 6-7) — LOW PRIORITY**
**Goal:** Interview edge cases; user delight  
**Effort:** ~20 hours

- [ ] Admin sentiment review dashboard
- [ ] Email verification (OTP)
- [ ] Video call streaming (complete Zego setup)
- [ ] Chat enhancements (read receipts, typing)
- [ ] Code refactoring (pages folder, utils, layouts)

---

## 🎯 IMPLEMENTATION TIMELINE (REALISTIC)

### **If you dedicate 6 hours/day:**

| Week | Focus | Completions | Placement Score |
|------|-------|-------------|-----------------|
| **W1** | Security + Env | Spring Security, JWT, DockerCompose | 6.5/10 |
| **W2** | DevOps + API | GitHub Actions, Swagger, Pagination | 7.5/10 |
| **W3** | Testing | Unit + Integration tests | 8.0/10 |
| **W4** | ML Documentation | Fallback, metrics, limitations | 8.5/10 |
| **W5** | Polish | Admin, email, video, refactoring | 9.0/10 |
| **W6** | Buffer | Bug fixes, performance tuning | 9.2/10 |

**If you complete through Week 3:** **Completely interview-ready (8/10)** — You'll get callbacks.

---

## 📊 CURRENT STATE vs. PLACEMENT TARGET

| Dimension | Now | Target | Gap |
|-----------|-----|--------|-----|
| **Security** | 2/10 | 9/10 | CRITICAL |
| **API Design** | 5/10 | 9/10 | HIGH |
| **Testing** | 0/10 | 8/10 | HIGH |
| **DevOps** | 0/10 | 9/10 | CRITICAL |
| **ML Integration** | **8/10** | 9/10 | LOW *(RAG + NER implemented)* |
| **Code Quality** | 6/10 | 8/10 | MEDIUM |
| **Documentation** | 4/10 | 9/10 | HIGH |
| **UX/Features** | 8/10 | 9/10 | LOW |
| **Overall** | **7/10** | **9/10** | **Gap: 2 Points (26 hrs)** |

---

## 🚀 ACTION ITEMS (Start Here)

### **This Week (4-6 hours):**
1. [ ] Create session memory file tracking implementation progress
2. [ ] Add Spring Security dependency to `pom.xml`
3. [ ] Draft `docker-compose.yml` (Postgres + Spring + ML)
4. [ ] Create `.env.example` files

### **Next Week (8-10 hours):**
1. [ ] Implement `JwtTokenProvider` + `JwtAuthenticationFilter`
2. [ ] Migrate auth to BCrypt (data migration for test users)
3. [ ] Add `@PreAuthorize` to sensitive endpoints
4. [ ] Build & test `docker-compose up`

### **Week 3 (6-8 hours):**
1. [ ] Add OpenAPI/Swagger
2. [ ] Implement pagination on user lists
3. [ ] Write 5 unit tests (SessionService, ChatService)
4. [ ] GitHub Actions workflow

---

## 🎓 References for Learning

| Topic | Resource | Time |
|-------|----------|------|
| Spring Security | Spring Docs + Baeldung | 3h |
| JWT Best Practices | jwt.io + Article | 1h |
| Docker Compose | Official Docs | 2h |
| GitHub Actions | GitHub Docs + Examples | 2h |
| Testing (MockMvc) | Baeldung | 2h |

---

## ✋ Notes for Interviews

**When asked "What would you do differently?":**

> "In production, I would:
> 1. Add Spring Security + JWT (currently using plain password)
> 2. Implement database connection pooling + query indexing
> 3. Set up comprehensive logging + monitoring
> 4. Add rate limiting + abuse detection
> 5. Deploy on cloud (AWS/Azure) with auto-scaling
> 6. Implement API versioning for backward compatibility
> 7. Add data encryption (TLS + field-level encryption)
> 8. Set up alerting for ML service failures"

This shows **production thinking** 🎯

---

## 🏆 Expected Interview Questions

1. **"Walk me through authentication"** → Spring Security + JWT flow (diagram it)
2. **"How do you handle real-time chat?"** → STOMP/WebSocket, ACCEPTED gate
3. **"What breaks at 10K users?"** → DB indexes, Redis cache, horizontal scaling
4. **"How do you test this?"** → Unit tests example, MockMvc, integration tests
5. **"Your ML is slow — what now?"** → Caching, async processing, fallback
6. **"How is this deployed?"** → Docker Compose, GitHub Actions, health checks
7. **"Security vulnerabilities?"** → JWT expiry, BCrypt, SQL injection prevention
8. **"What's the biggest lesson?"** → Domain shift in ML / Scalability / Observability

---

## 📌 Conclusion

**Your project is STRONG (7.5/10).** You've already implemented the "cool" features (RAG, NER, sentiment analysis) which puts you ahead of most candidates. 

With **25-30 hours** of focused work on **security, DevOps, and testing**, you'll be in **top 1% of campus candidates (9/10).**

### **Key Insight:**
Your ML/AI implementations (RAG + Custom NER) are **placement gold**. Most candidates don't have these. Focus now on:
1. **Security hardening** (JWT + BCrypt) - Interview expectation
2. **DevOps/Docker** (show you can ship it)
3. **Tests + error handling** (show you handle failures)

**Start with security this week** — that's the unlock for 20+ LPA conversations. Your AI features already differentiate you; hardening makes you hireable.

