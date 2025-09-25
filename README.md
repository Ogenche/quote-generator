# 💡 Random Quote Generator

A sleek and interactive web application that displays random inspirational quotes. Users can discover new quotes, learn about the authors, and share their favorite quotes on social media. This project was built with vanilla HTML, CSS, and JavaScript, focusing on clean code, modern web APIs, and a great user experience.

**[View Live Demo Here](https://ogenche.github.io/quote-generator/)**

![Screenshots of the Random Quote Generator App]

![alt text](image.png)

---

## ✨ Features

This application is packed with features designed to provide a rich and seamless user experience:

- **Dynamic Quote Loading:** Quotes are fetched asynchronously from an external `quotes.json` file, keeping the data separate from the application logic.
- **Random Quote Display:** Click the "New Quote" button to display a random quote from the collection.
- **Copy to Clipboard:** Easily copy the current quote and author to your clipboard with a single click. Visual feedback is provided upon a successful copy.
- **Tweet a Quote:** Share the inspiration! The "Tweet" button opens a new Twitter window with the quote pre-populated and ready to be shared.
- **Interactive Author Information:**
  - Click on an author's name to open a detailed modal popup.
  - The modal displays a short biography, the author's title (e.g., "Philosopher," "President"), and their lifespan.
  - The author's name in the modal is a direct link to their Wikipedia page for further reading.
  - Includes clickable country flags that link to the respective country's Wikipedia page. Handles multiple nationalities.
- **Persistent State:** The application uses `localStorage` to remember the last quote you viewed, so when you return to the page, you'll pick up right where you left off.
- **Responsive Design:** The layout is fully responsive and looks great on all devices, from mobile phones to desktop computers.
- **User Feedback:** The application provides clear loading states when fetching quotes and displays friendly error messages if the data fails to load.

---

## 🛠️ Built With

This project relies on the fundamentals of web development and utilizes modern browser features.

- **HTML5:** For the structure and content of the application.
- **CSS3:** For all styling, including responsive design using Flexbox and media queries.
- **Vanilla JavaScript (ES6+):** For all application logic, including:
  - `fetch()` API for asynchronous data loading.
  - `async/await` syntax for cleaner asynchronous code.
  - DOM manipulation to dynamically update content.
  - `localStorage` API for session persistence.
  - `navigator.clipboard` API for copy functionality.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You just need a modern web browser.

### Installation

1.  Clone the repository to your local machine:
    ```sh
    git clone [https://github.com/Ogenche/quote-generator.git](https://github.com/Ogenche/quote-generator.git)
    ```
2.  Navigate to the project directory:
    ```sh
    cd quote-generator
    ```
3.  Open the `index.html` file in your browser to run the application.

---

## 使い方 (How to Use)

Using the application is straightforward:

1.  Upon loading, a random quote (or your last viewed quote) is displayed.
2.  Click **New Quote** to see another random quote.
3.  Click **Copy** to save the quote to your clipboard.
4.  Click **Tweet** to share the quote on Twitter.
5.  Click the **author's name** to learn more about them in a popup window.
