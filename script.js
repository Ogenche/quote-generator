// --- 1. GETTING HTML ELEMENTS ---
// Getting references to all the interactive elements from our HTML.
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const copyBtn = document.getElementById('copy-btn');
const tweetBtn = document.getElementById('tweet-btn');
const errorMessage = document.getElementById('error-message');

// --- 2. GLOBAL VARIABLES ---
// An array to store all the quotes we fetch from the JSON file.
let quotes = [];
// Variable to store the current quote object being displayed.
let currentQuote = {};

// --- 3. CORE FUNCTIONS ---

/**
 * Fetches quotes from the quotes.json file and initializes the application.
 */
async function initializeApp() {
    // Show a loading state to the user.
    setLoadingState(true);
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) {
            // If the server responded with an error (e.g., 404 Not Found)
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quotes = await response.json();
        // Display the first quote once they are loaded.
        getNewQuote();
    } catch (error) {
        // If anything goes wrong during the fetch process.
        console.error("Could not fetch quotes:", error);
        displayError("Sorry, we couldn't load any quotes. Please check your connection and try again.");
    } finally {
        // This runs whether the fetch succeeded or failed.
        setLoadingState(false);
    }
}

/**
 * Selects a random quote from the `quotes` array and displays it.
 */
function getNewQuote() {
    if (quotes.length === 0) return; // Don't run if there are no quotes.
    
    // Get a random quote object from the array.
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
    
    // Update the HTML to show the new quote.
    quoteText.innerText = currentQuote.quote;
    quoteAuthor.innerText = "- " + currentQuote.author;
}

/**
 * Copies the current quote and author to the user's clipboard.
 */
function copyQuote() {
    const textToCopy = `"${currentQuote.quote}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy);

    // Provide visual feedback to the user.
    copyBtn.innerText = "Copied!";
    setTimeout(() => {
        copyBtn.innerText = "Copy";
    }, 1500);
}

/**
 * Opens a new Twitter window to tweet the current quote.
 */
function tweetQuote() {
    const textToTweet = `"${currentQuote.quote}" - ${currentQuote.author}`;
    // We use encodeURIComponent to make sure the text is safe for a URL.
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToTweet)}`;
    // Open the URL in a new browser tab.
    window.open(twitterUrl, '_blank');
}


// --- 4. HELPER FUNCTIONS ---

/**
 * Manages the UI during loading states (disables/enables buttons).
 * @param {boolean} isLoading - True if loading, false otherwise.
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        newQuoteBtn.disabled = true;
        copyBtn.disabled = true;
        tweetBtn.disabled = true;
        newQuoteBtn.innerText = "Loading...";
    } else {
        newQuoteBtn.disabled = false;
        copyBtn.disabled = false;
        tweetBtn.disabled = false;
        newQuoteBtn.innerText = "New Quote";
    }
}

/**
 * Displays an error message to the user.
 * @param {string} message - The error message to display.
 */
function displayError(message) {
    quoteText.style.display = 'none';
    quoteAuthor.style.display = 'none';
    errorMessage.innerText = message;
}


// --- 5. EVENT LISTENERS ---
// Where we make our buttons interactive.

newQuoteBtn.addEventListener('click', getNewQuote);
copyBtn.addEventListener('click', copyQuote);
tweetBtn.addEventListener('click', tweetQuote);

// --- 6. INITIALIZATION ---
// Starts the entire process when the script first runs.
initializeApp();