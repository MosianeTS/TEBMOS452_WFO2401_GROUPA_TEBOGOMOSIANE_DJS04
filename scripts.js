
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
import './components/book-preview.js'; 

let page = 1;
let matches = books;

/**
 * Appends a subset of books to a given document fragment.
 *
 * @param {Array<Object>} books - The array of book objects to be appended.
 * @param {DocumentFragment} fragment - The document fragment to append the books to.
 * @param {number} [start=0] - The starting index of the subset of books to append.
 * @param {number} [end=BOOKS_PER_PAGE] - The ending index of the subset of books to append.
 */

function appendBooksToFragment(books, fragment, start = 0, end = BOOKS_PER_PAGE) {
    for (const book of books.slice(start, end)) {
        const element = document.createElement('book-preview');
        element.setAttribute('image', book.image);
        element.setAttribute('title', book.title);
        element.setAttribute('author', authors[book.author]);
        element.setAttribute('data-preview', book.id);
        fragment.appendChild(element);
    }
}


/**
 * Updates the book list displayed on the page.
 *
 * This function creates a document fragment, appends the matching books to it,
 * and then appends the fragment to the list items container in the DOM.
 */
function updateBookList() {
    const fragment = document.createDocumentFragment();
    appendBooksToFragment(matches, fragment);
    document.querySelector('[data-list-items]').appendChild(fragment);
}



/**
 * Creates a document fragment containing option elements for a dropdown menu.
 *
 * @param {Object} data - An object containing key-value pairs where the key is the option value and the value is the option text.
 * @param {string} firstOptionText - The text for the first option element, which has a value of 'any'.
 * @returns {DocumentFragment} A document fragment containing the generated option elements.
 */

function createDropdownOptions(data, firstOptionText) {
    const fragment = document.createDocumentFragment();
    
    // Create and append the first default option
    const firstOption = document.createElement('option');
    firstOption.value = 'any';
    firstOption.innerText = firstOptionText;
    fragment.appendChild(firstOption);

    // Create and append option elements for each entry in the data object
    for (const [id, name] of Object.entries(data)) {
        const option = document.createElement('option');
        option.value = id;
        option.innerText = name;
        fragment.appendChild(option);
    }

    return fragment;
}


/**
 * Initializes the dropdown menus for genres and authors.
 *
 * This function selects the dropdown elements for genres and authors in the DOM
 * and appends the created dropdown options to them.
 */
function initializeDropdowns() {
    document.querySelector('[data-search-genres]').appendChild(createDropdownOptions(genres, 'All Genres'));
    document.querySelector('[data-search-authors]').appendChild(createDropdownOptions(authors, 'All Authors'));
}

/**
 * Sets the theme of the application based on the user's preferred color scheme.
 *
 * This function checks the user's preferred color scheme using the `window.matchMedia` API.
 * It sets the theme to 'night' or 'day' and updates the CSS variables accordingly.
 */
function setTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.querySelector('[data-settings-theme]').value = 'night';
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.querySelector('[data-settings-theme]').value = 'day';
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
}


/**
 * Updates the "Show more" button based on the remaining number of books.
 *
 * This function calculates the number of remaining books to be displayed and updates
 * the text and disabled state of the "Show more" button accordingly.
 */
function updateShowMoreButton() {
    const remaining = matches.length - (page * BOOKS_PER_PAGE);
    document.querySelector('[data-list-button]').innerText = `Show more (${remaining})`;
    document.querySelector('[data-list-button]').disabled = remaining <= 0;
}

/**
 * Closes an overlay dialog.
 *
 * @param {string} selector - The CSS selector for the overlay element to be closed.
 */
function closeOverlay(selector) {
    document.querySelector(selector).open = false;
}

/**
 * Opens an overlay dialog and optionally focuses a specific element within the overlay.
 *
 * @param {string} selector - The CSS selector for the overlay element to be opened.
 * @param {string} [focusSelector=null] - The CSS selector for the element to be focused within the overlay, if provided.
 */

function openOverlay(selector, focusSelector = null) {
    document.querySelector(selector).open = true;
    if (focusSelector) {
        document.querySelector(focusSelector).focus();
    }
}


/**
 * Handles the settings form submission to change the theme.
 *
 * This function prevents the default form submission, retrieves the form data,
 * updates the theme based on the selected value, and then closes the settings overlay.
 *
 * @param {Event} event - The event object representing the form submission event.
 */
function handleSettingsFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }

    closeOverlay('[data-settings-overlay]');
}

/**
 * Handles the search form submission to filter and display books.
 *
 * This function prevents the default form submission, retrieves the form data,
 * applies the filters to the books array, updates the displayed book list, and
 * closes the search overlay.
 *
 * @param {Event} event - The event object representing the form submission event.
 */

function handleSearchFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);

    matches = books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;

        return genreMatch && titleMatch && authorMatch;
    });

    page = 1;
    document.querySelector('[data-list-message]').classList.toggle('list__message_show', matches.length < 1);
    document.querySelector('[data-list-items]').innerHTML = '';
    updateBookList();
    updateShowMoreButton();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeOverlay('[data-search-overlay]');
}


/**
 * Handles the click event for the "Show More" button.
 * Appends the next set of books to the document fragment and updates the page counter.
 * @function handleShowMoreButtonClick
 * @global
 * @returns {void}
 */
function handleShowMoreButtonClick() {
    const fragment = document.createDocumentFragment();
   
    appendBooksToFragment(matches, fragment, page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE);
    
    document.querySelector('[data-list-items]').appendChild(fragment);
    
    page += 1;
    
    updateShowMoreButton();
}

/**
 * Handles the click event on preview elements.
 * Updates the preview section with details of the selected book.
 * @function handlePreviewClick
 * @global
 * @param {Event} event - The click event
 * @returns {void}
 */

function handlePreviewClick(event) {
    // Retrieve the path of the clicked element
    const pathArray = Array.from(event.composedPath());
    // Find the preview element in the path
    const previewElement = pathArray.find(node => node?.dataset?.preview);

    if (previewElement) {
        // Retrieve the book object based on the preview ID
        const book = books.find(book => book.id === previewElement.dataset.preview);
        if (book) {
            // Update the preview section with book details
            document.querySelector('[data-list-active]').open = true;
            document.querySelector('[data-list-blur]').src = book.image;
            document.querySelector('[data-list-image]').src = book.image;
            document.querySelector('[data-list-title]').innerText = book.title;
            document.querySelector('[data-list-subtitle]').innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
            document.querySelector('[data-list-description]').innerText = book.description;
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const startingFragment = document.createDocumentFragment();
    appendBooksToFragment(matches, startingFragment);
    document.querySelector('[data-list-items]').appendChild(startingFragment);

    initializeDropdowns();
    setTheme();
    updateShowMoreButton();

    document.querySelector('[data-search-cancel]').addEventListener('click', () => closeOverlay('[data-search-overlay]'));
    document.querySelector('[data-settings-cancel]').addEventListener('click', () => closeOverlay('[data-settings-overlay]'));
    document.querySelector('[data-header-search]').addEventListener('click', () => openOverlay('[data-search-overlay]', '[data-search-title]'));
    document.querySelector('[data-header-settings]').addEventListener('click', () => openOverlay('[data-settings-overlay]'));
    document.querySelector('[data-list-close]').addEventListener('click', () => closeOverlay('[data-list-active]'));

    document.querySelector('[data-settings-form]').addEventListener('submit', handleSettingsFormSubmit);
    document.querySelector('[data-search-form]').addEventListener('submit', handleSearchFormSubmit);
    document.querySelector('[data-list-button]').addEventListener('click', handleShowMoreButtonClick);
    document.querySelector('[data-list-items]').addEventListener('click', handlePreviewClick);
});

