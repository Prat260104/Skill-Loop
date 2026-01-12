# Day 1-2: Learning React & Tailwind CSS

**Date:** 13 Jan 2026  
**Goal:** Understand React fundamentals (Components, JSX, Hooks) and Tailwind CSS basics

---

## 📚 What We Learned Today

### 1. What is React?
React is a JavaScript library for building User Interfaces (UI).

**Think of it like LEGO blocks:**
- **Components** = Individual LEGO pieces (reusable UI elements)
- **Your App** = Complete model made by combining pieces

**Example: A Simple Component**
```jsx
function WelcomeCard() {
  return (
    <div>
      <h1>Welcome to Skill Loop!</h1>
      <p>Find your learning partner</p>
    </div>
  );
}
```

---

### 2. JSX (JavaScript + XML)
JSX lets you write HTML-like code inside JavaScript.

```jsx
// This looks like HTML but it's actually JavaScript
const element = <h1 className="text-blue-500">Hello World</h1>;
```

**Rules:**
- Use `className` instead of `class` (because `class` is a JavaScript keyword)
- All tags must be closed: `<img />`, `<input />`
- Use `{}` for JavaScript expressions: `<p>{2 + 2}</p>` → displays "4"

---

### 3. React Hooks

#### a) `useState` - Remember Things
Creates a "state variable" that React remembers between renders.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  // count = current value (0)
  // setCount = function to update value
  
  return (
    <div>
      <p>Clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**Real Example for Skill Loop:**
```jsx
function MySkills() {
  const [skills, setSkills] = useState(['React', 'Java', 'DSA']);
  
  const addSkill = (newSkill) => {
    setSkills([...skills, newSkill]); // Add to existing array
  };
  
  return (
    <div>
      {skills.map(skill => <span key={skill}>{skill}</span>)}
    </div>
  );
}
```

#### b) `useEffect` - Run Code Automatically
Runs code when component loads or when specific values change.

```jsx
import { useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // This runs when component first loads
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []); // Empty array = run only once on load
}
```

**Dependency Array:**
```jsx
useEffect(() => {
  console.log('Effect runs');
}, [count]); // Runs whenever 'count' changes
```

---

### 4. Tailwind CSS - Utility-First CSS

**Traditional CSS vs Tailwind:**

| Traditional CSS | Tailwind CSS |
|----------------|--------------|
| Write separate `.css` file | Write classes directly in HTML |
| `.button { background: blue; padding: 10px; }` | `className="bg-blue-500 p-4"` |

**Common Tailwind Classes:**
```jsx
<div className="
  bg-purple-600     // Background color (purple, shade 600)
  text-white        // Text color white
  p-6               // Padding all sides (24px)
  px-4              // Padding X-axis (left/right, 16px)
  py-2              // Padding Y-axis (top/bottom, 8px)
  rounded-lg        // Rounded corners (large)
  shadow-xl         // Drop shadow (extra large)
  hover:bg-purple-700  // Change color on hover
  transition        // Smooth animations
">
  Beautiful Card
</div>
```

**Responsive Design:**
```jsx
<div className="
  text-sm           // Small text on mobile
  md:text-lg        // Large text on tablets and up
  lg:text-2xl       // 2XL text on desktops
">
  Responsive Text
</div>
```

**Prefix meanings:**
- `sm:` = tablets (640px+)
- `md:` = laptops (768px+)
- `lg:` = desktops (1024px+)

---

## 🎯 Quick Quiz (Not Answered Yet)

1. **What is a Component?**
   - A) A JavaScript function that returns UI
   - B) A CSS file
   - C) A database

2. **What does `useState(0)` do?**
   - A) Creates a state variable starting at 0
   - B) Deletes data
   - C) Calls an API

3. **What does `className="p-4 bg-blue-500"` do?**
   - A) Adds padding and blue background
   - B) Only adds padding
   - C) Does nothing

---

## ❓ My Questions & Answers

### Q1: What does `{skills.map(skill => <span key={skill}>{skill}</span>)}` mean?

**Answer:** This uses JavaScript's `.map()` function to render a list in React.

**Breaking it down:**

1. **`.map()` basics:**
   ```javascript
   const numbers = [1, 2, 3];
   const doubled = numbers.map(num => num * 2);
   // Result: [2, 4, 6]
   ```
   `.map()` transforms each item in an array.

2. **In React - Rendering Lists:**
   ```javascript
   const skills = ['React', 'Java', 'DSA'];
   
   // Convert each skill into a <span> element
   {skills.map(skill => <span key={skill}>{skill}</span>)}
   ```
   
   **Result in HTML:**
   ```html
   <span>React</span>
   <span>Java</span>
   <span>DSA</span>
   ```

3. **Why `key={skill}`?**
   - React needs a unique identifier for each item in a list
   - Helps React know which items changed/added/removed
   - **Without key:** React shows a warning ⚠️
   - **With key:** React efficiently updates the list ✅

**Complete Example:**
```javascript
function MySkills() {
  const skills = ['React', 'Java', 'DSA'];
  
  return (
    <div>
      <h2>My Skills:</h2>
      {skills.map(skill => (
        <span 
          key={skill} 
          className="bg-blue-500 text-white px-3 py-1 rounded mx-1"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
```

**What you see:** Beautiful skill tags → `[React] [Java] [DSA]`

---

## ✅ Tasks Completed Today
- [ ] Learned React basics (Components, JSX)
- [ ] Understood `useState` and `useEffect` hooks
- [ ] Learned Tailwind CSS utility classes
- [ ] Ready to initialize project next

---

## 📝 Next Steps (Day 3-4)
- Initialize Vite + React project
- Install Tailwind CSS
- Build the Landing Page with Framer Motion
