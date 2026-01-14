# 🎓 Skill Loop: Frontend Master Class (Day 1-4)

## 1. The Two Pillars of React: `useState` & `useEffect`

In Step-by-Step plain English.

### A. `useState` = The Brain's Short-Term Memory 🧠

**Problem:** Standard variables (`let count = 0`) DONT work in React. If you change them, React doesn't "see" it, so the screen doesn't update.

**Solution:** `useState`. It tells React: *"Hey, if this data changes, please re-paint the screen!"*

**Analogy:**
*   Imagine a scoreboard at a stadium.
*   **Variable:** Writing the score on a napkin. (Nobody sees it).
*   **useState:** Updating the giant electronic board. (Everyone sees it immediately).

**Code in `Navbar.jsx`:**
```javascript
const [isOpen, setIsOpen] = useState(false);
```
1.  **`isOpen`**: The current value (Is the menu open? No/False).
2.  **`setIsOpen`**: The remote control to change it.
3.  **Screen Update:** When you click the button -> `setIsOpen(true)` -> React re-draws the Navbar to show the menu.

---

### B. `useEffect` = The "Side Effect" Manager ⚡

**Problem:** Sometimes you need to do things *outside* of just drawing pixels (e.g., setting a timer, fetching data from a server, listening for mouse movements).

**Solution:** `useEffect`. It tells React: *"Hey, do this action AFTER you finish painting the screen."*

**Analogy:**
*   **Rendering:** You cook dinner (The UI).
*   **useEffect:** After dinner is served, you turn on the dishwasher (The Side Effect). You don't wash dishes *while* cooking.

**Code in `ThemeContext.jsx`:**
```javascript
useEffect(() => {
    // This runs automatically whenever 'colorTheme' changes
    document.body.classList.remove(...); 
    document.body.classList.add(`theme-${colorTheme}`);
}, [colorTheme]);
```
1.  **The Action:** Change the CSS class on the `<body>` tag.
2.  **The Trigger (`[colorTheme]`):** "Only run this code if `colorTheme` changed."
3.  **Result:** You pick "Pink" -> React updates state -> Then `useEffect` runs and paints the body pink.

---

## 2. Overall Code Walkthrough (How it all connects)

### 📂 `main.jsx` (The Entry Point)
This is the Big Bang. It grabs `App.jsx` and injects it into the HTML file (`index.html`).
*   It wraps everything in `<ThemeContext>` so **Dark Mode** works everywhere.

### 📂 `App.jsx` (The Skeleton)
It just stacks the blocks:
1.  `<MouseSpotlight />`: The physics cursor.
2.  `<Navbar />`: Top bar.
3.  `<Hero />`, `<Features />`, `<HowItWorks />`: The content blocks.
4.  `<Footer />`: Bottom bar.

### 📂 `ThemeContext.jsx` (The Global Storage)
**Why do we need this?**
*   Without Context, you'd have to pass "isDark" from App -> Navbar -> Button (Prop Drilling 😫).
*   **Context** is like a "Cloud Storage". Any component can just `useTheme()` to get the current color, no matter how deep it is.

### 📂 `index.css` (The Styling Engine)
We defined CSS Variables (`--primary: #a855f7`).
*   **Why?** So we can change the *entire* website's color just by changing that one variable (The "Theme" feature).

---

## 3. Summary for Interview
"I built a React application using **Functional Components** and **Hooks**. I used `useState` to manage local UI state (like opening menus) and custom **Context API** for global state (Theme/Dark Mode). I optimized animations using `useEffect` for event listeners and `Framer Motion` for hardware-accelerated transitions."
