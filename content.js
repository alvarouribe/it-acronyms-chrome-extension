// Load acronyms data from the JSON file
const acronyms = browser.storage.local.get('acronyms');

// Function to check for acronyms and display tooltips
function checkAcronyms(text) {
  // Split text into words
  const words = text.split(/\s+/);
  // Iterate over each word
  words.forEach(word => {
    // Check if word is an acronym in the data
    if (acronyms[word]) {
      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.classList.add('acronym-tooltip');
      tooltip.textContent = acronyms[word];
      // Find the word element on the page
      const wordElement = document.querySelector(`span:contains(${word})`);
      if (wordElement) {
        // Position and display tooltip
        tooltip.style.left = `${wordElement.offsetLeft + wordElement.offsetWidth}px`;
        tooltip.style.top = `${wordElement.offsetTop}px`;
        document.body.appendChild(tooltip);
        // Remove tooltip after a delay
        setTimeout(() => tooltip.remove(), 2000);
      }
    }
  });
}

// Listen for text changes on the page
document.addEventListener('DOMContentLoaded', () => {
  checkAcronyms(document.body.textContent);
});