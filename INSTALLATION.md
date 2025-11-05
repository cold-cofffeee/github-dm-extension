# 📦 Installation & Setup - GitHub DM Extension

## Prerequisites Check

Before starting, verify you have:

- ✅ **Node.js 14+** - Check with: `node --version`
- ✅ **npm** - Check with: `npm --version`
- ✅ **Chrome/Edge/Brave** - Any Chromium browser
- ✅ **GitHub Account** - You'll need this for OAuth

---

## 🔧 Installation Steps

### Step 1: Install Node.js Dependencies

**On Windows PowerShell:**

If you get an execution policy error, run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then install dependencies:

```bash
npm install
```

**On Command Prompt (cmd):**

```bash
npm install
```

**On macOS/Linux:**

```bash
npm install
```

### Step 2: Set Up GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the form:
   ```
   Application name: GitHub DM System
   Homepage URL: http://localhost:8080
   Authorization callback URL: http://localhost:8080/auth/callback
   ```
4. Click **"Register application"**
5. Copy your **Client ID**
6. Click **"Generate a new client secret"** and copy it

### Step 3: Configure Environment Variables

1. Copy the example file:
   ```bash
   copy .env.example .env     # Windows
   cp .env.example .env        # macOS/Linux
   ```

2. Edit `.env` file and add your credentials:
   ```env
   GITHUB_CLIENT_ID=your_actual_client_id_here
   GITHUB_CLIENT_SECRET=your_actual_client_secret_here
   PORT=8080
   REDIRECT_URI=http://localhost:8080/auth/callback
   ```

### Step 4: Create Extension Icons

#### Option A: Use the Icon Generator (Recommended)

1. Open `generate-icons.html` in your browser
2. Click the download buttons to save:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
3. Place all three files in the `icons/` folder

#### Option B: Use Your Own Icons

Create three PNG files with the following dimensions:
- 16x16 pixels → `icons/icon16.png`
- 48x48 pixels → `icons/icon48.png`
- 128x128 pixels → `icons/icon128.png`

#### Option C: Skip Icons (Temporary)

You can temporarily remove the icon references from `manifest.json`:

1. Open `manifest.json`
2. Remove or comment out these sections:
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

### Step 5: Load Extension in Chrome

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Navigate to and select the `github-dm-extension` folder
5. The extension should now appear with a green checkmark ✅

### Step 6: Start the OAuth Server

Open a terminal in the project folder and run:

```bash
npm start
```

You should see output like:
```
🚀 GitHub DM System - OAuth Server
==================================================
✅ Server running on http://localhost:8080
📋 Client ID: Ov23li...
🔗 Redirect URI: http://localhost:8080/auth/callback
==================================================
⏳ Waiting for OAuth callbacks...
```

**Important**: Keep this terminal window open while using the extension!

---

## ✅ Verification

### Test the Installation

1. **Check the OAuth Server**:
   - Open http://localhost:8080 in your browser
   - You should see the server status page

2. **Test on GitHub**:
   - Visit any GitHub user profile (e.g., https://github.com/torvalds)
   - Look for the green "Send DM" button in the left sidebar
   - If you see it, the extension is working! 🎉

3. **Test Authentication**:
   - Click the "Send DM" button
   - Click "Login with GitHub"
   - Authorize the application
   - You should be redirected back to the extension

4. **Send a Test Message**:
   - Repository: Use any public repo (e.g., `username/reponame`)
   - Subject: "Test Message"
   - Message: "Hello, testing the extension!"
   - Click "Send Message"

---

## 🐛 Troubleshooting

### npm install fails

**Error**: "Running scripts is disabled"

**Solution** (Windows PowerShell):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try `npm install` again.

---

### Server won't start

**Error**: "Address already in use"

**Solution**: Another process is using port 8080.

**Option 1**: Kill the process:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <process_id> /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9
```

**Option 2**: Change the port in `.env`:
```env
PORT=8081
```

---

### Extension not loading

**Error**: "Manifest version not supported" or similar

**Solution**: Make sure you're using Chrome 88+ or another Chromium browser.

---

### Button not appearing

**Issue**: No "Send DM" button on GitHub profiles

**Solutions**:
1. Refresh the GitHub page (Ctrl+R or Cmd+R)
2. Make sure you're on a **user profile** page (not organization or repo)
3. Check the browser console (F12) for errors
4. Reload the extension at `chrome://extensions/`

---

### Authentication fails

**Issue**: Login doesn't work or redirects to error page

**Solutions**:
1. Verify your `.env` file has the correct credentials
2. Check that the OAuth callback URL matches exactly: `http://localhost:8080/auth/callback`
3. Make sure the OAuth server is running
4. Check server logs in the terminal for error messages

---

### Messages not sending

**Issue**: "Failed to send message" error

**Solutions**:
1. Make sure the repository exists and is public
2. Verify you have permission to create issues in that repo
3. Check if you're authenticated (look for green status in popup)
4. Try logging out and back in

---

## 📚 Next Steps

- Read the [Quick Start Guide](QUICK_START.md) for usage tips
- Check the [README](README.md) for detailed documentation
- Join discussions or report issues on GitHub

---

## 🆘 Still Having Issues?

1. Check the console logs:
   - Extension: Right-click extension → Inspect popup
   - Server: Look at terminal where `npm start` is running
   
2. Search existing issues: https://github.com/mahmudnibir/github-dm-extension/issues

3. Create a new issue with:
   - Your OS and browser version
   - Error messages (from console and terminal)
   - Steps to reproduce the problem

---

**Happy messaging! 📨**
