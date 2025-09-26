/**
 * @file Manages the functionality of the Random Quote Generator application.
 * @description This script fetches quotes, displays them, and handles all user interactions 
 * including theme toggling, favoriting, history, sharing, and multi-language support.
 */

// ===================================================================================
//  DOM Element References
// ===================================================================================

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');
const prevQuoteBtn = document.getElementById('prev-quote-btn');
const copyBtn = document.getElementById('copy-btn');
const tweetBtn = document.getElementById('tweet-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const themeToggle = document.getElementById('theme-toggle');
const langToggle = document.getElementById('lang-toggle');
const favoritesListBtn = document.getElementById('favorites-list-btn');
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
//  Application State & Translations
// ===================================================================================

let quotes = [];
let currentQuote = {};
let quoteHistory = [];
let favoriteQuotes = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
let currentFavoritesModal = null;
let currentLang = localStorage.getItem('language') || 'en';
const supportedLangs = ['en', 'sw'];

/** Centralized object for all UI text translations. Easy to add new languages here. */
const uiTranslations = {
    en: {
        mainTitle: "Random Quotes",
        loading: "Loading quotes...",
        prevQuote: "Previous",
        newQuote: "New Quote",
        copied: "Copied!",
        copyTitle: "Copy Quote",
        tweetTitle: "Tweet Quote",
        addFavTitle: "Add to Favorites",
        removeFavTitle: "Remove from Favorites",
        showFavTitle: "Show Favorites",
        themeTitle: "Toggle Theme",
        langTitle: "Change Language",
        favoritesModalTitle: "Favorite Quotes",
        noFavorites: "You have no favorite quotes yet. Click the heart icon to add one!",
        remove: "Remove"
    },
    sw: {
        mainTitle: "Nukuu Nasibu",
        loading: "Inapakia nukuu...",
        prevQuote: "Iliyopita",
        newQuote: "Nukuu Mpya",
        copied: "Imenakiliwa!",
        copyTitle: "Nakili Nukuu",
        tweetTitle: "Tuma Nukuu Twitter",
        addFavTitle: "Ongeza kwa Vipendwa",
        removeFavTitle: "Ondoa kutoka kwa Vipendwa",
        showFavTitle: "Onyesha Vipendwa",
        themeTitle: "Badilisha Mandhari",
        langTitle: "Badilisha Lugha",
        favoritesModalTitle: "Nukuu Pendwa",
        noFavorites: "Huna nukuu zozote pendwa bado. Bofya ikoni ya moyo ili kuongeza!",
        remove: "Ondoa"
    }
};

// ===================================================================================
//  Core Application Logic
// ===================================================================================

async function initializeApp() {
    setLoadingState(true);
    try {
        const response = await fetch('quotes.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        quotes = await response.json();

        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        
        // Set initial language and display first quote
        await applyLanguage();
        getNewQuote(true); // Pass true for initial load
        updatePrevButtonState();

    } catch (error) {
        console.error("Could not fetch quotes:", error);
        displayError("Sorry, we couldn't load any quotes. Please try again later.");
    } finally {
        setLoadingState(false);
    }
}

function getNewQuote(isInitialLoad = false) {
    if (quotes.length === 0) return;
    
    if (!isInitialLoad && currentQuote.quote) {
        quoteHistory.push(currentQuote);
        if (quoteHistory.length > 5) quoteHistory.shift();
    }

    let newQuote;
    do {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        newQuote = quotes[randomIndex];
    } while (quotes.length > 1 && newQuote.quote.en === (currentQuote.quote && currentQuote.quote.en));
    
    currentQuote = newQuote;
    
    quoteText.classList.add('fade-out');
    setTimeout(() => {
        displayQuote();
        quoteText.classList.remove('fade-out');
    }, 400);

    updatePrevButtonState();
}

function getPreviousQuote() {
    if (quoteHistory.length === 0) return;
    currentQuote = quoteHistory.pop();
    quoteText.classList.add('fade-out');
    setTimeout(displayQuote, 400);
    updatePrevButtonState();
}

function displayQuote() {
    if (!currentQuote || !currentQuote.quote) return;
    quoteText.innerText = `"${currentQuote.quote[currentLang]}"`;
    quoteAuthor.innerHTML = `<span id="author-name-span">- ${currentQuote.author}</span>`;
    document.getElementById('author-name-span').addEventListener('click', openAuthorModal);
    updateFavoriteButton();
    quoteText.classList.remove('fade-out');
}

// ===================================================================================
//  Language Functionality
// ===================================================================================

function switchLanguage() {
    const currentIndex = supportedLangs.indexOf(currentLang);
    const nextIndex = (currentIndex + 1) % supportedLangs.length;
    currentLang = supportedLangs[nextIndex];
    localStorage.setItem('language', currentLang);
    applyLanguage();
}

function applyLanguage() {
    // Update all static text with data-translate-key attribute
    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (uiTranslations[currentLang][key]) {
            el.innerText = uiTranslations[currentLang][key];
        }
    });

    // Update titles/tooltips
    copyBtn.title = uiTranslations[currentLang].copyTitle;
    tweetBtn.title = uiTranslations[currentLang].tweetTitle;
    favoritesListBtn.title = uiTranslations[currentLang].showFavTitle;
    themeToggle.title = uiTranslations[currentLang].themeTitle;
    langToggle.title = uiTranslations[currentLang].langTitle;

    // Re-display the current quote in the new language
    displayQuote();
}

// ===================================================================================
//  Actions (Copy, Tweet, Favorites)
// ===================================================================================

function copyQuote() {
    const textToCopy = `"${currentQuote.quote[currentLang]}" - ${currentQuote.author}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalContent = copyBtn.innerHTML;
        copyBtn.innerHTML = uiTranslations[currentLang].copied;
        setTimeout(() => { copyBtn.innerHTML = originalContent; }, 2000);
    }).catch(err => console.error("Failed to copy text: ", err));
}

function tweetQuote() {
    const textToTweet = `"${currentQuote.quote[currentLang]}" - ${currentQuote.author}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textToTweet)}`;
    window.open(twitterUrl, '_blank');
}

function toggleFavorite() {
    // A favorite is now identified by the quote's English text (as a unique ID) AND the language it was saved in.
    const index = favoriteQuotes.findIndex(q => q.quote.en === currentQuote.quote.en && q.savedInLang === currentLang);
    
    if (index > -1) {
        // If it exists for the current language, remove it.
        favoriteQuotes.splice(index, 1);
    } else {
        // If it doesn't exist, add it with the current language recorded.
        const newFavorite = { ...currentQuote, savedInLang: currentLang };
        favoriteQuotes.push(newFavorite);
    }
    
    localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
    updateFavoriteButton();
}

function updateFavoriteButton() {
    // Check if the current quote is favorited IN THE CURRENT LANGUAGE.
    const isFavorited = favoriteQuotes.some(q => q.quote.en === currentQuote.quote.en && q.savedInLang === currentLang);
    
    if (isFavorited) {
        favoriteBtn.classList.add('favorited');
        favoriteBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        favoriteBtn.title = uiTranslations[currentLang].removeFavTitle;
    } else {
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        favoriteBtn.title = uiTranslations[currentLang].addFavTitle;
    }
}

// ===================================================================================
//  Modal Functionality (Author & Favorites)
// ===================================================================================

function openAuthorModal() {
    const info = currentQuote.authorInfo;
    if (!info) return;

    modalAuthorName.innerHTML = `<a href="${info.wikiUrl}" target="_blank" rel="noopener noreferrer">${info.name}</a>`;
    modalAuthorTitle.innerText = info.title[currentLang];
    modalAuthorLifespan.innerText = info.lifespan;
    modalAuthorBio.innerText = info.bio[currentLang];

    modalFlagsContainer.innerHTML = '';
    info.countries.forEach(country => {
        const flagLink = document.createElement('a');
        flagLink.href = country.wikiUrl;
        flagLink.target = '_blank';
        flagLink.rel = 'noopener noreferrer';
        flagLink.title = country.name;
        flagLink.innerHTML = `<img src="https://flagcdn.com/w40/${country.code}.png" alt="Flag of ${country.name}">`;
        modalFlagsContainer.appendChild(flagLink);
    });

    modalOverlay.classList.add('visible');
    authorModal.classList.add('visible');
}

function showFavoritesModal() {
    const modal = document.createElement('div');
    modal.className = 'favorites-modal';
    
    let favoritesHTML = `<button class="fav-modal-close-btn" aria-label="Close modal">&times;</button><h2><i class="fa-solid fa-star"></i> ${uiTranslations[currentLang].favoritesModalTitle}</h2>`;
    if (favoriteQuotes.length > 0) {
        favoritesHTML += '<ul>';
        favoriteQuotes.forEach((q, index) => {
            // Display the quote in the language it was saved in. Default to 'en' for old data.
            const savedLang = q.savedInLang || 'en'; 
            let quoteContent = '';

            if (typeof q.quote === 'object' && q.quote !== null) {
                quoteContent = q.quote[savedLang] || q.quote['en'];
            } else if (typeof q.quote === 'string') {
                quoteContent = q.quote;
            }

            favoritesHTML += `<li>
                <p>"${quoteContent}"</p>
                <strong>- ${q.author}</strong>
                <button class="remove-favorite-btn" data-index="${index}">${uiTranslations[currentLang].remove}</button>
            </li>`;
        });
        favoritesHTML += '</ul>';
    } else {
        favoritesHTML += `<p style="margin-top: 1rem;">${uiTranslations[currentLang].noFavorites}</p>`;
    }
    
    modal.innerHTML = favoritesHTML;
    document.body.appendChild(modal);
    currentFavoritesModal = modal;

    setTimeout(() => {
        modalOverlay.classList.add('visible');
        modal.classList.add('visible');
    }, 10);

    modal.querySelector('.fav-modal-close-btn').addEventListener('click', closeFavoritesModal);
    modal.querySelectorAll('.remove-favorite-btn').forEach(btn => btn.addEventListener('click', handleRemoveFavorite));
}

function handleRemoveFavorite(e) {
    const indexToRemove = parseInt(e.target.dataset.index, 10);
    favoriteQuotes.splice(indexToRemove, 1);
    localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteQuotes));
    closeFavoritesModal();
    showFavoritesModal(); 
    updateFavoriteButton(); // Update the main heart icon in case the removed quote was the current one
}

function closeAuthorModal() {
    modalOverlay.classList.remove('visible');
    authorModal.classList.remove('visible');
}

function closeFavoritesModal() {
    if (currentFavoritesModal) {
        modalOverlay.classList.remove('visible');
        currentFavoritesModal.classList.remove('visible');
        setTimeout(() => {
            currentFavoritesModal.remove();
            currentFavoritesModal = null;
        }, 300);
    }
}

// ===================================================================================
//  UI Helper Functions
// ===================================================================================

function setLoadingState(isLoading) {
    const buttons = [newQuoteBtn, prevQuoteBtn, copyBtn, tweetBtn];
    buttons.forEach(btn => btn.disabled = isLoading);
    if(isLoading) {
        newQuoteBtn.innerText = uiTranslations[currentLang].loading;
    } else {
        newQuoteBtn.innerText = uiTranslations[currentLang].newQuote;
    }
}

function updatePrevButtonState() {
    prevQuoteBtn.disabled = quoteHistory.length === 0;
}

function displayError(message) {
    quoteText.style.display = 'none';
    quoteAuthor.style.display = 'none';
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// ===================================================================================
//  Event Listeners
// ===================================================================================

newQuoteBtn.addEventListener('click', () => getNewQuote(false));
prevQuoteBtn.addEventListener('click', getPreviousQuote);
copyBtn.addEventListener('click', copyQuote);
tweetBtn.addEventListener('click', tweetQuote);
favoriteBtn.addEventListener('click', toggleFavorite);
themeToggle.addEventListener('click', toggleTheme);
langToggle.addEventListener('click', switchLanguage);
favoritesListBtn.addEventListener('click', showFavoritesModal);
modalCloseBtn.addEventListener('click', closeAuthorModal);

modalOverlay.addEventListener('click', () => {
    closeAuthorModal();
    closeFavoritesModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAuthorModal();
        closeFavoritesModal();
    }
});

// ===================================================================================
//  Application Initialization
// ===================================================================================

initializeApp();

