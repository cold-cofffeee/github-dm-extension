# 📨 GitHub DM System

<div align="center">

![GitHub status](https://img.shields.io/badge/status-active-brightgreen.svg)
![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Chrome-yellow.svg)

**A powerful Chrome extension that adds direct messaging functionality to GitHub profiles**

Send private messages to any GitHub user through their repositories' issue system

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Configuration](#%EF%B8%8F-configuration) • [FAQ](#-faq)

</div>

---

## 🌟 Overview

GitHub DM System is a Chrome extension that enhances GitHub by adding a "Send DM" button to user profiles. It leverages GitHub's Issues API to enable private communication between users, creating a seamless messaging experience within GitHub's ecosystem.

### ✨ Key Highlights

- 🎯 **One-Click Messaging**: Add a DM button to any GitHub profile
- 🔐 **Secure OAuth**: GitHub OAuth 2.0 authentication
- 💬 **Issue-Based Messages**: Utilizes GitHub Issues for message delivery
- 🎨 **Modern UI**: Clean, responsive interface with dark mode support
- ⚡ **Fast & Lightweight**: Minimal resource usage
- 🔧 **Easy Setup**: Simple configuration process

---

## 🚀 Features

### For Users
- ✅ Send direct messages to any GitHub user
- ✅ Automatic recipient detection from profile pages
- ✅ Rich text message composition
- ✅ Message history tracking
- ✅ Real-time authentication status
- ✅ Dark mode support

### For Developers
- ✅ Clean, modular code structure
- ✅ Manifest V3 compliant
- ✅ Comprehensive error handling
- ✅ Detailed console logging
- ✅ Easy to extend and customize

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Google Chrome** (or Chromium-based browser) version 88+
- **Node.js** version 14+ and npm
- A **GitHub account**
- A **GitHub OAuth App** (we'll create this together)

---

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/mahmudnibir/github-dm-extension.git
cd github-dm-extension
```

### Step 2: Install Server Dependencies

```bash
npm install
```

### Step 3: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `GitHub DM System` (or any name you prefer)
   - **Homepage URL**: `http://localhost:8080`
   - **Authorization callback URL**: `http://localhost:8080/auth/callback`
4. Click **"Register application"**
5. Copy your **Client ID** and **Client Secret**

### Step 4: Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
PORT=8080
REDIRECT_URI=http://localhost:8080/auth/callback
```

### Step 5: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **"Developer mode"** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `github-dm-extension` folder
5. The extension should now appear in your extensions list

### Step 6: Create Extension Icons (Optional)

The extension expects icons in the `icons/` directory. You can:
- Use your own icons (16x16, 48x48, 128x128 PNG files)
- Or temporarily remove icon references from `manifest.json`

---

## 🎯 Usage

### Starting the OAuth Server

The extension requires a local OAuth server to handle GitHub authentication:

```bash
npm start
```

You should see:
```
🚀 GitHub DM System - OAuth Server
==================================================
✅ Server running on http://localhost:8080
📋 Client ID: Ov23li...
🔗 Redirect URI: http://localhost:8080/auth/callback
==================================================
⏳ Waiting for OAuth callbacks...
```

**Important**: Keep this server running while using the extension!

### Sending Your First Message

1. **Navigate to any GitHub user profile**
   - Example: `https://github.com/torvalds`

2. **Look for the "Send DM" button**
   - It appears in the left sidebar near the profile picture
   - Green button with an envelope icon

3. **Click the "Send DM" button**
   - A popup window will open

4. **First-Time Setup**
   - Click "Login with GitHub"
   - Authorize the application
   - You'll be redirected back to the extension

5. **Compose Your Message**
   - **Repository**: Enter the user's repository name where the message will be created as an issue
     - Example: `torvalds/linux` or any public repository
   - **Subject**: Enter a message title
   - **Message**: Type your message content
   
6. **Send the Message**
   - Click "Send Message"
   - The message will be created as a GitHub issue
   - You'll receive a confirmation with a link to the issue

---

## ⚙️ Configuration

### Extension Settings

The extension stores:
- **GitHub Client ID**: Your OAuth app's client ID
- **Access Token**: Your GitHub authentication token (encrypted)
- **Target Username**: The last profile you visited

### Server Configuration

Edit `.env` to customize:

```env
# Server port (default: 8080)
PORT=8080

# OAuth redirect URI (must match GitHub OAuth App settings)
REDIRECT_URI=http://localhost:8080/auth/callback
```

---

## 🏗️ Project Structure

```
github-dm-extension/
├── manifest.json           # Extension manifest (Manifest V3)
├── background.js          # Service worker (handles OAuth, messaging)
├── content.js             # Content script (adds DM button to GitHub)
├── content-styles.css     # Styles for DM button
├── popup.html             # Extension popup UI
├── popup.js               # Popup functionality
├── styles.css             # Popup styles
├── callback.html          # OAuth callback handler
├── app.js                 # OAuth server (Node.js/Express)
├── package.json           # Node.js dependencies
├── .env.example           # Environment variables template
└── README.md              # This file
```

---

## 🔧 How It Works

### Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│  GitHub Profile │────────▶│  Content Script  │────────▶│  Background │
│      Page       │         │  (content.js)    │         │  Service    │
└─────────────────┘         └──────────────────┘         │  Worker     │
                                                          └──────┬──────┘
                                                                 │
                            ┌────────────────┐                  │
                            │  OAuth Server  │◀─────────────────┘
                            │  (app.js)      │
                            └────────┬───────┘
                                     │
                            ┌────────▼────────┐
                            │  GitHub API     │
                            │  (Issues)       │
                            └─────────────────┘
```

### Message Flow

1. **User clicks "Send DM"** on a GitHub profile
2. **Content script** extracts username and opens popup
3. **Popup** prompts for authentication (if needed)
4. **Background script** initiates OAuth flow
5. **OAuth server** exchanges code for access token
6. **User composes message** in popup
7. **Background script** sends message via GitHub Issues API
8. **Message created** as an issue in the specified repository

---

## 🛠️ Development

### Running in Development Mode

```bash
# Start server with auto-reload
npm run dev
```

### Debugging

- **Extension logs**: Open Chrome DevTools on the popup or background page
- **Server logs**: Check the terminal where `npm start` is running
- **GitHub API errors**: Look for error messages in the popup

### Testing

1. Test on your own profile first
2. Use a dedicated "messages" repository
3. Check GitHub's rate limits (5000 requests/hour for authenticated users)

---

## ❓ FAQ

### Q: Why do I need to run a local server?

**A:** Chrome extensions cannot directly store OAuth secrets securely. The local server handles the OAuth flow safely and exchanges the authorization code for an access token.

### Q: Can I send messages to any GitHub user?

**A:** You can send messages to any user who has a public repository. The message will be created as an issue in the repository you specify.

### Q: Is this official GitHub functionality?

**A:** No, this is a community-created extension. It uses GitHub's public API and Issues feature to enable messaging.

### Q: What happens if the user doesn't see my message?

**A:** They will receive a GitHub notification if they're watching the repository. Consider asking them to create a dedicated "inbox" repository.

### Q: Are messages private?

**A:** Messages are created as GitHub issues, which are public by default. For private communication, send messages to private repositories (requires the user to grant you access).

### Q: Can I customize the message format?

**A:** Yes! Edit the `popup.js` file and modify the message structure in the `handleSendMessage` function.

---

## 🐛 Troubleshooting

### Extension not working?

1. **Check if server is running**: Visit `http://localhost:8080`
2. **Reload the extension**: Go to `chrome://extensions/` and click the reload icon
3. **Check console logs**: Open DevTools on the extension popup
4. **Verify OAuth credentials**: Ensure `.env` has correct GitHub Client ID and Secret

### Button not appearing on profiles?

1. **Refresh the GitHub page**
2. **Check if you're on a user profile** (not organization or repository page)
3. **Open DevTools console** and look for error messages

### Authentication failing?

1. **Verify OAuth App callback URL**: Must be `http://localhost:8080/auth/callback`
2. **Check server logs** for error messages
3. **Try logging out and back in** from the extension popup

### Message not sending?

1. **Verify repository exists** and is public
2. **Check if you have permission** to create issues in that repository
3. **Ensure you're authenticated** (green status indicator in popup)
4. **Check GitHub API rate limits**

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on multiple GitHub pages
- Update documentation for new features

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This extension is for educational and personal use. It is not affiliated with or endorsed by GitHub. Use responsibly and respect GitHub's Terms of Service and API rate limits.

---

## 🙏 Acknowledgments

- GitHub for their excellent API
- Chrome Extensions documentation
- The open-source community

---

## 📧 Support

Having issues? Need help?

- 📫 Open an [issue](https://github.com/mahmudnibir/github-dm-extension/issues)
- 💬 Start a [discussion](https://github.com/mahmudnibir/github-dm-extension/discussions)
- ⭐ Star this repo if you find it useful!

---

<div align="center">

**Made with ❤️ for the GitHub Community**

[⬆ Back to Top](#-github-dm-system)

</div>

| 🔧 **Develop** | Make your changes, write clear commit messages |
| 📌 **Push** | Push to your fork & create a PR |
| 🚀 **Review** | Wait for approval & merge |


---

## License  

📝 This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.  

---

## Contact  
*Developed by [Nibir Mahmud](https://github.com/mahmudnibir)*


📧 **Email**: [nibirbbkr@gmail.com](mailto:nibirbbkr@gmail.com)  
🐦 **Github**: [@mahmudnibir](https://github.com/mahmudnibir)  

---
## Support  

> [!TIP]
 If you find this project helpful, **please consider giving it a star ⭐ on GitHub!** It helps others discover the project.  

---

