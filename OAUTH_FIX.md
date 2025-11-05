# 🔧 Quick Fix - OAuth Token Manual Entry

## The Issue
The OAuth callback cannot automatically send the token to the extension due to browser security restrictions.

## ✅ Simple Solution (2 minutes)

### When you authenticate with GitHub:

1. **After clicking "Login with GitHub"**, you'll be redirected to GitHub
2. **Authorize the application**
3. **You'll see a success page** with your access token displayed
4. **Copy the access token** (click the "Copy Token" button)
5. **Go back to the extension popup**
6. **Paste the token** in the configuration section
7. **Done!** ✅

---

## 📝 Detailed Steps

### Step 1: Open the Extension
- Click the extension icon in Chrome toolbar
- The popup will open

### Step 2: Configure Client ID (if not done)
- Enter your GitHub Client ID: `Ov23livhrOHsgDv5ZtXl`
- Click "Save Configuration"

### Step 3: Start Authentication
- Click "Login with GitHub"
- A new tab will open with GitHub's authorization page

### Step 4: Authorize
- Review the permissions
- Click "Authorize [your-app-name]"

### Step 5: Copy the Token
- After authorization, you'll see a success page
- Your access token will be displayed
- Click the **"📋 Copy Token"** button

### Step 6: Return to Extension
- Go back to the Chrome tab with the extension
- The popup should still be open
- If not, click the extension icon again

### Step 7: Paste Token (Manual Entry)
We'll add a manual token entry field in the popup!

---

## 🎯 Alternative: Auto-Detection (What We're Working On)

We're implementing automatic token detection, but until then, manual copy-paste works perfectly!

---

## ⚡ Quick Test

Once you have the token stored:
1. Visit any GitHub profile (e.g., https://github.com/torvalds)
2. Click the green "Send DM" button
3. Fill in the message form
4. Send your message!

---

**Token is stored securely in Chrome's local storage and will persist between sessions.**
