# ⚡ START HERE - First Time Setup

Welcome! This guide will get your GitHub DM Extension running in the next few minutes.

## 🎯 Before You Start

Open a **Command Prompt** (cmd) instead of PowerShell to avoid script execution issues.

---

## 📝 Step-by-Step Setup

### 1. Install Dependencies

Open **Command Prompt** in the project folder and run:

```cmd
npm install
```

If you see errors, you may need to install these packages individually:

```cmd
npm install express
npm install axios
npm install dotenv
npm install cors
```

---

### 2. Create Your GitHub OAuth App

1. **Go to:** https://github.com/settings/developers
2. **Click:** "New OAuth App"
3. **Fill in:**
   - Application name: `GitHub DM System`
   - Homepage URL: `http://localhost:8080`
   - Authorization callback URL: `http://localhost:8080/auth/callback`
4. **Click:** "Register application"
5. **Copy** your Client ID
6. **Click** "Generate a new client secret" and copy it

---

### 3. Configure Your Credentials

1. **Copy the example file:**
   ```cmd
   copy .env.example .env
   ```

2. **Open `.env` in Notepad:**
   ```cmd
   notepad .env
   ```

3. **Replace the placeholder values:**
   ```env
   GITHUB_CLIENT_ID=paste_your_actual_client_id_here
   GITHUB_CLIENT_SECRET=paste_your_actual_secret_here
   PORT=8080
   REDIRECT_URI=http://localhost:8080/auth/callback
   ```

4. **Save and close** Notepad

---

### 4. Generate Extension Icons

#### Option A: Quick Method (Recommended)
1. **Double-click** `generate-icons.html` to open it in your browser
2. **Click** the three download buttons
3. **Save** the files in the `icons` folder as:
   - `icon16.png`
   - `icon48.png`  
   - `icon128.png`

#### Option B: Skip Icons (Temporary)
1. **Open** `manifest.json` in Notepad
2. **Remove** these lines (around lines 16-28):
   ```json
   "default_icon": {
     "16": "icons/icon16.png",
     "48": "icons/icon48.png",
     "128": "icons/icon128.png"
   },
   ```
   and
   ```json
   "icons": {
     "16": "icons/icon16.png",
     "48": "icons/icon48.png",
     "128": "icons/icon128.png"
   },
   ```
3. **Save** the file

---

### 5. Load Extension in Chrome

1. **Open Chrome** and type in address bar: `chrome://extensions/`
2. **Turn on** "Developer mode" (toggle switch in top-right)
3. **Click** "Load unpacked"
4. **Select** the `github-dm-extension` folder
5. **Done!** The extension should now be loaded ✅

---

### 6. Start the OAuth Server

In Command Prompt, run:

```cmd
npm start
```

You should see:
```
🚀 GitHub DM System - OAuth Server
==================================================
✅ Server running on http://localhost:8080
```

**IMPORTANT:** Keep this window open! Don't close it.

---

### 7. Test Your Extension

1. **Open a new tab** in Chrome
2. **Visit any GitHub profile**, for example: https://github.com/torvalds
3. **Look for** a green "Send DM" button in the left sidebar
4. **Click it!**
5. **Click** "Login with GitHub" and authorize
6. **Fill in the form:**
   - Repository: `torvalds/linux` (or any public repository)
   - Subject: `Hello!`
   - Message: `Testing my new extension`
7. **Click** "Send Message"

If you see a success message with an issue link, **congratulations! 🎉** Your extension is working!

---

## ❓ Something Not Working?

### Extension not loading?
- Make sure you're using Chrome 88 or newer
- Try reloading: go to `chrome://extensions/` and click the refresh icon

### Server won't start?
- Check if port 8080 is already in use
- Try changing `PORT=8081` in your `.env` file

### Button not showing?
- Refresh the GitHub page (press F5)
- Make sure you're on a USER profile (not a repository or organization)

### Authentication fails?
- Double-check your `.env` file has the correct credentials
- Make sure there are no extra spaces
- Verify the callback URL is exactly: `http://localhost:8080/auth/callback`

---

## 📚 Need More Help?

- **Quick Start:** See `QUICK_START.md`
- **Detailed Guide:** See `INSTALLATION.md`
- **Full Docs:** See `README.md`

---

## 🎊 You're All Set!

Your GitHub DM Extension is ready to use. Every time you want to use it:

1. Open Command Prompt
2. Navigate to project folder
3. Run: `npm start`
4. Use the extension in Chrome!

**Happy messaging! 📨**
