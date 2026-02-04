# 🎓 WebSocket MasterClass: Zero to Hero

Bhai, ab hum ek bohot hi interesting cheese seekhne ja rahe hain: **WebSockets**.
Ab tak hum jo kar rahe they (REST API), wo "Chitthiyan" (Letters) bhejne jaisa tha.
Ab hum jo karenge (WebSockets), wo "Phone Call" jaisa hoga.

---

## 1. HTTP (REST API) vs. WebSockets: The Difference

### 📝 HTTP (The Old Way)
Imagine karo tumhe apne dost se poochna hai "Kya tum free ho?".
1.  **You:** (Letter bhejte ho) "Are you free?" -> **Server**
2.  **Server:** (Jawab deta hai) "Yes". -> **You**
3.  **Connection Closed.**

Agar tumhe *dobara* poochna hai, toh tumhe *nayi* chitthi bhejni padegi. "Abhi free ho?". Server khud se tumhe message nahi bhej sakta jab tak tum na poocho.
*   **Problem:** Chatting ke liye ye bekaar hai. Tum har 1 second mein server se nahi pooch sakte "Kya naya message aaya?". Isse server crash ho jayega (Polling).

### ⚡ WebSockets (The New Way)
Connect karte waqt, tum server se kehte ho: *"Bhai, line khuli rakhna, main kabhi bhi bol sakta hoon, tu bhi kabhi bhi bol sakta hai."*
1.  **You:** "Let's open a connection." -> **Server**
2.  **Server:** "Connection Opened. Line is live!"
3.  **You:** "Hello!" (Turant phonch gaya)
4.  **Server:** "Hi!" (Turant aa gaya without refreshing)

**Key Magic:** Connection *kabhi band nahi hota* (jab tak tum close na karo).

---

## 2. Humara Implementation Plan (Jitna Use Hoga)

Hum **STOMP** use karenge.
*   **WebSocket:** Ye bas raw connection hai (like a wire).
*   **STOMP (Simple Text Oriented Messaging Protocol):** Ye rules define karta hai ki baat kaise karni hai (like a language). Humein raw WebSocket handle karne ki zarurat nahi padegi, STOMP humara kaam asaan kar dega.

### 🧩 The 3 Main Components

#### 1. The Broker (Post Office) 🏤
Backend mein ek "Message Broker" hota hai. Iska kaam hai messages ko sahi jagah pahunchana.
*   Agar main message bhejoon **"To: All"**, toh Broker sabko copy bhej dega.
*   Agar main message bhejoon **"To: Prateek"**, toh Broker sirf Prateek ko bhejega.

#### 2. Subscribe (Follow karna) 🔔
Jab Frontend load hota hai, wo Broker ko bolta hai:
*"Bhai, agar `/topic/public` pe koi message aaye, toh mujhe bata dena."*
Implementation: `stompClient.subscribe('/topic/sessions/123', onMessageReceived)`

#### 3. Send (Message bhejna) 📨
Jab user Enter dabata hai:
Implementation: `stompClient.send('/app/chat', {}, JSON.stringify(message))`

---

## 3. Code Mein Kya Hoga? (Preview)

### Backend (Spring Boot)

**A. Configuration (`WebSocketConfig.java`)**
Humein Spring ko batana padega ki WebSocket server start karo.
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // "topic" prefix wale messages sabko forward honge
        config.enableSimpleBroker("/topic"); 
        
        // "app" prefix wale messages Controller ke paas jayenge process hone
        config.setApplicationDestinationPrefixes("/app"); 
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Frontend yahan connect karega: http://localhost:9090/ws
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:5173").withSockJS();
    }
}
```

**B. The Controller (`ChatController.java`)**
Jaise REST Controller hota hai, waise hi Chat Controller hota hai.
But `@PostMapping` ki jagah `@MessageMapping` use hota hai.

```java
@Controller
public class ChatController {

    // Jab koi '/app/chat/{sessionId}' pe message bhejta hai...
    @MessageMapping("/chat/{sessionId}")
    @SendTo("/topic/session/{sessionId}") // ...toh wo is topic pe forward ho jayega
    public ChatMessage sendMessage(@DestinationVariable Long sessionId, ChatMessage message) {
        return message; // Broker automatically sends this to everyone subscribed!
    }
}
```

### Frontend (React)

Hum library use karenge: `sockjs-client` aur `stompjs`.

```javascript
// 1. Connect
const socket = new SockJS('http://localhost:9090/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
    // 2. Subscribe (Listen for messages)
    stompClient.subscribe(`/topic/session/${sessionId}`, (payload) => {
        const newMessage = JSON.parse(payload.body);
        setMessages(prev => [...prev, newMessage]); // Update UI
    });
});

// 3. Send Message
const sendMessage = () => {
    const chatMessage = {
        sender: "Prateek",
        content: "Hello Bhai!",
        sessionId: 123
    };
    stompClient.send(`/app/chat/${sessionId}`, {}, JSON.stringify(chatMessage));
};
```

---

## Summary (Exam Notes)
1.  **WebSocket** = Persistent 2-way connection (Phone call).
2.  **STOMP** = Protocol jo hum use karenge (Makes it easy).
3.  **Broker** = Backend ka Postman jo messages distribute karta hai.
4.  **Subscribe** = Frontend sun raha hai.
5.  **Send** = Frontend bol raha hai.

Ready to code this? 🚀
