/**
 * @file Manages the functionality of a random quote generator application.
 * @description This script fetches quotes from a JSON file, displays them, and provides
 * functionality for copying, tweeting, and viewing author information in a modal.
 * It also persists the last viewed quote using localStorage.
 */

// ===================================================================================
//  DOM Element References
// ===================================================================================

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const copyBtn = document.getElementById('copy-btn');
const tweetBtn = document.getElementById('tweet-btn');
const errorMessage = document.getElementById('error-message');

// Modal Elements
const modalOverlay = document.getElementById('modal-overlay');
const authorModal = document.getElementById('author-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalAuthorName = document.getElementById('modal-author-name');
const modalAuthorTitle = document.getElementById('modal-author-title');
const modalFlagsContainer = document.getElementById('modal-flags-container');
const modalAuthorLifespan = document.getElementById('modal-author-lifespan');
const modalAuthorBio = document.getElementById('modal-author-bio');

// ===================================================================================
//  Application State
// ===================================================================================

/** @type {Array<Object>} - An array to hold all quote objects fetched from the JSON file. */
let quotes = [];

/** @type {Object} - The quote object currently being displayed in the UI. */
let currentQuote = {};

// ===================================================================================
//  Core Application Logic
// ===================================================================================

/**
 * Initializes the application. Fetches quotes from the JSON file, handles the UI 
 * loading state, and displays the first quote (either from localStorage or a new random one).
 */
async function initializeApp() {
    setLoadingState(true);
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quotes = await response.json();
        
        // Attempt to load the last viewed quote from browser storage.
        const savedQuote = localStorage.getItem('lastQuote');
        if (savedQuote) {
            currentQuote = JSON.parse(savedQuote);
            displayQuote();
        } else {
            // If no quote is saved, fetch a new random one.
            getNewQuote();
        }
    } catch (error) {
        console.error("Could not fetch quotes:", error);
        displayError("Sorry, we couldn't load any quotes. Please try again later.");
    } finally {
        setLoadingState(false);
    }
}

/**
 * Selects a new random quote from the `quotes` array and triggers a UI update.
 */
function getNewQuote() {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
    displayQuote();
}

/**
 * Updates the main UI with the `currentQuote` data, makes the author's name
 * clickable, and saves the current quote to localStorage.
 */
function displayQuote() {
    quoteText.innerText = currentQuote.quote;
    quoteAuthor.innerHTML = `<span id="author-name-span">- ${currentQuote.author}</span>`;
    document.getElementById('author-name-span').addEventListener('click', openAuthorModal);
    
    // Persist the current quote to the user's browser storage.
    localStorage.setItem('lastQuote', JSON.stringify(currentQuote));
}

/**
 * Copies the current quote and author to the user's clipboard using the Clipboard API.
 */
function copyQuote() {
    const textToCopy = `"${currentQuote.quote}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerText = "Copied!";
        setTimeout(() => { copyBtn.innerText = "Copy"; }, 1500);
    });
}

/**
 * Opens a new Twitter window with a pre-populated tweet containing the current quote.
 */
function tweetQuote() {
    const textToTweet = `"${currentQuote.quote}" - ${currentQuote.author}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToTweet)}`;
    window.open(twitterUrl, '_blank');
}

// ===================================================================================
//  Modal Functionality
// ===================================================================================

/**
 * Populates the author modal with information from the current quote and makes it visible.
 */
function openAuthorModal() {
    const info = currentQuote.authorInfo;
    if (!info) return; // Exit if the current quote has no author info.

    modalAuthorName.innerHTML = `<a href="${info.wikiUrl}" target="_blank">${info.name}</a>`;
    modalAuthorTitle.innerText = info.title;
    modalAuthorLifespan.innerText = info.lifespan;
    modalAuthorBio.innerText = info.bio;

    // Clear any previous flags and generate new ones.
    modalFlagsContainer.innerHTML = '';
    info.countries.forEach(country => {
        const flagLink = document.createElement('a');
        flagLink.href = country.wikiUrl;
        flagLink.target = '_blank';
        flagLink.title = country.name;

        const flagImg = document.createElement('img');
        flagImg.src = `https://flagcdn.com/w40/${country.code}.png`;
        flagImg.alt = `Flag of ${country.name}`;
        
        flagLink.appendChild(flagImg);
        modalFlagsContainer.appendChild(flagLink);
    });

    modalOverlay.classList.remove('hidden');
    authorModal.classList.remove('hidden');
}

/**
 * Hides the author modal and the background overlay.
 */
function closeAuthorModal() {
    modalOverlay.classList.add('hidden');
    authorModal.classList.add('hidden');
}

// ===================================================================================
//  UI Helper Functions
// ===================================================================================

/**
 * Manages the enabled/disabled state of buttons and button text during data fetching.
 * @param {boolean} isLoading - Indicates if the application is in a loading state.
 */
function setLoadingState(isLoading) {
    newQuoteBtn.disabled = copyBtn.disabled = tweetBtn.disabled = isLoading;
    newQuoteBtn.innerText = isLoading ? "Loading..." : "New Quote";
}

/**
 * Hides the main quote display and shows a user-friendly error message.
 * @param {string} message - The error message to display in the UI.
 */
function displayError(message) {
    quoteText.style.display = 'none';
    quoteAuthor.style.display = 'none';
    errorMessage.innerText = message;
}

// ===================================================================================
//  Event Listeners
// ===================================================================================

// Connects the primary UI buttons to their respective functions.
newQuoteBtn.addEventListener('click', getNewQuote);
copyBtn.addEventListener('click', copyQuote);
tweetBtn.addEventListener('click', tweetQuote);

// Connects the modal's close button and overlay to the close function.
modalCloseBtn.addEventListener('click', closeAuthorModal);
modalOverlay.addEventListener('click', closeAuthorModal);

// ===================================================================================
//  Application Initialization
// ===================================================================================

// Kicks off the entire application process when the script is loaded.
initializeApp();