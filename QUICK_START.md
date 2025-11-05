# 🚀 Quick Start Guide - GitHub DM Extension

This guide will help you get the GitHub DM Extension up and running in under 10 minutes!

## ⚡ Fast Track Setup

### 1️⃣ Install Dependencies (30 seconds)

```bash
npm install
```

### 2️⃣ Create GitHub OAuth App (2 minutes)

1. Visit: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Name**: `GitHub DM System`
   - **Homepage**: `http://localhost:8080`
   - **Callback URL**: `http://localhost:8080/auth/callback`
4. Click **"Register application"**
5. Copy the **Client ID** and generate a **Client Secret**

### 3️⃣ Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your credentials
# GITHUB_CLIENT_ID=your_client_id_here
# GITHUB_CLIENT_SECRET=your_client_secret_here
```

### 4️⃣ Generate Icons (1 minute)

```bash
# Open the icon generator in your browser
start generate-icons.html   # Windows
open generate-icons.html     # macOS
xdg-open generate-icons.html # Linux
```

Then:
1. Click the download buttons for each icon size
2. Save them in the `icons/` folder as:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

### 5️⃣ Load Extension in Chrome (1 minute)

1. Open Chrome: `chrome://extensions/`
2. Enable **"Developer mode"** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `github-dm-extension` folder
5. Extension loaded! ✅

### 6️⃣ Start OAuth Server (30 seconds)

```bash
npm start
```

You should see:
```
✅ Server running on http://localhost:8080
```

**Keep this terminal window open!**

### 7️⃣ Test It Out! (2 minutes)

1. **Visit any GitHub profile**: https://github.com/torvalds
2. **Look for the green "Send DM" button** in the left sidebar
3. **Click it** → Popup opens
4. **Click "Login with GitHub"** → Authenticate
5. **Fill in the form**:
   - Repository: `torvalds/linux` (or any public repo)
   - Subject: `Hello!`
   - Message: `Testing the DM extension`
6. **Click "Send Message"** → Done! 🎉

---

## 🎯 What's Next?

### Daily Usage

Every time you want to use the extension:

```bash
# Terminal 1: Start the OAuth server
npm start

# Then use the extension in Chrome!
```

### For Development

```bash
# Auto-restart server on changes
npm run dev
```

---

## ⚠️ Common Issues & Fixes

### ❌ "Server not running" error
**Fix**: Make sure you ran `npm start` and keep the terminal open

### ❌ "Authentication failed"
**Fix**: Check your `.env` file has the correct Client ID and Secret

### ❌ "Button not showing"
**Fix**: Refresh the GitHub page, or reload the extension at `chrome://extensions/`

### ❌ "Cannot create issue"
**Fix**: Make sure the repository exists and is public

---

## 📚 Full Documentation

For detailed information, see the main [README.md](README.md)

---

## 🆘 Need Help?

- Open an issue: https://github.com/mahmudnibir/github-dm-extension/issues
- Check the FAQ in README.md

---

**Happy messaging! 📨**
