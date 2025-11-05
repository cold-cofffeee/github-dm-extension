// GitHub DM System - Popup Script
// Handles UI interactions, authentication, and message sending

console.log('🚀 GitHub DM System - Popup script loaded');

// DOM Elements
let configSection, loginSection, messageSection;
let clientIdInput, saveConfigBtn;
let loginBtn, logoutBtn, sendBtn;
let repositoryInput, messageTitleInput, messageBodyInput;
let recipientNameSpan, resultMessage, statusDot, statusText;
let charCountSpan;

// State
let currentUsername = null;
let accessToken = null;
let isAuthenticated = false;

// Initialize the popup
document.addEventListener('DOMContentLoaded', function() {
  console.log('📄 DOM loaded, initializing popup...');
  
  // Get DOM elements
  configSection = document.getElementById('configSection');
  loginSection = document.getElementById('loginSection');
  messageSection = document.getElementById('messageSection');
  
  clientIdInput = document.getElementById('clientId');
  saveConfigBtn = document.getElementById('saveConfig');
  
  loginBtn = document.getElementById('loginBtn');
  logoutBtn = document.getElementById('logoutBtn');
  sendBtn = document.getElementById('sendBtn');
  
  repositoryInput = document.getElementById('repository');
  messageTitleInput = document.getElementById('messageTitle');
  messageBodyInput = document.getElementById('messageBody');
  
  recipientNameSpan = document.getElementById('recipientName');
  resultMessage = document.getElementById('resultMessage');
  statusDot = document.querySelector('.status-dot');
  statusText = document.querySelector('.status-text');
  charCountSpan = document.getElementById('charCount');
  
  // Set up event listeners
  setupEventListeners();
  
  // Check authentication status and configuration
  checkConfiguration();
});

// Set up event listeners
function setupEventListeners() {
  // Configuration
  if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', saveConfiguration);
  }
  
  // Authentication
  if (loginBtn) {
    loginBtn.addEventListener('click', initiateLogin);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Manual token entry
  const saveTokenBtn = document.getElementById('saveTokenBtn');
  if (saveTokenBtn) {
    saveTokenBtn.addEventListener('click', handleManualToken);
  }
  
  // Message form
  const messageForm = document.getElementById('messageForm');
  if (messageForm) {
    messageForm.addEventListener('submit', handleSendMessage);
  }
  
  // Character counter
  if (messageBodyInput && charCountSpan) {
    messageBodyInput.addEventListener('input', function() {
      charCountSpan.textContent = messageBodyInput.value.length;
    });
  }
}

// Check configuration and show appropriate section
function checkConfiguration() {
  chrome.storage.local.get([
    'github_client_id', 
    'github_access_token', 
    'targetUsername',
    'auth_timestamp'
  ], function(result) {
    // Auto-configure Client ID if missing (from .env)
    let hasClientId = !!result.github_client_id;
    
    if (!hasClientId) {
      console.log('� Auto-configuring Client ID from .env...');
      const defaultClientId = 'Ov23livhrOHsgDv5ZtXl';
      chrome.storage.local.set({ github_client_id: defaultClientId }, function() {
        console.log('✅ Client ID auto-configured');
      });
      hasClientId = true;
    }
    
    console.log('📦 Stored data:', { 
      hasClientId: hasClientId,
      hasToken: !!result.github_access_token,
      targetUsername: result.targetUsername
    });
    
    const hasToken = !!result.github_access_token;
    currentUsername = result.targetUsername;
    
    if (!hasClientId) {
      // Show configuration section
      isAuthenticated = false;
      updateStatus('error', 'Not authenticated');
      showSection('config');
    } else if (!hasToken) {
      // Show login section
      isAuthenticated = false;
      updateStatus('error', 'Not authenticated');
      showSection('login');
    } else {
      // Has both client ID and token - user is authenticated!
      accessToken = result.github_access_token;
      isAuthenticated = true;
      updateStatus('connected', 'Connected');
      showSection('message');
      
      console.log('✅ User authenticated with token:', accessToken.substring(0, 10) + '...');
      
      // Set recipient name
      if (currentUsername && recipientNameSpan) {
        recipientNameSpan.textContent = `@${currentUsername}`;
      }
      
      // Pre-fill repository with suggestion
      if (repositoryInput && currentUsername) {
        repositoryInput.placeholder = `e.g., ${currentUsername}/inbox or ${currentUsername}/messages`;
      }
    }
  });
}

// Show specific section
function showSection(section) {
  // Hide all sections
  if (configSection) configSection.style.display = 'none';
  if (loginSection) loginSection.style.display = 'none';
  if (messageSection) messageSection.style.display = 'none';
  
  // Show requested section
  switch(section) {
    case 'config':
      if (configSection) configSection.style.display = 'block';
      updateStatus('disconnected', 'Not configured');
      break;
    case 'login':
      if (loginSection) loginSection.style.display = 'block';
      updateStatus('warning', 'Not authenticated');
      break;
    case 'message':
      if (messageSection) messageSection.style.display = 'block';
      updateStatus('connected', 'Connected');
      break;
  }
}

// Update status indicator
function updateStatus(type, text) {
  if (statusDot) {
    statusDot.className = 'status-dot';
    statusDot.classList.add(`status-${type}`);
  }
  if (statusText) {
    statusText.textContent = text;
  }
}

// Save GitHub OAuth configuration
function saveConfiguration() {
  const clientId = clientIdInput.value.trim();
  
  if (!clientId) {
    showResult('error', '❌ Please enter a valid Client ID');
    return;
  }
  
  console.log('💾 Saving configuration...');
  
  chrome.storage.local.set({ 
    github_client_id: clientId 
  }, function() {
    console.log('✅ Configuration saved');
    showResult('success', '✅ Configuration saved! Please login now.');
    
    setTimeout(() => {
      showSection('login');
    }, 1500);
  });
}

// Initiate GitHub OAuth login
function initiateLogin() {
  console.log('🔐 Initiating login...');
  
  loginBtn.disabled = true;
  loginBtn.textContent = 'Opening GitHub...';
  
  // Send message to background script to start auth
  chrome.runtime.sendMessage({ 
    action: "start_auth" 
  }, function(response) {
    setTimeout(() => {
      loginBtn.disabled = false;
      loginBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
        Login with GitHub
      `;
    }, 2000);
  });
}

// Handle logout
function handleLogout() {
  console.log('🚪 Logging out...');
  
  chrome.runtime.sendMessage({ 
    action: "logout" 
  }, function(response) {
    if (response && response.success) {
      console.log('✅ Logged out successfully');
      accessToken = null;
      isAuthenticated = false;
      showSection('login');
    }
  });
}

// Handle manual token entry
function handleManualToken() {
  const manualTokenInput = document.getElementById('manualToken');
  const token = manualTokenInput.value.trim();
  
  if (!token) {
    showResult('error', '❌ Please enter a valid access token');
    return;
  }
  
  if (!token.startsWith('ghp_') && !token.startsWith('gho_')) {
    showResult('error', '❌ Invalid token format. GitHub tokens start with "ghp_" or "gho_"');
    return;
  }
  
  console.log('💾 Saving manually entered token...');
  
  // Get current client_id or use default
  chrome.storage.local.get(['github_client_id'], function(result) {
    const clientId = result.github_client_id || 'Ov23livhrOHsgDv5ZtXl';
    
    // Store the token AND client ID together
    chrome.storage.local.set({ 
      github_access_token: token,
      github_client_id: clientId,
      auth_timestamp: Date.now()
    }, function() {
      console.log('✅ Token and Client ID saved successfully');
      accessToken = token;
      isAuthenticated = true;
      updateStatus('connected', 'Connected');
      
      // Clear the input
      manualTokenInput.value = '';
      
      // Show success message
      showResult('success', '✅ Token saved successfully! You can now send messages.');
      
      // Switch to message section immediately
      setTimeout(() => {
        showSection('message');
        
        // Update recipient if we have a username
        chrome.storage.local.get(['targetUsername'], function(result) {
          if (result.targetUsername && recipientNameSpan) {
            currentUsername = result.targetUsername;
            recipientNameSpan.textContent = `@${result.targetUsername}`;
          }
        });
      }, 1500);
    });
  });
}

// Handle message sending
function handleSendMessage(e) {
  e.preventDefault();
  
  let repository = repositoryInput.value.trim();
  const title = messageTitleInput.value.trim();
  const body = messageBodyInput.value.trim();
  
  // Validation
  if (!currentUsername) {
    showResult('error', '❌ No recipient selected. Please click the DM button on a GitHub profile first.');
    return;
  }
  
  if (!repository) {
    showResult('error', '❌ Please enter a repository name');
    return;
  }
  
  // Extract repository name from GitHub URL if user pasted a URL
  if (repository.includes('github.com/')) {
    const urlMatch = repository.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (urlMatch) {
      repository = urlMatch[1];
      repositoryInput.value = repository;
    }
  }
  
  // Auto-format repository if user didn't include username
  if (!repository.includes('/')) {
    repository = `${currentUsername}/${repository}`;
    repositoryInput.value = repository;
  }
  
  if (!title) {
    showResult('error', '❌ Please enter a message subject');
    return;
  }
  
  if (!body) {
    showResult('error', '❌ Please enter your message');
    return;
  }
  
  if (!accessToken) {
    showResult('error', '❌ Not authenticated. Please login again.');
    showSection('login');
    return;
  }
  
  // Disable send button
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  
  console.log(`📤 Sending message to ${currentUsername}/${repository}...`);
  
  // Send message
  chrome.runtime.sendMessage({
    action: "send_dm",
    username: currentUsername,
    repository: repository,
    messageTitle: title,
    messageBody: body,
    accessToken: accessToken
  }, function(response) {
    sendBtn.disabled = false;
    sendBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1.705 8.005a.75.75 0 0 1 .834.656 5.5 5.5 0 0 0 9.592 2.97l-1.204-1.204a.25.25 0 0 1 .177-.427h3.646a.25.25 0 0 1 .25.25v3.646a.25.25 0 0 1-.427.177l-1.38-1.38A7.002 7.002 0 0 1 1.05 8.84a.75.75 0 0 1 .656-.834ZM8 2.5a5.487 5.487 0 0 0-4.131 1.869l1.204 1.204A.25.25 0 0 1 4.896 6H1.25A.25.25 0 0 1 1 5.75V2.104a.25.25 0 0 1 .427-.177l1.38 1.38A7.002 7.002 0 0 1 14.95 7.16a.75.75 0 0 1-1.49.178A5.5 5.5 0 0 0 8 2.5Z"></path>
      </svg>
      Send Message
    `;
    
    if (response && response.success) {
      console.log('✅ Message sent successfully:', response.issueUrl);
      showResult('success', `✅ Message sent successfully! <a href="${response.issueUrl}" target="_blank">View issue #${response.issueNumber}</a>`);
      
      // Clear form
      messageTitleInput.value = '';
      messageBodyInput.value = '';
      charCountSpan.textContent = '0';
    } else {
      console.error('❌ Failed to send message:', response ? response.error : 'Unknown error');
      const errorMsg = response && response.error ? response.error : 'Failed to send message';
      showResult('error', `❌ ${errorMsg}`);
      
      // If authentication error, show login screen
      if (errorMsg.includes('authentication') || errorMsg.includes('Unauthorized') || errorMsg.includes('401')) {
        setTimeout(() => {
          showSection('login');
        }, 2000);
      }
    }
  });
}

// Show result message
function showResult(type, message) {
  if (!resultMessage) return;
  
  resultMessage.className = `result-message ${type}`;
  resultMessage.innerHTML = message;
  resultMessage.style.display = 'block';
  
  // Auto-hide after 5 seconds for success messages
  if (type === 'success') {
    setTimeout(() => {
      resultMessage.style.display = 'none';
    }, 5000);
  }
}

// Listen for login success messages from background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('📨 Popup received message:', message);
  
  if (message.action === "login_success") {
    console.log('✅ Login successful, updating UI...');
    accessToken = message.token;
    isAuthenticated = true;
    checkConfiguration(); // This will show the message section
  }
});

