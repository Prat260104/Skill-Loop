# 🎓 Skill Loop: Backend Master Class (Day 6-7)

## 1. The "Entity" (`User.java`)
**Think of this file as a "Translation Dictionary".**
Java speaks Objects (`User`). Database speaks Tables (`users`). This file tells java how to translate between them.

### Key Annotations Explained:

1.  **`@Entity` & `@Table(name="users")`**
    *   **Meaning:** "Hey Spring Boot, this class `User` represents a row in the SQL table named `users`."
    *   **Why?** So you never have to write `CREATE TABLE users...` yourself. Java does it for you.

2.  **`@Id` & `@GeneratedValue`**
    *   **Meaning:** "This looks like the Primary Key."
    *   **`IDENTITY` strategy:** "Let Postgres decide the number (1, 2, 3...) automatically."
    *   **Why?** Every user needs a unique ID badge.

3.  **`@NotBlank` & `@Email` (Validation)**
    *   **Meaning:** "Stop the code if the name is empty or email is weird."
    *   **Why?** Safety. Don't let bad data enter the kitchen.

4.  **`@ElementCollection` (The List Trick)**
    *   **Code:** `List<String> skillsOffered;`
    *   **The Problem:** SQL Tables are flat like Excel. You can't put a "List" inside a single Excel cell.
    *   **The Magic:** Spring Boot automatically creates a *second invisible table* (`user_skills_offered`) to store these skills and links them to the user. You don't see it, but it handles the complexity for you.

5.  **`@CreationTimestamp`**
    *   **Meaning:** "The moment this row is saved, stamp the current time."

---

## 2. Lombok Magic (`@Data`)
You noticed we didn't write:
```java
public String getName() { return name; }
public void setName(String n) { this.name = n; }
```
**Why?** Because of **`@Data`**.
*   **Lombok** is a library that runs *during compilation*.
*   It looks at your code, sees `@Data`, and **invisibly generates** all the Getters, Setters, `toString()`, and `equals()` methods for you.
*   It saves us 100 lines of boring "Boilerplate" code.

---

## 3. The Repository (`UserRepository.java`)
**Think of this as the "Data Access Object" (DAO).**

```java
public interface UserRepository extends JpaRepository<User, Long>
```

**The Magic:**
*   You wrote **ZERO** code in this file.
*   But purely by extending `JpaRepository`, you instantly get 50+ methods for free:
    *   `userRepository.save(user)` -> INSERT INTO users...
    *   `userRepository.findById(1)` -> SELECT * FROM users WHERE id=1
    *   `userRepository.delete(user)` -> DELETE FROM users...

**Custom Finders:**
*   You wrote: `Optional<User> findByEmail(String email);`
*   Spring is smart. It reads the method name **"findByEmail"** and writes the SQL: `SELECT * FROM users WHERE email = ?`.
*   If you wrote `findByNameAndRole`, it would write `WHERE name = ? AND role = ?`.

You literally "program by naming methods".

---

## 🏗️ Summary for Interview
"I used **Hibernate/JPA** for ORM (Object-Relational Mapping). I defined my Schema using **Entity classes** with validation annotations. I used **Lombok** to reduce boilerplate. For database access, I used **Spring Data JPA Repositories**, which allowed me to perform CRUD operations without writing raw SQL."
