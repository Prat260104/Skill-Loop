# ⏰ MasterClass: Spring Boot Scheduler & Cron Jobs

Is guide mein hum seekhenge ki Spring Boot mein koi bhi kaam **Automatic (Apne aap)** kaise karwaya jaye bina kisi button click ke.

---

## 🚀 1. Background: Humein Scheduler Kyun Chahiye?

Maan lo aapko ye tasks karne hain:
1.  **Roz Raat 12 Baje:** Check karo birthday kiska hai aur email bhejo.
2.  **Har 10 Minute:** Database ka backup lo.
3.  **Har Sunday:** Weekly Report generate karo.
4.  **Skill Loop Example:** Check karo kaunsa user 30 din se inactive hai (Churn Prediction).

Agar hum manually (khud se) run karenge to bhool sakte hain. Isliye hum **Scheduler** use karte hain jo **Fixed Time** par automatic chalta hai.

---

## 🛠️ 2. Setup: Kaise Start Karein?

Spring Boot mein ye feature *in-built* hota hai. Bas 2 steps chahiye:

### Step A: Main Class mein Enable karo
`ServerApplication.java`

```java
@SpringBootApplication
@EnableScheduling // <-- Ye annotation lagana zaroori hai!
public class ServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }
}
```

### Step B: Method par `@Scheduled` lagao
Kisi bhi Service ya Component class mein:

```java
@Component
public class MyScheduler {

    // Har 5 second mein chalega
    @Scheduled(fixedRate = 5000)
    public void runTask() {
        System.out.println("⏳ 5 seconds ho gaye! Main chal gaya.");
    }
}
```

---

## ⏳ 3. Types of Scheduling (Kab Chalana Hai?)

### A. Fixed Rate (Har X seconds baad)
Matlab: *"Pichla kab khatam hua usse fark nahi padta, bas har 5 second mein start kar do."*

```java
@Scheduled(fixedRate = 5000) // 5000ms = 5 seconds
```

### B. Fixed Delay (Khatam hone ke X seconds baad)
Matlab: *"Pichla task khatam hone do, uske baad 5 second ruko, fir agla start karo."*
(Ye tab use hota hai jab task heavy ho aur overlap na ho jaye).

```java
@Scheduled(fixedDelay = 5000)
```

### C. Cron Expression (Exact Time par) 🔥 (Sabse Important)
Jab humein kehna ho: *"Har Mangalwar ko subah 10 baje"* ya *"Sirf Weekdays ko raat 9 baje"*.
Iske liye hum ek special string use karte hain jise **CRON** kehte hain.

---

## 📅 4. Cron Expressions Deep Dive

Cron expression mein **6 fields** hoti hain (space se separated):

`"Second  Minute  Hour  Day(Month)  Month  Day(Week)"`

| Position | Field | Allowed Values | Special Characters |
| :--- | :--- | :--- | :--- |
| **1** | **Second** | 0-59 | `, - * /` |
| **2** | **Minute** | 0-59 | `, - * /` |
| **3** | **Hour** | 0-23 (24-hour format) | `, - * /` |
| **4** | **Day of Month** | 1-31 | `, - * ? / L W` |
| **5** | **Month** | 1-12 (or JAN-DEC) | `, - * /` |
| **6** | **Day of Week** | 0-7 (0 or 7 is SUN, or MON-SUN) | `, - * ? / L #` |

*(Note: Kuch purane systems mein Year bhi hota tha 7th field, par Spring Boot mein usually 6 hi theek hain).*

### Special Characters ka Matlab:
*   `*` (Asterisk): **"Har baar"** (Every). E.g., Minute field mein `*` matlab "Har minute".
*   `?` (Question Mark): **"Koi bhi value chalegi"** (Don't care). Ye sirf **Day of Month** aur **Day of Week** mein use hota hai kyunki agar humne Date fix kar di (e.g., 5th), to Day of Week (Monday) matter nahi karta.
*   `/` (Slash): **"Interval"**. E.g., `0/5` second field mein matlab "0 se start karo, har 5 second baad".
*   `-` (Dash): **"Range"**. E.g., `10-12` hour field mein matlab "10AM se 12PM tak".

---

## 💡 5. Examples (Cheat Sheet)

| Task | Cron Expression | Explanation |
| :--- | :--- | :--- |
| **Roz Raat 12 Baje** | `"0 0 0 * * ?"` | At 00:00:00 everyday. |
| **Har Subah 10:15 par** | `"0 15 10 * * ?"` | At 10:15:00 AM everyday. |
| **Har 30 Minutes mein** | `"0 0/30 * * * ?"` | Sec:0, Min:0,30, Hour:Any... |
| **Mon-Fri Subah 9 Baje** | `"0 0 9 ? * MON-FRI"` | Weekdays only. Day of Month '?' hai. |
| **Mahine ki 1st tareek ko** | `"0 0 0 1 * ?"` | 1st date of every month at midnight. |
| **Saal mein ek baar (Jan 1)** | `"0 0 0 1 1 ?"` | New Year's Midnight. |

---

## 🎯 6. Placement & Industry Level Implementation (Churn Prediction)

### What is Churn? (Interview Answer) 🎤
> *"Sir, Churn Rate is the percentage of users who stop using an app over a given period. My goal was to build a system that **proactively identifies** these users and re-engages them before they leave permanently."*

### Industry Standard vs. Our Approach 🏢

| Feature | Industry Standard (Netflix/Uber) | Our Skill Loop Approach (MVP) |
| :--- | :--- | :--- |
| **Data Source** | Complex ML Models (Login frequency, Click patterns, Video pauses) | Simple Logic: **Time since Last Login** > 15 Days |
| **Trigger** | Real-time events & Predictive Score (0-100) | Scheduled Job (Cron) every midnight |
| **Action** | Personalized Push Notification + Discount Offer | Email / In-App Notification: *"We miss you!"* |
| **Tech Stack** | Kafka, Spark, Airflow, Python ML | **Spring Boot Scheduler + Java Mail Sender** |

---

### 🛠️ How We Will Implement It (Step-by-Step)

Humein 2 cheezein karni hain:
1.  **Tracking:** Har login par uska time save karna.
2.  **Prediction:** Ek scheduled job jo "Inactivity" detect kare.

#### Step 1: Update User Entity
Sabse pehle database ko pata hona chahiye ki user last kab aaya tha.

`User.java`
```java
@Column(name = "last_login")
private LocalDateTime lastLoginDate;
```

#### Step 2: Update Login Logic (AuthService)
Jab bhi user login kare, `lastLoginDate` ko update karo `LocalDateTime.now()` se.

#### Step 3: The "Retention Engine" aka Scheduler
Ye code `ChurnScheduler.java` meinjayega.

```java
@Component
public class ChurnScheduler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // 🕒 Cron: Har raat 2 baje (Jab traffic kam hota hai)
    // "0 0 2 * * ?"
    @Scheduled(cron = "0 0 2 * * ?") 
    public void runRetentionJob() {
        System.out.println("🕵️‍♂️ Retention Engine Started...");

        // Strategy: "Users who haven't logged in for 15 days"
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(15);

        // Database Query: SELECT * FROM users WHERE last_login < cutoffDate
        List<User> atRiskUsers = userRepository.findByLastLoginDateBefore(cutoffDate);

        int count = 0;
        for (User user : atRiskUsers) {
            // Business Logic: Don't spam them everyday!
            // Check if we already sent a notification recently (Optional optimization)
            
            System.out.println("⚠️ Churn Risk Detected: " + user.getName());
            
            // Re-engagement Strategy
            notificationService.createNotification(
                user, 
                "Hey " + user.getName() + "! It's been a while. Your mentor is waiting! 🚀", 
                "WARNING" // Red color badge urgency create karne ke liye
            );
            count++;
        }
        
        System.out.println("✅ Job Finished. " + count + " users re-engaged.");
    }
}
```

### Why is this good for Placements? 🌟
Interview mein aap bol sakte ho:
1.  **"Automation:"** Maine manual kaam ko automate kiya using `Cron Jobs`.
2.  **"User Retention:"** Maine sirf code nahi likha, maine **Business Value** create ki (Users ko wapas laana).
3.  **"Scalability:"** Maine job ko raat 2 baje schedule kiya taaki din mein server slow na ho (Load Management).

---

## ✅ Summary

1.  **Enable:** `@EnableScheduling` main class mein lagao.
2.  **Date:** User entity mein `lastLoginDate` add karo.
3.  **Cron:** `@Scheduled(cron = "...")` use karke timing set karo.
4.  **Logic:** Job ke andar query run karo aur notification bhejo.

Ready to implement? 🚀
