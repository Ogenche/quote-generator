// --- 1. GETTING HTML ELEMENTS ---
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

// --- 2. GLOBAL VARIABLES ---
let quotes = [];
let currentQuote = {};

// --- 3. CORE FUNCTIONS ---

async function initializeApp() {
    setLoadingState(true);
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        quotes = await response.json();
        getNewQuote();
    } catch (error) {
        console.error("Could not fetch quotes:", error);
        displayError("Sorry, we couldn't load any quotes.");
    } finally {
        setLoadingState(false);
    }
}

function getNewQuote() {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];
    displayQuote();
}

/**
 * Updates the main quote display with the current quote's data.
 * The author's name is wrapped in a span to make it clickable.
 */
function displayQuote() {
    quoteText.innerText = currentQuote.quote;
    // Make the author name clickable to open the modal
    quoteAuthor.innerHTML = `<span id="author-name-span">- ${currentQuote.author}</span>`;
    document.getElementById('author-name-span').addEventListener('click', openAuthorModal);
}

function copyQuote() {
    const textToCopy = `"${currentQuote.quote}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerText = "Copied!";
        setTimeout(() => { copyBtn.innerText = "Copy"; }, 1500);
    });
}

function tweetQuote() {
    const textToTweet = `"${currentQuote.quote}" - ${currentQuote.author}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToTweet)}`;
    window.open(twitterUrl, '_blank');
}

// --- 4. MODAL FUNCTIONS (New Code) ---

/**
 * Opens and populates the author information modal.
 */
function openAuthorModal() {
    const info = currentQuote.authorInfo;
    if (!info) return; // Do nothing if there's no info

    // Populate the modal with data
    modalAuthorName.innerHTML = `<a href="${info.wikiUrl}" target="_blank">${info.name}</a>`;
    modalAuthorTitle.innerText = info.title;
    modalAuthorLifespan.innerText = info.lifespan;
    modalAuthorBio.innerText = info.bio;

    // Dynamically create flags with links
    modalFlagsContainer.innerHTML = ''; // Clear previous flags
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

    // Show the modal and overlay
    modalOverlay.classList.remove('hidden');
    authorModal.classList.remove('hidden');
}

/**
 * Hides the modal and its overlay.
 */
function closeAuthorModal() {
    modalOverlay.classList.add('hidden');
    authorModal.classList.add('hidden');
}

// --- 5. HELPER FUNCTIONS ---

function setLoadingState(isLoading) {
    newQuoteBtn.disabled = copyBtn.disabled = tweetBtn.disabled = isLoading;
    newQuoteBtn.innerText = isLoading ? "Loading..." : "New Quote";
}

function displayError(message) {
    quoteText.style.display = 'none';
    quoteAuthor.style.display = 'none';
    errorMessage.innerText = message;
}

// --- 6. EVENT LISTENERS ---
newQuoteBtn.addEventListener('click', getNewQuote);
copyBtn.addEventListener('click', copyQuote);
tweetBtn.addEventListener('click', tweetQuote);
modalCloseBtn.addEventListener('click', closeAuthorModal);
modalOverlay.addEventListener('click', closeAuthorModal); // Close modal if overlay is clicked

// --- 7. INITIALIZATION ---
initializeApp();