# Day 5-6: Backend Foundations (Spring Boot 101)

**Date:** 15 Jan 2026  
**Goal:** Understand how the Backend works and set up our Spring Boot server.

---

## 📚 Concept: The "Restaurant" Analogy for APIs
Imagine your Web App is a **Restaurant**.

1.  **The Frontend (React) is the Customer.**
    *   It sits at the table (Browser).
    *   It looks at the Menu (UI).
    *   It *orders* food (Data). It cannot go into the kitchen itself.

2.  **The Backend (Spring Boot) is the Waiter.**
    *   It takes the order from the Customer.
    *   It checks if the order is valid (Security).
    *   It runs to the Kitchen to get it.

3.  **The Database (PostgreSQL) is the Kitchen.**
    *   It actually stores the ingredients (Users, Passwords, Skills).
    *   It cooks and gives the food to the Waiter.

**The "API" is the language the Customer uses to talk to the Waiter.**
*   `GET /menu` -> "Show me the menu."
*   `POST /order` -> "Here is my order."

---

## 🏗️ The "3-Layer Cake" Architecture
In Spring Boot, we organize our code in 3 specific layers. This is the **Industry Standard**.

### 1. Controller Layer (`@RestController`)
*   **Role:** The Waiter.
*   **Job:** Receives the request from React. Says "Hello, I got your request."
*   **Code:**
    ```java
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello from Spring Boot!";
    }
    ```

### 2. Service Layer (`@Service`)
*   **Role:** The Manager/Chef.
*   **Job:** The Logic. It calculates things. (e.g., "Is this password correct?", "Calculate the tax").
*   **Code:** It contains the business rules.

### 3. Repository Layer (`@Repository`)
*   **Role:** The Storage Room Key.
*   **Job:** Talks to the Database. It runs SQL queries for you (e.g., `SELECT * FROM users`).

---

## 🛠️ Step-by-Step Plan for Today

### Step 1: Initialize Project
We need to generate the Spring Boot skeleton. We usually use **Spring Initializr**, but since we are in a terminal, we will use a template.

### Step 2: Dependencies (The "Tools")
We need to add these libraries to our `pom.xml` (Project Object Model):
1.  **Spring Web:** To make APIs.
2.  **PostgreSQL Driver:** To talk to the DB.
3.  **Spring Data JPA:** To make DB talk easier (Magic SQL).
4.  **Lombok:** To write less code (Auto-generates Getters/Setters).

### Step 3: "Hello World" API
We will write a simple API that we can visit in the browser (`http://localhost:8080/hello`) to prove the server is running.

---

## 📝 My Questions
*(I will add your questions here as we build)*
