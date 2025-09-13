// 1. Create an array of quote objects
const quotes = [
    {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        quote: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        quote: "Strive not to be a success, but rather to be of value.",
        author: "Albert Einstein"
    },
    {
        quote: "The mind is everything. What you think you become.",
        author: "Buddha"
    },
    {
        quote: "An unexamined life is not worth living.",
        author: "Socrates"
    },
    {
        quote: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky"
    }
];

// 2. Get references to the HTML elements
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

// 3. Create a function to get a random quote
function getNewQuote() {
    // Get a random number between 0 and the length of the quotes array
    const randomIndex = Math.floor(Math.random() * quotes.length);

    // Get the quote object at the random index
    const randomQuote = quotes[randomIndex];

    // Update the HTML with the new quote and author
    quoteText.innerText = randomQuote.quote;
    quoteAuthor.innerText = "- " + randomQuote.author;
}

// 4. Add an event listener to the button
// This will call the getNewQuote function every time the button is clicked
newQuoteBtn.addEventListener('click', getNewQuote);