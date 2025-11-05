// GitHub DM System - Background Service Worker
// Handles OAuth authentication and communication between content script and popup

console.log('🚀 GitHub DM System - Background service worker started');

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Received message:', message);

  // Handle opening the DM popup from content script
  if (message.action === "open_dm_popup") {
    const username = message.username;
    console.log(`📧 Opening DM popup for user: ${username}`);
    
    // Store the target username
    chrome.storage.local.set({ 
      targetUsername: username,
      dmButtonClicked: true 
    }, () => {
      // Open the popup window
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 450,
        height: 650,
        focused: true
      }, (window) => {
        if (chrome.runtime.lastError) {
          console.error('Error opening popup:', chrome.runtime.lastError);
        } else {
          console.log('✅ Popup opened successfully');
        }
      });
    });
    
    return true;
  }

  // Handle OAuth authentication start
  if (message.action === "start_auth") {
    console.log('🔐 Starting OAuth authentication...');
    
    // Get the client ID from storage
    chrome.storage.local.get(['github_client_id'], (result) => {
      const clientId = result.github_client_id;
      
      if (!clientId) {
        console.error('❌ No GitHub Client ID found. Please configure it first.');
        sendResponse({ success: false, error: 'No Client ID configured' });
        return;
      }

      // Create OAuth URL with localhost callback
      const redirectUri = 'http://localhost:8080/auth/callback';
      const authUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=repo,user`;

      console.log('🔗 Auth URL:', authUrl);

      // Open OAuth page in new tab
      chrome.tabs.create({ url: authUrl }, (tab) => {
        console.log('✅ OAuth tab opened:', tab.id);
        sendResponse({ success: true, tabId: tab.id });
      });
    });
    
    return true;
  }

  // Handle OAuth callback with access token
  if (message.action === "auth_success") {
    const accessToken = message.access_token;
    console.log('✅ Authentication successful, storing token...');
    
    // Store the access token
    chrome.storage.local.set({ 
      github_access_token: accessToken,
      auth_timestamp: Date.now()
    }, () => {
      console.log('✅ Token stored successfully');
      
      // Notify all extension pages of successful login
      chrome.runtime.sendMessage({ 
        action: "login_success",
        token: accessToken 
      });
      
      sendResponse({ success: true });
    });
    
    return true;
  }

  // Handle sending GitHub DM
  if (message.action === "send_dm") {
    const { repository, messageTitle, messageBody, accessToken } = message;
    console.log(`📤 Sending DM to ${repository}...`);
    
    // Send message via GitHub Issues API
    fetch(`https://api.github.com/repos/${repository}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        title: messageTitle,
        body: messageBody
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
        });
      }
      return response.json();
    })
    .then(data => {
      if (data.id) {
        console.log('✅ Message sent successfully:', data.html_url);
        sendResponse({ 
          success: true, 
          issueUrl: data.html_url,
          issueNumber: data.number 
        });
      } else {
        console.error('❌ Failed to send message:', data);
        sendResponse({ 
          success: false, 
          error: data.message || 'Failed to create issue' 
        });
      }
    })
    .catch(error => {
      console.error('❌ Error sending message:', error);
      let errorMsg = error.message;
      
      // Provide helpful messages for common errors
      if (errorMsg.includes('Not Found') || errorMsg.includes('404')) {
        errorMsg = `Repository "${repository}" not found. The recipient must create this repository first with Issues enabled.`;
      } else if (errorMsg.includes('Bad credentials') || errorMsg.includes('401')) {
        errorMsg = 'Invalid or expired access token. Please re-authenticate.';
      } else if (errorMsg.includes('403')) {
        errorMsg = 'Permission denied. Make sure the repository has Issues enabled and you have access.';
      }
      
      sendResponse({ success: false, error: errorMsg });
    });
    
    return true; // Keep the message channel open for async response
  }

  // Handle logout
  if (message.action === "logout") {
    console.log('🚪 Logging out...');
    chrome.storage.local.remove(['github_access_token', 'auth_timestamp'], () => {
      console.log('✅ Logged out successfully');
      sendResponse({ success: true });
    });
    return true;
  }
});

// Listen for messages from external pages (OAuth callback)
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('📨 Received external message:', message);
  
  if (message.action === "auth_success" && message.access_token) {
    console.log('✅ Authentication successful from external page');
    
    // Store the access token
    chrome.storage.local.set({ 
      github_access_token: message.access_token,
      auth_timestamp: Date.now()
    }, () => {
      console.log('✅ Token stored successfully');
      
      // Notify all extension pages
      chrome.runtime.sendMessage({ 
        action: "login_success",
        token: message.access_token 
      }).catch(() => {
        // Ignore if no listeners
      });
      
      sendResponse({ success: true });
    });
    
    return true;
  }
});

// Listen for web navigation to detect OAuth callback
chrome.webNavigation.onCompleted.addListener((details) => {
  // Check if this is our OAuth callback URL
  if (details.url && details.url.includes('localhost:8080/auth/callback')) {
    console.log('🔗 OAuth callback detected:', details.url);
    
    // The callback page will send a message with the token
    // We just log it here for debugging
  }
});

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('🎉 GitHub DM System installed!');
    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html')
    });
  } else if (details.reason === 'update') {
    console.log('🔄 GitHub DM System updated to version', chrome.runtime.getManifest().version);
  }
});

// Keep service worker alive
chrome.runtime.onStartup.addListener(() => {
  console.log('🚀 Browser started - GitHub DM System service worker active');
});

