# 🔐 JWT Authentication with Spring Boot
## Complete Guide: From Concept to Interview Ready

**Created:** April 13, 2026  
**For:** SkillLoop Project + Interview Preparation

---

## TABLE OF CONTENTS
1. [JWT Fundamentals](#jwt-fundamentals)
2. [Architecture & Flow](#architecture--flow)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Interview Talking Points](#interview-talking-points)
5. [Integration with SkillLoop](#integration-with-skillloop)
6. [Common Interview Questions](#common-interview-questions)
7. [Production Hardening](#production-hardening)

---

## JWT FUNDAMENTALS

### What is JWT?

**JWT = JSON Web Token**

Think of it like a **concert ticket**:
- 🎫 Your ticket has your name, seat number, validity dates
- 🔐 It's digitally signed by the concert organizer
- ✔️ The bouncer can verify YOUR ticket without calling the organizer
- 🚀 It's stateless and portable

### Three Parts of JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Header.Payload.Signature
```

#### **1. Header (Algorithm & Type)**
```json
{
  "alg": "HS256",      // Algorithm: HMAC SHA-256
  "typ": "JWT"         // Type: JWT (always JWT)
}
```

#### **2. Payload (Claims - User Data)**
```json
{
  "sub": "user123",                    // Subject (user ID)
  "email": "john@example.com",         // Custom claim
  "roles": ["USER", "ADMIN"],          // Roles
  "iat": 1516239022,                   // Issued at (timestamp)
  "exp": 1516325422,                   // Expiration (timestamp)
  "name": "John Doe"                   // Custom claim
}
```

**Standard Claims:**
- `iss` (Issuer): Who created the token
- `sub` (Subject): Who the token is for (user ID)
- `aud` (Audience): Who can use this token
- `exp` (Expiration): When it expires
- `iat` (Issued At): When it was created
- `nbf` (Not Before): When it becomes valid

#### **3. Signature (Verify Authenticity)**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

**Purpose:** Proves the token wasn't tampered with

### JWT vs Sessions

| Feature | JWT | Session |
|---------|-----|---------|
| **Storage** | Client-side (localStorage) | Server-side (database) |
| **Stateless** | Yes ✅ | No (server stores) |
| **Scalability** | Better (no server storage) | Worse (needs session DB) |
| **Mobile-friendly** | Yes ✅ | No |
| **Invalidation** | Hard (token valid until expiry) | Easy (delete session) |
| **Size** | Larger (all data in token) | Smaller |

---

## ARCHITECTURE & FLOW

### Login Flow Diagram

```
┌─────────┐                          ┌─────────────┐
│  Client │                          │   Server    │
│ (React) │                          │ (Spring Boot)│
└────┬────┘                          └──────┬──────┘
     │                                      │
     │  1. POST /auth/login                │
     │  { email, password }                │
     ├─────────────────────────────────────>│
     │                                      │
     │                                      │ 2. Check credentials
     │                                      │ (BCrypt verify)
     │                                      │
     │                                      │ 3. Generate JWT
     │                                      │ (sign with secret)
     │                                      │
     │  4. Return JWT                       │
     │  { accessToken, expiresIn }         │
     │<─────────────────────────────────────┤
     │                                      │
     │ 5. Store in localStorage             │
     │                                      │
     │  6. Include in headers               │
     │  Authorization: Bearer <token>       │
     ├─────────────────────────────────────>│
     │  GET /api/sessions                   │
     │                                      │
     │                                      │ 7. Validate JWT
     │                                      │ (check signature + expiry)
     │                                      │
     │  8. Return protected resource        │
     │<─────────────────────────────────────┤
     │                                      │
```

### Protected Endpoint Request Flow

```
Request with JWT:
┌──────────────────────────────────┐
│ GET /api/sessions                │
│ Authorization: Bearer eyJhbGc... │
└──────────────────────────────────┘
           ↓
   Spring Security Filter Chain
           ↓
┌──────────────────────────────────┐
│ JwtAuthenticationFilter           │
│ ✓ Extract token from Header      │
│ ✓ Validate signature             │
│ ✓ Check expiration               │
│ ✓ Load user from claims          │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ Create Authentication object     │
│ Set in SecurityContext           │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ @PreAuthorize checked            │
│ SessionController.getSessions()  │
│ executed                         │
└──────────────────────────────────┘
           ↓
        Response sent
```

---

## STEP-BY-STEP IMPLEMENTATION

### **STEP 1: Add Dependencies to pom.xml**

```xml
<!-- In your server/pom.xml -->

<!-- Spring Security (provides security framework) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- JJWT library (creates/validates JWT tokens) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

<!-- JJWT implementation -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<!-- JJWT Jackson (for serialization) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

**Run:** `mvn clean install`

---

### **STEP 2: Add JWT Configuration Properties**

**File:** `server/src/main/resources/application.properties`

```properties
# JWT Configuration
jwt.secret=your-super-secret-key-min-32-characters-long-for-HS256
jwt.expiration=86400000

# In milliseconds (86400000 = 24 hours)
# Calculate: 1 day × 24 hours × 60 minutes × 60 seconds × 1000 ms = 86400000
```

**For production**, use environment variables:
```properties
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

---

### **STEP 3: Create JwtTokenProvider Class**

**File:** `server/src/main/java/com/skillloop/server/security/JwtTokenProvider.java`

```java
package com.skillloop.server.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    /**
     * Generate JWT token from user ID and email
     * 
     * INTERVIEW: Explain what this does:
     * "Creates a signed JWT token containing the user's ID as the subject
     * and email as a custom claim. Signs it with HS256 algorithm using
     * our secret key. Sets expiration to 24 hours from now."
     */
    public String generateToken(Long userId, String email) {
        return generateTokenFromClaims(userId, email, null);
    }

    /**
     * Generate JWT token with additional roles
     */
    public String generateTokenWithRoles(Long userId, String email, java.util.List<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        return generateTokenFromClaims(userId, email, claims);
    }

    /**
     * Internal method to generate token with claims
     */
    private String generateTokenFromClaims(Long userId, String email, Map<String, Object> claims) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .claims(claims != null ? claims : new HashMap<>())  // Add custom claims
                .subject(userId.toString())                         // Set user ID as subject
                .claim("email", email)                              // Add email as claim
                .issuedAt(now)                                      // When token was created
                .expiration(expiryDate)                             // When token expires
                .signWith(key, SignatureAlgorithm.HS256)           // Sign with secret
                .compact();                                         // Generate final token
    }

    /**
     * Extract user ID from JWT token
     * 
     * INTERVIEW: "This decrypts the token (not really, just verifies + decodes),
     * extracts the subject (user ID), and returns it."
     */
    public Long getUserIdFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    /**
     * Extract email from JWT token
     */
    public String getEmailFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return (String) claims.get("email");
    }

    /**
     * Validate JWT token (most important method!)
     * 
     * INTERVIEW: "This validates the token by:
     * 1. Verifying the signature matches our secret key
     * 2. Checking if it's expired
     * 3. Checking if it's properly formatted
     * Returns true only if ALL checks pass."
     */
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    /**
     * Get expiration time in milliseconds
     */
    public long getExpirationMs() {
        return jwtExpirationMs;
    }
}
```

---

### **STEP 4: Create JwtAuthenticationFilter**

**File:** `server/src/main/java/com/skillloop/server/security/JwtAuthenticationFilter.java`

This filter runs on EVERY request to validate JWT tokens.

```java
package com.skillloop.server.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    /**
     * This filter runs on EVERY request
     * 
     * INTERVIEW: Explain what this does:
     * "This filter intercepts every HTTP request,
     * extracts the JWT from the Authorization header,
     * validates it, and if valid, loads the user from database
     * and sets them in SecurityContext so Spring Security
     * knows who is making the request."
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // STEP 1: Extract JWT from header
            String jwt = extractJwtFromRequest(request);

            // STEP 2: Validate JWT
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {

                // STEP 3: Get user ID from JWT
                Long userId = tokenProvider.getUserIdFromToken(jwt);

                // STEP 4: Load user from database using user ID
                UserDetails userDetails = userDetailsService.loadUserById(userId);

                // STEP 5: Create authentication object
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );

                // STEP 6: Set request details (IP address, session ID, etc.)
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // STEP 7: Set authentication in SecurityContext
                // Now @PreAuthorize, @Secured, principal will work
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("Set JWT authentication for user: {}", userId);
            }

        } catch (Exception e) {
            log.error("Could not set user authentication: ", e);
        }

        // Continue to next filter
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT from "Authorization: Bearer <token>" header
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }

        return null;
    }
}
```

---

### **STEP 5: Create CustomUserDetailsService**

**File:** `server/src/main/java/com/skillloop/server/security/CustomUserDetailsService.java`

This loads user from database and converts to Spring UserDetails.

```java
package com.skillloop.server.security;

import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Load user by email (used during login)
     * 
     * INTERVIEW: "This is called by Spring Security's authentication manager
     * during login. It finds the user by email and returns a UserDetails object
     * that Spring can use to validate password."
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return convertUserToUserDetails(user);
    }

    /**
     * Load user by ID (used by JWT filter)
     * 
     * INTERVIEW: "After JWT is validated, we load the user's full details
     * from database so we have all their information (email, roles, etc.)
     * for authorization checks."
     */
    public UserDetails loadUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));

        return convertUserToUserDetails(user);
    }

    /**
     * Convert our User entity to Spring's UserDetails
     */
    private UserDetails convertUserToUserDetails(User user) {
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

        // Add role (ROLE_USER, ROLE_ADMIN, etc.)
        if (user.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}
```

---

### **STEP 6: Create SecurityConfig (Spring Security Configuration)**

**File:** `server/src/main/java/com/skillloop/server/config/SecurityConfig.java`

```java
package com.skillloop.server.config;

import com.skillloop.server.security.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true,  // Enables @PreAuthorize, @PostAuthorize
        securedEnabled = true   // Enables @Secured
)
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    /**
     * Password encoder (BCrypt)
     * 
     * INTERVIEW: "BCrypt is one-way hashing with salt and work factor.
     * Even if database is compromised, passwords are not readable.
     * Slows down brute-force attacks by requiring thousands of iterations."
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);  // 10 is work factor (iterations)
    }

    /**
     * Authentication manager (validates credentials)
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
            http.getSharedObject(AuthenticationManagerBuilder.class);

        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());

        return authenticationManagerBuilder.build();
    }

    /**
     * JWT Authentication Filter
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    /**
     * Security filter chain (configure what endpoints need auth)
     * 
     * INTERVIEW: Explain what this does:
     * "This configures Spring Security to:
     * 1. Allow /auth/login and /auth/signup WITHOUT authentication
     * 2. Require JWT for other /api/* endpoints
     * 3. Use stateless sessions (no cookies, pure JWT)
     * 4. Add our JWT filter to the filter chain"
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF (stateless API, no forms)
                .csrf().disable()

                // Disable CORS (configure separately if needed)
                .cors().disable()

                // Stateless session (no cookies, pure JWT)
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()

                // Configure authorization
                .authorizeHttpRequests((authz) -> authz
                        // Public endpoints (no authentication needed)
                        .requestMatchers("/auth/login", "/auth/signup").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/public/**").permitAll()

                        // Protected endpoints (authentication required)
                        .requestMatchers("/api/**").authenticated()
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Catch-all: any other request requires auth
                        .anyRequest().authenticated()
                )

                // Add JWT filter BEFORE UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

---

### **STEP 7: Update AuthService (Password Hashing & Token Generation)**

**File:** `server/src/main/java/com/skillloop/server/service/AuthService.java`

```java
package com.skillloop.server.service;

import com.skillloop.server.dto.AuthResponse;
import com.skillloop.server.dto.LoginRequest;
import com.skillloop.server.dto.SignupRequest;
import com.skillloop.server.exception.ResourceNotFoundException;
import com.skillloop.server.model.User;
import com.skillloop.server.repository.UserRepository;
import com.skillloop.server.security.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Register new user
     * 
     * INTERVIEW: Explain step by step:
     * "When user signs up, I:
     * 1. Check if email already exists
     * 2. Hash password with BCrypt (one-way)
     * 3. Save user to database
     * 4. Generate JWT token
     * 5. Return both user data and token"
     */
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Check if user exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setDepartment(request.getDepartment());

        // IMPORTANT: Hash password before saving
        // BCrypt will NEVER store plain text
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");  // Default role
        user.setPoints(0);
        user.setXpPoints(0);

        // Save to database
        User savedUser = userRepository.save(user);

        log.info("User registered: {}", savedUser.getId());

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail());

        // Return auth response
        return AuthResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .accessToken(token)
                .expiresIn(jwtTokenProvider.getExpirationMs())
                .build();
    }

    /**
     * Login user
     * 
     * INTERVIEW: Explain step by step:
     * "When user logs in, I:
     * 1. Find user by email
     * 2. Verify entered password against BCrypt hash (using matcher)
     * 3. If password matches, generate JWT token
     * 4. Return token (user stores in localStorage)"
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // ✅ IMPORTANT: Never compare passwords directly!
        // Use passwordEncoder.matches() which validates against BCrypt hash
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        log.info("User logged in: {}", user.getId());

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());

        // Return auth response
        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .accessToken(token)
                .expiresIn(jwtTokenProvider.getExpirationMs())
                .build();
    }
}
```

---

### **STEP 8: Create AuthController**

**File:** `server/src/main/java/com/skillloop/server/controller/AuthController.java`

```java
package com.skillloop.server.controller;

import com.skillloop.server.dto.AuthResponse;
import com.skillloop.server.dto.LoginRequest;
import com.skillloop.server.dto.SignupRequest;
import com.skillloop.server.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Signup endpoint
     * 
     * INTERVIEW: "This endpoint takes signup credentials,
     * creates user account with hashed password,
     * generates JWT token, and returns it immediately."
     */
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        log.info("Signup request for email: {}", request.getEmail());

        AuthResponse response = authService.signup(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Login endpoint
     * 
     * INTERVIEW: "This endpoint takes email and password,
     * verifies against database, generates JWT if valid,
     * returns token for use in protected requests."
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());

        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    /**
     * Refresh token endpoint (optional but recommended)
     * 
     * INTERVIEW: "If a token is about to expire (e.g., after 23 hours),
     * user can refresh it without re-entering credentials.
     * This prevents them from being logged out mid-use."
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String bearerToken) {
        String token = bearerToken.substring(7);  // Remove "Bearer "

        // In real implementation, verify token and generate new one
        // For now, you can re-generate if not too close to expiry

        return ResponseEntity.ok(new AuthResponse());  // Simplified
    }
}
```

---

### **STEP 9: Add DTOs**

**File:** `server/src/main/java/com/skillloop/server/dto/LoginRequest.java`

```java
package com.skillloop.server.dto;

import lombok.Data;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
```

**File:** `server/src/main/java/com/skillloop/server/dto/SignupRequest.java`

```java
package com.skillloop.server.dto;

import lombok.Data;
import javax.validation.constraints.*;

@Data
public class SignupRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2-100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Department is required")
    private String department;
}
```

**File:** `server/src/main/java/com/skillloop/server/dto/AuthResponse.java`

```java
package com.skillloop.server.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String accessToken;
    private Long expiresIn;  // Token expiration time in milliseconds
    private String tokenType = "Bearer";  // Always "Bearer" for JWT
}
```

---

### **STEP 10: Protect Endpoints with @PreAuthorize**

Now you can protect any endpoint:

```java
@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    /**
     * Get all sessions for current user
     * 
     * @PreAuthorize checks if user is authenticated
     * principal.getId() gets the current logged-in user's ID
     */
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<SessionDTO>> getUserSessions(
            @AuthenticationPrincipal UserDetails userDetails) {

        // userDetails.getUsername() = email
        // You have user info from JWT!

        return ResponseEntity.ok(sessionService.getUserSessions(userDetails.getUsername()));
    }

    /**
     * Only ADMIN can delete users
     */
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        return ResponseEntity.ok("Deleted");
    }

    /**
     * Admin OR the user themselves
     */
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') OR #userId == authentication.principal.getId()")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody UserDTO dto) {
        return ResponseEntity.ok("Updated");
    }
}
```

---

## INTEGRATION WITH SKILLLOOP

### **Your Current Code Changes**

**1. Update User model:**
```java
@Entity
public class User {
    // ... existing fields

    @Column(nullable = false, unique = true)
    private String email;

    // ✅ CHANGE: Password should be hashed
    @Column(nullable = false)
    private String password;

    // ✅ ADD: Role field
    @Column(nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'USER'")
    private String role = "USER";
}
```

**2. Add role enum (optional but cleaner):**
```java
public enum UserRole {
    USER("ROLE_USER"),
    INSTRUCTOR("ROLE_INSTRUCTOR"),
    ADMIN("ROLE_ADMIN");

    private String authority;

    UserRole(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }
}
```

**3. Update ChatService to use principal:**
```java
@Service
public class ChatService {

    /**
     * Save chat message (now with JWT user)
     * 
     * @PreAuthorize ensures user is authenticated
     * principal is extracted from JWT
     */
    @PreAuthorize("hasRole('USER')")
    public ChatMessage saveMessage(ChatMessageRequest request, 
                                   @AuthenticationPrincipal UserDetails userDetails) {
        
        // Get current user from JWT
        User sender = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();

        Session session = sessionRepository.findById(request.getSessionId())
                .orElseThrow();

        // ✅ Verify user is part of this session
        if (!session.getUser().getId().equals(sender.getId()) && 
            !session.getReceiver().getId().equals(sender.getId())) {
            throw new UnauthorizedSessionAccessException("Cannot send message");
        }

        // ✅ Verify session is ACCEPTED
        if (session.getStatus() != SessionStatus.ACCEPTED) {
            throw new SessionNotAcceptedException("Session not accepted");
        }

        ChatMessage message = new ChatMessage();
        message.setContent(request.getContent());
        message.setSender(sender);
        message.setSession(session);
        message.setCreatedAt(LocalDateTime.now());

        return chatMessageRepository.save(message);
    }
}
```

---

## INTERVIEW TALKING POINTS

### **Interview Question: "How do you handle authentication?"**

**Good Answer:**
```
"I use JWT (JSON Web Tokens) with Spring Security.

Here's the flow:
1. User logs in with email/password
2. I verify credentials and hash password with BCrypt
3. If valid, I generate a signed JWT token containing user ID and some claims
4. Token is returned to frontend and stored in localStorage
5. Frontend includes token in Authorization header for protected requests
6. My JwtAuthenticationFilter validates the token on each request
7. If valid, I load user from database and set in SecurityContext
8. @PreAuthorize annotations check permissions

Key security features:
- No plain text passwords (BCrypt hashing)
- Tokens are stateless (can scale horizontally)
- Token expiration (24 hours in our case)
- Signature verification prevents tampering"
```

### **Interview Question: "Isn't JWT less secure than sessions?"**

**Good Answer:**
```
"JWT and sessions have different security trade-offs:

Sessions:
✅ Easier to revoke (delete from DB immediately)
❌ Need to query DB on every request
❌ Hard to scale (requires session store)

JWT:
✅ Stateless (no server storage needed)
✅ Scales better (edge servers can validate)
✅ Mobile-friendly (tokens instead of cookies)
❌ Harder to revoke (must wait for expiration)

For a stateless API like ours, JWT is better-suited.
But I could add a 'blacklist' table for immediate revocation if needed."
```

### **Interview Question: "Why BCrypt instead of just storing passwords?"**

**Good Answer:**
```
"BCrypt is a one-way hash with three key features:

1. One-way: Can't reverse to get original password
2. Salt: Each hash includes random data, so same password produces different hashes
3. Work factor: Intentionally slow (10^work_factor iterations)
   - Makes brute force attacks impractical
   - Even if DB is compromised, passwords are useless

If someone gets our database:
- With plain text: They have everyone's passwords immediately
- With BCrypt: Takes thousands of CPU cycles per guess

Login still works because I use passwordEncoder.matches() which
hashes the entered password the same way and compares."
```

### **Interview Question: "How do you prevent unauthorized access?"**

**Good Answer:**
```
"Multiple layers:

1. Authentication: JwtAuthenticationFilter validates token
2. Authorization: @PreAuthorize checks roles
3. Business Logic: ChatService verifies user is part of session
4. HTTP Security: Only /auth/* endpoints are public

Example from ChatService:
if (!session.getUser().getId().equals(sender.getId()) && 
    !session.getReceiver().getId().equals(sender.getId())) {
    throw UnauthorizedSessionAccessException;
}

This prevents User A from sending messages in User B's sessions.
Even if they had a valid token, the business logic blocks it."
```

### **Interview Question: "What happens if someone steals a token?"**

**Good Answer:**
```
"If a JWT is stolen, the attacker can:
- Use it for 24 hours (until expiration)
- Impersonate the user

Mitigations:
1. Short expiration (24 hours in our case, could be shorter)
2. Use HTTPS-only tokens (can't be stolen over HTTP)
3. HttpOnly cookies (if using cookies instead of localStorage)
4. Refresh tokens: Issue short-lived access tokens + long-lived refresh tokens
5. Token rotation: Move to new token frequently
6. Blacklist: Add stolen tokens to blacklist table (if critical)

For a production system, I'd probably use:
- Short-lived JWT (15 minutes)
- Refresh token (valid 7 days)
- User can manually revoke tokens on 'Active Sessions' page"
```

---

## COMMON INTERVIEW QUESTIONS

### **Q1: Difference between @PreAuthorize and @Secured?**

```java
// @PreAuthorize: More flexible, supports SpEL
@PreAuthorize("hasRole('ADMIN') OR #userId == authentication.principal.getId()")
public void updateUser(Long userId) { }

// @Secured: Simpler, role-based only
@Secured("ROLE_ADMIN")
public void deleteUser() { }

// Answer: "I use @PreAuthorize for complex logic,
// @Secured when just checking roles."
```

### **Q2: How to get current user in controller?**

```java
// Option 1: UserDetails from parameter
@GetMapping
public void getSessions(@AuthenticationPrincipal UserDetails userDetails) {
    String email = userDetails.getUsername();
}

// Option 2: SecurityContextHolder (anywhere in code)
UserDetails userDetails = (UserDetails) SecurityContextHolder
    .getContext()
    .getAuthentication()
    .getPrincipal();

// Answer: "I use @AuthenticationPrincipal because it's cleaner
// and automatically injected by Spring."
```

### **Q3: How to test protected endpoints?**

```java
@SpringBootTest
public class SessionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetSessionsWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/sessions"))
                .andExpect(status().isUnauthorized());  // 401
    }

    @Test
    @WithMockUser(username = "john@example.com", roles = "USER")
    public void testGetSessionsWithAuth() throws Exception {
        mockMvc.perform(get("/api/sessions"))
                .andExpect(status().isOk());  // 200
    }
}
```

### **Q4: How to handle token refresh?**

```java
@PostMapping("/refresh-token")
public ResponseEntity<AuthResponse> refresh(
        @RequestHeader("Authorization") String bearerToken) {

    String oldToken = bearerToken.substring(7);
    
    // Verify token is valid (not expired)
    if (!jwtTokenProvider.validateToken(oldToken)) {
        throw new InvalidTokenException();
    }
    
    // Extract user ID (even if close to expiry)
    Long userId = jwtTokenProvider.getUserIdFromToken(oldToken);
    User user = userRepository.findById(userId).orElseThrow();
    
    // Generate new token
    String newToken = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
    
    return ResponseEntity.ok(
        new AuthResponse().setAccessToken(newToken)
    );
}

// Answer: "This allows users to refresh their token
// without re-entering credentials. Prevents logout mid-session."
```

---

## PRODUCTION HARDENING

### **Before shipping to production, add:**

#### **1. Token Blacklist (for logout)**

```java
@Entity
public class TokenBlacklist {
    @Id
    private String token;
    private LocalDateTime expiryDate;
}

@Service
public class TokenBlacklistService {
    
    public void addToBlacklist(String token, LocalDateTime expiryDate) {
        TokenBlacklist blacklisted = new TokenBlacklist();
        blacklisted.setToken(token);
        blacklisted.setExpiryDate(expiryDate);
        blacklistRepository.save(blacklisted);
    }
    
    public boolean isBlacklisted(String token) {
        return blacklistRepository.existsById(token);
    }
}

// Add to JwtAuthenticationFilter:
if (tokenBlacklistService.isBlacklisted(jwt)) {
    log.warn("Token is blacklisted");
    return;
}
```

#### **2. Stronger Secret Key**

```properties
# ❌ Bad: Too short
jwt.secret=secret

# ✅ Good: 32+ characters for HS256
jwt.secret=this-is-a-long-secret-key-min-32-chars-for-hs256

# ✅ Better: Use environment variable
jwt.secret=${JWT_SECRET}

# Generate secure secret:
# Base64.getEncoder().encodeToString(KeyGenerator.getInstance("HmacSHA256").generateKey().getEncoded());
```

#### **3. CORS Configuration**

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000", "https://yourapp.com")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("Authorization", "Content-Type")
                        .maxAge(3600);
            }
        };
    }
}
```

#### **4. Rate Limiting (Prevent brute force)**

```xml
<!-- Add to pom.xml -->
<dependency>
    <groupId>io.github.bucket4j</groupId>
    <artifactId>bucket4j-core</artifactId>
    <version>7.10.0</version>
</dependency>
```

#### **5. HTTPS-Only Tokens**

```java
// In SecurityConfig
.csrf()
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
.and()
.headers()
    .contentSecurityPolicy("default-src 'self'")
```

---

## TESTING JWT MANUALLY

### **Test with cURL**

```bash
# 1. Signup
curl -X POST http://localhost:9090/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "department": "CSE"
  }'

# Response:
# {
#   "id": 1,
#   "name": "John Doe",
#   "email": "john@example.com",
#   "role": "USER",
#   "accessToken": "eyJhbGc...",
#   "expiresIn": 86400000,
#   "tokenType": "Bearer"
# }

# 2. Login
curl -X POST http://localhost:9090/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# 3. Use token to access protected endpoint
curl http://localhost:9090/api/sessions \
  -H "Authorization: Bearer eyJhbGc..."

# Response: List of sessions (200 OK)

# 4. Test invalid token
curl http://localhost:9090/api/sessions \
  -H "Authorization: Bearer invalid"

# Response: 401 Unauthorized
```

---

## SUMMARY CHECKLIST

### **What to implement:**
- [ ] Add spring-boot-starter-security + jjwt to pom.xml
- [ ] Create JwtTokenProvider (generate, validate tokens)
- [ ] Create JwtAuthenticationFilter (intercept requests)
- [ ] Create CustomUserDetailsService (load users)
- [ ] Create SecurityConfig (configure Spring Security)
- [ ] Update AuthService (hash passwords, generate tokens)
- [ ] Create AuthController (/auth/login, /auth/signup)
- [ ] Update other controllers with @PreAuthorize
- [ ] Test login flow with postman
- [ ] Test protected endpoints
- [ ] Add token blacklist for logout

### **Interview talking points:**
- ✅ Explain JWT structure (header.payload.signature)
- ✅ Explain password hashing with BCrypt
- ✅ Explain token validation flow
- ✅ Explain how unauthorized access is prevented
- ✅ Discuss trade-offs (JWT vs Sessions)
- ✅ Discuss production hardening

---

**Your project is now production-grade! 🚀**

