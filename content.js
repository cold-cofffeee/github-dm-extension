// GitHub DM System - Content Script
// Adds a "Send DM" button to GitHub user profiles

(function() {
  'use strict';

  let dmButtonAdded = false;
  let currentUsername = null;

  // Extract username from the current GitHub profile page
  function extractUsername() {
    // Try multiple methods to get the username
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    
    // Check if we're on a user profile page
    if (pathParts.length >= 1 && !pathParts[0].includes('.') && pathParts[0] !== 'orgs') {
      // Additional validation - check for profile elements
      const profileAvatar = document.querySelector('img[alt*="@"]');
      const profileName = document.querySelector('[itemprop="additionalName"]');
      
      if (profileAvatar || profileName) {
        return pathParts[0];
      }
    }
    
    return null;
  }

  // Check if we're on a user profile page
  function isProfilePage() {
    const username = extractUsername();
    return username !== null;
  }

  // Create and inject the DM button
  function addDMButton() {
    if (dmButtonAdded || !isProfilePage()) {
      return;
    }

    currentUsername = extractUsername();
    if (!currentUsername) {
      return;
    }

    // Look for the profile actions container (updated for current GitHub UI)
    const actionButtons = document.querySelector('.js-profile-editable-area .d-flex.flex-column.gap-2') 
                       || document.querySelector('.js-profile-editable-area') 
                       || document.querySelector('[data-target="user-profile-frame.profileActions"]')
                       || document.querySelector('.Layout-sidebar .BorderGrid-cell');

    if (actionButtons && !document.getElementById('github-dm-button')) {
      // Create the DM button container
      const dmButtonContainer = document.createElement('div');
      dmButtonContainer.className = 'dm-button-container';
      
      const dmButton = document.createElement('button');
      dmButton.id = 'github-dm-button';
      dmButton.className = 'btn btn-block github-dm-btn';
      dmButton.innerHTML = `
        <svg class="octicon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1.75 1h12.5c.966 0 1.75.784 1.75 1.75v9.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-9.5C0 1.784.784 1 1.75 1ZM1.5 4.196v8.054c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V4.196L8.89 8.247a.75.75 0 0 1-.78 0L1.5 4.196Zm13-.038V2.75a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v1.408l6.5 4.333 6.5-4.333Z"></path>
        </svg>
        Send DM
      `;
      
      dmButton.title = `Send a direct message to @${currentUsername}`;
      
      dmButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log(`DM button clicked for user: ${currentUsername}`);
        
        // Store the username and open the popup
        chrome.storage.local.set({ 
          targetUsername: currentUsername,
          dmButtonClicked: true 
        }, function() {
          // Send message to background script to open popup
          try {
            chrome.runtime.sendMessage({ 
              action: "open_dm_popup",
              username: currentUsername
            }, function(response) {
              if (chrome.runtime.lastError) {
                console.log('Extension context invalid - please refresh the page after reloading the extension');
                alert('Please refresh this page after reloading the extension');
              }
            });
          } catch (error) {
            console.log('Extension context invalid - please refresh the page');
            alert('Please refresh this page after reloading the extension');
          }
        });
      });

      dmButtonContainer.appendChild(dmButton);
      
      // Insert the button into the profile actions area
      if (actionButtons.querySelector('.d-flex.flex-column.gap-2')) {
        actionButtons.querySelector('.d-flex.flex-column.gap-2').prepend(dmButtonContainer);
      } else {
        actionButtons.prepend(dmButtonContainer);
      }
      
      dmButtonAdded = true;
      console.log(`✅ DM button added for user: ${currentUsername}`);
    }
  }

  // Observe DOM changes to detect profile page loads
  function observeProfileChanges() {
    const observer = new MutationObserver(function(mutations) {
      // Check if we need to add/remove the button
      const shouldHaveButton = isProfilePage();
      const hasButton = document.getElementById('github-dm-button') !== null;
      
      if (shouldHaveButton && !hasButton) {
        dmButtonAdded = false;
        addDMButton();
      } else if (!shouldHaveButton && hasButton) {
        const button = document.getElementById('github-dm-button');
        if (button && button.parentElement) {
          button.parentElement.remove();
        }
        dmButtonAdded = false;
        currentUsername = null;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize when DOM is ready
  function init() {
    console.log('🚀 GitHub DM System - Content script loaded');
    
    // Try to add button immediately
    addDMButton();
    
    // Start observing for dynamic content
    observeProfileChanges();
    
    // Re-check on navigation (for SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        dmButtonAdded = false;
        currentUsername = null;
        setTimeout(addDMButton, 500);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  // Start the extension
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
