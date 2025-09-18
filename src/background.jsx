// Background/service worker - keep this file free of DOM APIs
// Fix common issues: correct event name and use chrome.scripting
chrome.action.onClicked.addListener((tab) => {
  try {
    // Use chrome.scripting.executeScript (not chrome.tabs.scripting.executeScripting)
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["src/content.jsx"],
      },
      (injectionResults) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to inject content script:",
            chrome.runtime.lastError
          );
        } else {
          console.log("Content script injected", injectionResults);
        }
      }
    );
  } catch (err) {
    console.error("Error in background onClicked handler:", err);
  }
});
