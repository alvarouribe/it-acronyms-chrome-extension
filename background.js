chrome.storage.local.get('acronyms', (result) => {
  const acronyms = result.acronyms;

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getAcronyms') {
      sendResponse({ acronyms }); // Send acronyms to content script
    }
  });
});
