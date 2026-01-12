# Day 3-4: Landing Page with Framer Motion

**Date:** 13 Jan 2026  
**Goal:** Learn animations (Framer Motion) and build a professional Landing Page

---

## 📚 What is Framer Motion?

**Framer Motion** is a React library that makes animations **easy and smooth**.

**Think of it as:**
- CSS animations = Manual gear car (harder to control)
- Framer Motion = Automatic car (easy and powerful)

---

## 🎬 Core Concepts

### 1. The `motion` Component

Instead of regular HTML tags, you use `motion.div`, `motion.button`, etc.

**Regular HTML:**
```jsx
<div>Hello</div>
<button>Click me</button>
```

**With Framer Motion:**
```jsx
import { motion } from 'framer-motion';

<motion.div>Hello</motion.div>
<motion.button>Click me</motion.button>
```

Everything that starts with `motion.` can be animated! 🪄

---

### 2. Basic Animations

#### a) **Fade In (Opacity)**

Make something appear gradually:

```jsx
<motion.div
  initial={{ opacity: 0 }}      // Start: invisible
  animate={{ opacity: 1 }}      // End: fully visible
  transition={{ duration: 1 }}  // Takes 1 second
>
  I fade in!
</motion.div>
```

**What happens:**
- `initial` = Starting state (opacity: 0 means invisible)
- `animate` = Ending state (opacity: 1 means visible)
- `transition` = How long it takes

#### b) **Slide In (Position)**

Make something slide from the left:

```jsx
<motion.div
  initial={{ x: -100 }}    // Start: 100px to the left
  animate={{ x: 0 }}       // End: original position
  transition={{ duration: 0.5 }}
>
  I slide in from left!
</motion.div>
```

**Directions:**
- `x: -100` = Move left
- `x: 100` = Move right
- `y: -100` = Move up
- `y: 100` = Move down

#### c) **Scale (Zoom)**

Make something grow:

```jsx
<motion.div
  initial={{ scale: 0 }}     // Start: tiny (invisible)
  animate={{ scale: 1 }}     // End: normal size
  transition={{ duration: 0.8 }}
>
  I grow!
</motion.div>
```

---

### 3. Combining Animations

You can animate **multiple things at once**:

```jsx
<motion.div
  initial={{ 
    opacity: 0,    // Invisible
    y: 50,         // Below
    scale: 0.8     // Smaller
  }}
  animate={{ 
    opacity: 1,    // Visible
    y: 0,          // Original position
    scale: 1       // Normal size
  }}
  transition={{ duration: 0.6 }}
>
  I fade in, slide up, and grow!
</motion.div>
```

---

### 4. Stagger Animations (Sequential)

Make items appear one after another (like a cascade):

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2  // 0.2 second delay between each child
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// Usage:
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants}>Item 1</motion.div>
  <motion.div variants={itemVariants}>Item 2</motion.div>
  <motion.div variants={itemVariants}>Item 3</motion.div>
</motion.div>
```

**Result:** Item 1 appears → wait 0.2s → Item 2 appears → wait 0.2s → Item 3 appears

---

### 5. Hover & Tap Effects

Add interactivity:

```jsx
<motion.button
  whileHover={{ 
    scale: 1.1,           // Grow 10% on hover
    boxShadow: "0px 5px 15px rgba(0,0,0,0.3)"
  }}
  whileTap={{ scale: 0.95 }}  // Shrink when clicked
>
  Click me!
</motion.button>
```

---

## 🎨 Real Example: Hero Section Animation

```jsx
import { motion } from 'framer-motion';

function Hero() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      
      {/* Headline - Fades in and slides up */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-bold text-white"
      >
        Welcome to Skill Loop
      </motion.h1>

      {/* Subtitle - Appears after headline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-xl text-white"
      >
        Exchange skills, grow together
      </motion.p>

      {/* Button - Bounces in */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        className="bg-white text-purple-600 px-8 py-3 rounded-lg"
      >
        Get Started
      </motion.button>

    </div>
  );
}
```

**Timeline:**
1. 0.0s: Headline fades in and slides up
2. 0.3s: Subtitle fades in
3. 0.6s: Button bounces in

---

## 📱 Responsive Design Basics

### What is Responsive Design?

Making your website look good on **all screen sizes**:
- 📱 **Mobile** (320px - 640px)
- 📲 **Tablet** (640px - 1024px)
- 💻 **Laptop/Desktop** (1024px+)

### Tailwind Responsive Prefixes

| Prefix | Screen Size | Example |
|--------|-------------|---------|
| *(none)* | Mobile (default) | `text-sm` |
| `sm:` | Tablet (640px+) | `sm:text-lg` |
| `md:` | Laptop (768px+) | `md:text-xl` |
| `lg:` | Desktop (1024px+) | `lg:text-3xl` |

**Example:**
```jsx
<h1 className="
  text-2xl      // Mobile: small
  md:text-4xl   // Laptop: larger
  lg:text-6xl   // Desktop: huge
">
  Skill Loop
</h1>
```

**On mobile:** Text is 2xl  
**On laptop:** Text is 4xl  
**On desktop:** Text is 6xl

---

## ✅ Key Takeaways

1. **Framer Motion makes animations easy** - Just add `initial`, `animate`, `transition`
2. **Combine animations** for "wow" effects (fade + slide + scale)
3. **`whileHover` and `whileTap`** make buttons feel alive
4. **Responsive = Different styles for different screens** using `sm:`, `md:`, `lg:`

---

## ❓ My Questions & Answers

*(Will be updated as you ask)*

---

## 📝 Next Steps

Once you understand these concepts, we'll:
1. Install Framer Motion (`npm install framer-motion`)
2. Build a Hero Section with all these animations
3. Make it responsive for mobile/tablet/desktop
