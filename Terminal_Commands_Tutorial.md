# Terminal Commands Explained

## What Just Happened (Troubleshooting Session)

### ❌ The Problem
When we ran `npm run dev`, we got errors because **Tailwind CSS v4** has breaking changes.

---

## Commands I Ran (Step-by-Step Explanation)

### 1️⃣ `npm uninstall @tailwindcss/postcss`
**What it does:** Removes the Tailwind v4 package.  
**Why:** v4 is experimental and causing errors. We need stable v3.

```bash
npm uninstall @tailwindcss/postcss
# Output: removed 11 packages ✅
```

---

### 2️⃣ `npm install -D tailwindcss@^3.4.0 postcss autoprefixer`
**What it does:** Installs Tailwind CSS version 3 (stable).  
**Breaking it down:**
- `npm install` = Install packages
- `-D` = "Dev Dependency" (only needed during development, not in production)
- `tailwindcss@^3.4.0` = Install version 3.4.0 specifically
- `postcss` = Tool that processes CSS
- `autoprefixer` = Automatically adds browser prefixes (-webkit-, -moz-)

```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
# This downloads and installs the packages
```

---

### 3️⃣ `npx tailwindcss init -p`
**What it does:** Creates config files for Tailwind.  
**Breaking it down:**
- `npx` = Run a package command (without installing globally)
- `tailwindcss init` = Create `tailwind.config.js`
- `-p` = Also create `postcss.config.js`

**Creates 2 files:**
1. `tailwind.config.js` - Tells Tailwind where to look for classes
2. `postcss.config.js` - Tells Vite how to process CSS

---

### 4️⃣ `npm run dev`
**What it does:** Starts the development server.  
**Breaking it down:**
- `npm run` = Run a script from `package.json`
- `dev` = The script name (defined in package.json as `vite`)

**Output you'll see:**
```
VITE v7.3.1  ready in 756 ms
➜  Local:   http://localhost:5173/
```

This means: "Server is running! Open http://localhost:5173/ in browser"

---

## Common Terminal Patterns

| Command | Purpose | Example |
|---------|---------|---------|
| `npm install <package>` | Add a package to project | `npm install react` |
| `npm uninstall <package>` | Remove a package | `npm uninstall lodash` |
| `npm run <script>` | Run a script from package.json | `npm run dev` |
| `npx <command>` | Run a package command once | `npx create-vite` |
| `cd <folder>` | Change directory | `cd client` |
| `ls` | List files in current directory | `ls` |
| `pwd` | Show current directory path | `pwd` |

---

## How to Read Errors

When you see an error like:
```
[plugin:vite:css] [postcss] It looks like you're trying to use...
```

**How to understand it:**
1. `[plugin:vite:css]` = Which tool has the error (Vite's CSS plugin)
2. `[postcss]` = Specific part (PostCSS processing)
3. Rest of message = What went wrong + how to fix it

**My debugging process:**
1. Read the error message carefully
2. Identify which file/tool is causing it
3. Google the error if needed
4. Try the suggested fix
5. Restart the server

---

## What We'll Do Next
1. ✅ Uninstall v4 packages
2. ✅ Install v3 packages  
3. ⏳ Create proper config files
4. ⏳ Update CSS file
5. ⏳ Restart server
6. ⏳ Test in browser
