// Get acronyms from background script
chrome.runtime.sendMessage({ action: 'getAcronyms' }, (response) => {
  const acronyms = response.acronyms;

  // Function to check for acronyms and display tooltips
  function checkAcronyms(text) {
    // Split text into words, considering punctuation and edge cases
    const words = text.split(/\W+/);

    // Iterate over each word, handling uppercase and potential abbreviations
    words.forEach(word => {
      // Get the base word, removing trailing punctuation
      const baseWord = word.replace(/^[^\w]*(.*)[^\w]*$/, '$1').toUpperCase();

      // Check if base word is an acronym, considering edge cases
      if (
        baseWord.length > 1 &&
        acronyms[baseWord] &&
        !/(?:\.\w|[^a-zA-Z]\w)/.test(word) // Not an abbreviation in sentence
      ) {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.classList.add('acronym-tooltip');
        tooltip.textContent = acronyms[baseWord];

        // Find the word element on the page, handling case-insensitivity
        const wordElement = document.querySelector(`span:contains("${word}")`);

        if (wordElement) {
          // Position and display tooltip
          tooltip.style.left = `${wordElement.offsetLeft + wordElement.offsetWidth}px`;
          tooltip.style.top = `${wordElement.offsetTop}px`;
          document.body.appendChild(tooltip);

          // Remove tooltip after delay, customizable from storage
          const tooltipDuration = getTooltipDuration(); // Retrieve from storage
          setTimeout(() => tooltip.remove(), tooltipDuration);
        }
      }
    });
  }

  // Call checkAcronyms on page load and text changes
  checkAcronyms(document.body.textContent);

  // Optionally, listen for new content and re-run checkAcronyms
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        checkAcronyms(mutation.target.textContent);
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Error handling: Log errors from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.error) {
      console.error("Acronym Tooltip Error:", request.error);
    }
  });

  // Helper function to retrieve tooltip duration from storage
  function getTooltipDuration() {
    chrome.storage.local.get('tooltipDuration', (result) => {
      return result.tooltipDuration || 2000; // Default 2 seconds
    });
  }
});
