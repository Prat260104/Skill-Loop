# 🎯 PRIORITY MATRIX & IMPLEMENTATION ROADMAP
## What to Do First, What Later (Ranked by Impact + Effort)

**Created:** April 13, 2026  
**Assumption:** 6 hours/day, starting this week

---

## 📊 PRIORITY RANKING SYSTEM

Each feature is rated on:
- **Impact** (1-10): How much does it help placement?
- **Effort** (hours): How long to implement?
- **Blocking** (Y/N): Does it block other work?
- **Interview** (Y/N): Will interviewers ask about it?

---

## 🔴 TIER 1: DO IMMEDIATELY (This Week)

### **1. Spring Security + JWT Authentication**
| Aspect | Rating |
|--------|--------|
| **Impact** | 10/10 |
| **Effort** | 8 hours |
| **Blocking** | YES (blocking everything) |
| **Interview** | YES (first question) |
| **ROI** | Best |

**Why FIRST?**
- ❌ Current: Plain text passwords stored in DB
- ❌ No authorization checks (no Spring Security)
- ❌ Anyone can access any session
- ✅ This fixes the biggest security hole

**What to do:**
1. Add dependencies to `pom.xml`:
   - `spring-boot-starter-security`
   - `jjwt` (JWT library)
2. Create `JwtTokenProvider` class
3. Create `JwtAuthenticationFilter`
4. Update `AuthService` to use `BCryptPasswordEncoder`
5. Annotate endpoints with `@PreAuthorize("hasRole('USER')")`
6. Test login flow

**Interview Impact:**
> Interviewer: "Walk me through your authentication."
> You: "Spring Security with JWT. Passwords hashed with BCrypt. Stateless tokens. Here's the flow..."
> **Immediate respect +200%**

---

### **2. Docker Compose Setup**
| Aspect | Rating |
|--------|--------|
| **Impact** | 10/10 |
| **Effort** | 4 hours |
| **Blocking** | YES (for shipping) |
| **Interview** | YES (DevOps question) |
| **ROI** | Excellent |

**Why SECOND?**
- ❌ Current: Manual setup (follow README)
- ✅ Goal: `docker-compose up` and everything runs

**What to do:**
1. Create `docker-compose.yml` with 3 services:
   - PostgreSQL (database)
   - Spring Boot (backend)
   - FastAPI (ML service)
2. Create `.env.example` with placeholders
3. Create Dockerfiles for Spring Boot and FastAPI
4. Test: `docker-compose up` from scratch

**Interview Impact:**
> Interviewer: "Can you scale this?"
> You: "Yes. Docker Compose locally, Kubernetes in production. Here's my setup..."
> **Shows DevOps maturity.**

---

### **3. Create `.env.example` Files**
| Aspect | Rating |
|--------|--------|
| **Impact** | 8/10 |
| **Effort** | 1 hour |
| **Blocking** | NO |
| **Interview** | YES (security question) |
| **ROI** | Fastest value |

**What to do:**
```
# Root .env.example
VITE_API_URL=http://localhost:9090
VITE_ZEGO_APP_ID=your_zego_app_id
VITE_ZEGO_SERVER_SECRET=your_zego_secret

# server/.env.example
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/skillloop
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password
JWT_SECRET=your_secret_key_here

# ml-service/.env.example
GOOGLE_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://localhost/skillloop
```

**Why Important:**
- Shows you understand secrets management
- Makes onboarding new developers easy
- Demonstrates production thinking

---

## 🟠 TIER 2: DO IN WEEK 2 (HIGH PRIORITY)

### **4. GitHub Actions CI Pipeline**
| Aspect | Rating |
|--------|--------|
| **Impact** | 9/10 |
| **Effort** | 5 hours |
| **Blocking** | NO |
| **Interview** | YES (CI/CD setup) |
| **ROI** | High |

**Why Week 2?**
- Depends on: Having tests to run
- Required for: Shipping story

**What to do:**
1. Create `.github/workflows/ci.yml`
2. Run on push to main:
   - Java: `mvn test`
   - Frontend: `npm run build`
   - Python: `pytest`
3. Optional: Push to Docker Hub

**Timeline:** ~5 hours

---

### **5. OpenAPI/Swagger Documentation**
| Aspect | Rating |
|--------|--------|
| **Impact** | 8/10 |
| **Effort** | 4 hours |
| **Blocking** | NO |
| **Interview** | YES (API design) |
| **ROI** | High |

**Why Week 2?**
- Low effort, high signal
- Shows you understand API contracts
- Helps integration testing

**What to do:**
1. Add `springdoc-openapi` to `pom.xml`
2. Annotate endpoints with `@Operation`
3. Access at `http://localhost:9090/swagger-ui.html`
4. Document request/response schemas

**Timeline:** ~4 hours

---

### **6. Database Indexes**
| Aspect | Rating |
|--------|--------|
| **Impact** | 7/10 |
| **Effort** | 2 hours |
| **Blocking** | NO |
| **Interview** | YES (performance) |
| **ROI** | Quick stability win |

**What to do:**
```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_session_status ON sessions(status);
CREATE INDEX idx_chat_session ON chat_messages(session_id);
CREATE INDEX idx_notification_user ON notifications(user_id);
CREATE INDEX idx_user_department ON users(department);
```

**Why Important:**
- Shows you think about scale
- Auth queries will be fast
- Leaderboard queries will be fast

**Timeline:** ~2 hours

---

### **7. ML Service Resilience (Timeouts + Retry)**
| Aspect | Rating |
|--------|--------|
| **Impact** | 8/10 |
| **Effort** | 4 hours |
| **Blocking** | NO (but important) |
| **Interview** | YES (reliability) |
| **ROI** | High |

**What to do:**
1. Add timeout to RestTemplate calls (5-10 seconds)
2. Add retry logic with exponential backoff
3. Graceful fallback: if sentiment fails, log and continue
4. Add health check endpoint

**Example Code:**
```java
// In SessionService
RestTemplate restTemplate = new RestTemplate();
// Set timeout
HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
factory.setConnectTimeout(5000);
factory.setReadTimeout(10000);
restTemplate.setRequestFactory(factory);

// Retry logic
@Retryable(value = {IOException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
public SentimentResponse analyseSentiment(String text) { ... }
```

**Timeline:** ~4 hours

---

## 🟡 TIER 3: DO IN WEEK 3 (MEDIUM PRIORITY)

### **8. Unit Tests (Backend)**
| Aspect | Rating |
|--------|--------|
| **Impact** | 8/10 |
| **Effort** | 8 hours |
| **Blocking** | NO |
| **Interview** | YES (quality) |
| **ROI** | Medium-High |

**What to test:**
1. `SessionService.completeSession()` - 2h
   - Test points awarded
   - Test ACCEPTED check
2. `ChatService.saveMessage()` - 2h
   - Test ACCEPTED gate
   - Test unauthorized error
3. `AuthService.loginUser()` - 2h
   - Test BCrypt validation
4. REST endpoints (MockMvc) - 2h

**Why Week 3?**
- After security is in place (auth tests need JWT)
- Required for CI/CD

**Timeline:** ~8 hours for 70% coverage

---

### **9. Pagination on List Endpoints**
| Aspect | Rating |
|--------|--------|
| **Impact** | 7/10 |
| **Effort** | 4 hours |
| **Blocking** | NO |
| **Interview** | YES (scalability) |
| **ROI** | Medium |

**What to do:**
1. Update leaderboard endpoints: `GET /api/user/leaderboard?page=0&size=10`
2. Update chat history: `GET /api/sessions/{id}/chat?page=0&size=50`
3. Update session lists: `GET /api/sessions?page=0&size=10`
4. Use `Spring Data Pageable`

**Timeline:** ~4 hours

---

### **10. Frontend Tests (Jest/RTL)**
| Aspect | Rating |
|--------|--------|
| **Impact** | 7/10 |
| **Effort** | 6 hours |
| **Blocking** | NO |
| **Interview** | YES (quality) |
| **ROI** | Medium |

**What to test:**
1. Login flow - 2h
2. ProfileSetup component - 2h  
3. ChatBox sends messages - 2h

**Timeline:** ~6 hours for critical paths

---

## 🟢 TIER 4: NICE TO HAVE (Week 4+)

### **11. Email Verification (OTP)**
| Impact | Effort | ROI |
|--------|--------|-----|
| 6/10 | 4h | Low |

**Why lower priority:**
- Good for trust but not critical
- Can be added later

---

### **12. Admin Sentiment Dashboard**
| Impact | Effort | ROI |
|--------|--------|-----|
| 6/10 | 6h | Low |

**Why later:**
- Feature polish, not core functionality
- Can be added for final touches

---

### **13. Video Call Enhancement**
| Impact | Effort | ROI |
|--------|--------|-----|
| 5/10 | 3h | Medium |

**Why later:**
- Already have basic Zego integration
- Polish feature, not core

---

### **14. Code Refactoring**
| Impact | Effort | ROI |
|--------|--------|-----|
| 5/10 | 4h | Low |

**Why later:**
- Doesn't affect interviews
- Frontend is already good

---

## 📅 RECOMMENDED TIMELINE (6 hours/day)

### **WEEK 1: Foundation (Security)**
```
Monday-Tuesday (12h):
├─ Spring Security + JWT (8h) ⭐ CRITICAL
├─ .env.example files (1h) ⭐ QUICK WIN
└─ Test login/auth (3h)

Wednesday-Friday (18h):
├─ Docker Compose (4h) ⭐ CRITICAL
├─ Database indexes (2h)
├─ ML timeout guards (4h)
├─ Test docker-compose up (2h)
└─ Buffer/fixes (2h)

End of Week Score: 6.5-7/10 ✅
- Auth is secure
- Can be deployed
```

### **WEEK 2: Polish (API + CI/CD)**
```
Monday-Wednesday (18h):
├─ GitHub Actions CI (5h)
├─ OpenAPI/Swagger (4h)
├─ Pagination endpoints (4h)
└─ Testing/fixes (5h)

Thursday-Friday (12h):
├─ Backend unit tests START (6h)
├─ Testing/buffer (6h)

End of Week Score: 7.5-8/10 ✅
- Professional API
- CI/CD pipeline
- Better scale story
```

### **WEEK 3: Quality (Tests)**
```
Monday-Wednesday (18h):
├─ Complete unit tests (8h)
├─ Frontend tests (6h)
├─ Testing/fixes (4h)

Thursday-Friday (12h):
├─ ML service tests (3h)
├─ Integration testing (3h)
├─ Performance tuning (3h)
├─ Documentation (3h)

End of Week Score: 8.5-9/10 ✅
- Fully tested
- Interview ready
- Professional quality
```

---

## 🏆 INTERVIEW READINESS BY WEEK

### **End of Week 1: 6.5/10**
```
✅ "I have secure authentication with JWT and BCrypt"
✅ "I can deploy with docker-compose up"
✅ "ML service has timeout guards"
❌ "I don't have tests yet" (acceptable for early rounds)
```

### **End of Week 2: 7.5/10**
```
✅ All of Week 1
✅ "My API is fully documented with Swagger"
✅ "I have CI/CD pipeline with GitHub Actions"
✅ "Database is indexed for performance"
❌ "Still working on comprehensive tests" (getting there)
```

### **End of Week 3: 8.5-9/10**
```
✅ All of Week 1-2
✅ "All critical paths tested with unit + integration tests"
✅ "70%+ test coverage on core services"
✅ "Production-grade architecture"
```

---

## 💡 STRATEGIC INSIGHTS

### **Why This Order?**

1. **Week 1 = Blocking Issues**
   - Security (make it unhackable)
   - Deployment (make it shippable)
   - Without these, nothing else matters

2. **Week 2 = Interview Signal**
   - API documentation
   - CI/CD
   - Shows you think like a DevOps engineer

3. **Week 3 = Seal the Deal**
   - Tests = convince them you think about quality
   - Tests + everything else = 9/10

### **What NOT to Do**
- ❌ Don't spend time on "nice features" (email OTP) before security
- ❌ Don't refactor code before testing
- ❌ Don't optimize performance before having tests
- ❌ Don't add complexity before shipping

### **The Golden Rule**
> **Ship > Perfect**
> Get JWT + Docker working first (Week 1). Then add polish (Week 2-3).

---

## 🎯 MAKE-OR-BREAK TASKS

If you **only have time for 2 weeks**, do these 6:

| Week | Task | Hours | Must-Have |
|------|------|-------|-----------|
| **1** | Spring Security + JWT | 8h | ⭐⭐⭐ |
| **1** | Docker Compose | 4h | ⭐⭐⭐ |
| **2** | GitHub Actions | 5h | ⭐⭐⭐ |
| **2** | Swagger | 4h | ⭐⭐ |
| **2** | ML Timeouts | 4h | ⭐⭐ |
| **3** | Unit Tests | 8h | ⭐⭐ |

**Total: 33 hours = 1 week at 6h/day**

---

## 📋 QUICK REFERENCE CHECKLIST

### **Week 1 Checklist**
- [ ] `spring-boot-starter-security` added to pom.xml
- [ ] `JwtTokenProvider` class created
- [ ] `JwtAuthenticationFilter` created
- [ ] `BCryptPasswordEncoder` implemented
- [ ] Test login with JWT token
- [ ] `docker-compose.yml` created
- [ ] `.env.example` files created
- [ ] `docker-compose up` runs all 3 services
- [ ] ML timeouts configured
- [ ] All data migrations tested

### **Week 2 Checklist**
- [ ] `.github/workflows/ci.yml` created
- [ ] `mvn test`, `npm build`, `pytest` run in CI
- [ ] Swagger/OpenAPI documented
- [ ] Database indexes created
- [ ] Pagination on 3+ list endpoints
- [ ] ML retry logic tested

### **Week 3 Checklist**
- [ ] SessionService tests (4/4 methods)
- [ ] ChatService tests (2/2 methods)
- [ ] AuthService tests (login + signup)
- [ ] 3-4 REST endpoints with MockMvc
- [ ] Frontend Jest tests (Login, Profile)
- [ ] Test coverage report generated

---

## Final Score Progression

```
Current:  7/10 (Good foundation, needs shipping)
  ↓
Week 1:   6.5-7/10 (Secure, deployable)
  ↓
Week 2:   7.5/10 (Professional, documented)
  ↓
Week 3:   8.5-9/10 (Interview champion)
```

**Start this week. Focus on finishing Week 1.**

