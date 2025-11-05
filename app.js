// GitHub DM System - OAuth Server
// Handles GitHub OAuth callbacks and token exchange

const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// GitHub OAuth configuration
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:8080/auth/callback";

// Validate configuration
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌ ERROR: Missing GitHub OAuth credentials!");
  console.error("Please create a .env file with GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET");
  console.error("See .env.example for reference");
  process.exit(1);
}

// Enable CORS for Chrome extension
app.use(cors({
  origin: ['http://localhost', 'chrome-extension://*'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>GitHub DM System - OAuth Server</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 { color: #2ea44f; }
        .status { 
          padding: 15px; 
          background: #dafbe1; 
          border-left: 4px solid #2ea44f;
          margin: 20px 0;
        }
        code {
          background: #f6f8fa;
          padding: 3px 6px;
          border-radius: 3px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <h1>🚀 GitHub DM System - OAuth Server</h1>
      <div class="status">
        <strong>✅ Server is running!</strong>
      </div>
      <p>This server handles GitHub OAuth authentication for the GitHub DM Chrome extension.</p>
      <h2>Configuration:</h2>
      <ul>
        <li>Client ID: <code>${CLIENT_ID.substring(0, 8)}...</code></li>
        <li>Redirect URI: <code>${REDIRECT_URI}</code></li>
        <li>Server Port: <code>${PORT}</code></li>
      </ul>
      <h2>Status:</h2>
      <p>Waiting for OAuth callbacks...</p>
    </body>
    </html>
  `);
});

// OAuth callback route
app.get("/auth/callback", async (req, res) => {
  const { code, error, error_description } = req.query;
  
  console.log("📥 Received OAuth callback");
  
  // Handle OAuth errors
  if (error) {
    console.error("❌ OAuth error:", error, error_description);
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            padding: 20px;
            background: #ffebe9;
            border: 1px solid #ff8182;
            border-radius: 6px;
            color: #cf222e;
          }
          button {
            margin-top: 20px;
            padding: 10px 20px;
            background: #2ea44f;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <h1>❌ Authentication Error</h1>
        <div class="error">
          <strong>${error}</strong>
          <p>${error_description || 'An error occurred during authentication'}</p>
        </div>
        <button onclick="window.close()">Close Window</button>
      </body>
      </html>
    `);
  }
  
  // No code provided
  if (!code) {
    console.error("❌ No authorization code received");
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            padding: 20px;
            background: #ffebe9;
            border: 1px solid #ff8182;
            border-radius: 6px;
            color: #cf222e;
          }
        </style>
      </head>
      <body>
        <h1>❌ Authentication Error</h1>
        <div class="error">
          <p>No authorization code received from GitHub.</p>
        </div>
        <button onclick="window.close()">Close Window</button>
      </body>
      </html>
    `);
  }

  try {
    console.log("🔄 Exchanging code for access token...");
    
    // Exchange authorization code for access token
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token, token_type, scope, error: token_error } = response.data;

    // Handle token exchange errors
    if (token_error || !access_token) {
      console.error("❌ Token exchange error:", token_error || "No access token received");
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authentication Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              text-align: center;
            }
            .error {
              padding: 20px;
              background: #ffebe9;
              border: 1px solid #ff8182;
              border-radius: 6px;
              color: #cf222e;
            }
          </style>
        </head>
        <body>
          <h1>❌ Authentication Error</h1>
          <div class="error">
            <p>${token_error || 'Failed to obtain access token'}</p>
          </div>
          <button onclick="window.close()">Close Window</button>
        </body>
        </html>
      `);
    }

    console.log("✅ Access token obtained successfully");
    console.log("📊 Token type:", token_type);
    console.log("🔐 Scopes:", scope);

    // Return success page with the token embedded
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Successful</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .success {
            padding: 20px;
            background: #dafbe1;
            border: 1px solid #4ac26b;
            border-radius: 6px;
            color: #1a7f37;
            margin: 20px 0;
          }
          button {
            margin-top: 20px;
            padding: 10px 20px;
            background: #2ea44f;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background: #2c974b;
          }
          .loading {
            margin: 20px 0;
            color: #57606a;
          }
          .token-display {
            margin: 20px 0;
            padding: 15px;
            background: #f6f8fa;
            border-radius: 6px;
            font-family: monospace;
            font-size: 12px;
            word-break: break-all;
            color: #24292f;
          }
          .instruction {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <h1>✅ Authentication Successful!</h1>
        <div class="success">
          <h2>You're all set!</h2>
          <p>Your GitHub account has been connected successfully.</p>
        </div>
        
        <div class="instruction">
          <strong>📋 Copy your access token:</strong>
          <div class="token-display" id="tokenDisplay">${access_token}</div>
          <button onclick="copyToken()" id="copyBtn">📋 Copy Token</button>
        </div>
        
        <div class="loading">
          <p>✅ Token has been automatically stored in the extension!</p>
          <p>You can close this window now.</p>
        </div>
        
        <button onclick="window.close()">Close Window</button>
        
        <script>
          // The access token
          const accessToken = "${access_token}";
          
          // Function to copy token
          function copyToken() {
            const tokenDisplay = document.getElementById('tokenDisplay');
            const copyBtn = document.getElementById('copyBtn');
            
            navigator.clipboard.writeText(accessToken).then(() => {
              copyBtn.textContent = '✅ Copied!';
              copyBtn.style.background = '#2ea44f';
              setTimeout(() => {
                copyBtn.textContent = '📋 Copy Token';
                copyBtn.style.background = '';
              }, 2000);
            });
          }
          
          // Try to send message to extension via window.postMessage
          // This will be picked up by any listening content scripts
          function notifyExtension() {
            try {
              // Method 1: Post message to window (for content scripts)
              window.postMessage({
                type: 'GITHUB_DM_AUTH_SUCCESS',
                source: 'github-dm-oauth',
                access_token: accessToken
              }, '*');
              
              // Method 2: Try localStorage as fallback (extension can read it)
              try {
                localStorage.setItem('github_dm_temp_token', accessToken);
                localStorage.setItem('github_dm_temp_token_timestamp', Date.now().toString());
              } catch (e) {
                console.log('LocalStorage not available');
              }
              
              console.log('✅ Token notification sent');
              
              // Store in extension storage via injected script
              const script = document.createElement('script');
              script.textContent = \`
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                  chrome.runtime.sendMessage({
                    action: 'auth_success',
                    access_token: '\${accessToken}'
                  }, (response) => {
                    console.log('Token sent to extension:', response);
                  });
                }
              \`;
              document.head.appendChild(script);
              
            } catch (e) {
              console.error('Error sending token:', e);
            }
          }
          
          // Run notification
          notifyExtension();
          
          // Auto-close after 5 seconds
          let countdown = 5;
          const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
              clearInterval(countdownInterval);
              window.close();
            }
          }, 1000);
        </script>
      </body>
      </html>
    `);

  } catch (error) {
    console.error("❌ Error during token exchange:", error.message);
    
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Server Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
          }
          .error {
            padding: 20px;
            background: #ffebe9;
            border: 1px solid #ff8182;
            border-radius: 6px;
            color: #cf222e;
          }
        </style>
      </head>
      <body>
        <h1>❌ Server Error</h1>
        <div class="error">
          <p>An error occurred while processing your authentication.</p>
          <p>${error.message}</p>
        </div>
        <button onclick="window.close()">Close Window</button>
      </body>
      </html>
    `);
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    configured: !!(CLIENT_ID && CLIENT_SECRET)
  });
});

// Start the server
app.listen(PORT, () => {
  console.log("🚀 GitHub DM System - OAuth Server");
  console.log("=" .repeat(50));
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Client ID: ${CLIENT_ID.substring(0, 8)}...`);
  console.log(`🔗 Redirect URI: ${REDIRECT_URI}`);
  console.log("=" .repeat(50));
  console.log("⏳ Waiting for OAuth callbacks...");
});

// Handle server errors
app.on('error', (error) => {
  console.error("❌ Server error:", error.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log("\n🛑 Shutting down server...");
  process.exit(0);
});

