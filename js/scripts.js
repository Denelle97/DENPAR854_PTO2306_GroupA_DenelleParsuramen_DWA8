/**
 * Initializes the list of books and their associated data on the page.
 */

import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
// Imports data from './data.js'
  // ...


let page = 1;
let matches = books

const starting = document.createDocumentFragment()

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    starting.appendChild(element)
}

/**
   * Event listener for the form submission in the search overlay.
   * Handles filtering the book list based on search criteria.
   *
   * @param {Event} event - The form submission event.
   */

document.querySelector('[data-list-items]').appendChild(starting)

const genreHtml = document.createDocumentFragment()
const firstGenreElement = document.createElement('option')
firstGenreElement.value = 'any'
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement)

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    genreHtml.appendChild(element)
}

document.querySelector('[data-search-genres]').appendChild(genreHtml)

const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}
document.querySelector('[data-search-authors]').appendChild(authorsHtml)


const themeManager = {
    setThemeBasedOnColorScheme() {
      const settingsTheme = document.querySelector('[data-settings-theme]');
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
      if (prefersDarkMode) {
        this.setTheme('night');
        this.setThemeColors('255, 255, 255', '10, 10, 20');
      } else {
        this.setTheme('day');
        this.setThemeColors('10, 10, 20', '255, 255, 255');
      }
    },
  
    setTheme(theme) {
      document.querySelector('[data-settings-theme]').value = theme;
    },
  
    setThemeColors(colorDark, colorLight) {
      document.documentElement.style.setProperty('--color-dark', colorDark);
      document.documentElement.style.setProperty('--color-light', colorLight);
    },
  };
  
  // Call the method of the themeManager object to set the theme based on the color scheme.
  themeManager.setThemeBasedOnColorScheme();
  

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    /**
   * Event listener for the "Show more" button click.
   * Loads more books and appends them to the book list.
   */
    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    /**
   * Event listener for the book preview click.
   * Displays the details of the selected book.
   *
   * @param {Event} event - The click event.
   */

    document.querySelector('[data-list-items]').appendChild(newItems)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

/**
 * Handles the click event on a list item.
 * @param {Event} event - The click event.
 */
function handleListItemClick(event) {
    const active = findActiveBook(event);
  
    if (active) {
      openDataListActive();
      updateDataListBlur(active.image);
      updateDataListImage(active.image);
      updateDataListTitle(active.title);
      updateDataListSubtitle(active.author, active.published);
      updateDataListDescription(active.description);
    }
  }
  
/**
 * Finds the active book based on the click event.
 * @param {Event} event - The click event.
 * @returns {Object|null} The active book object or null if not found.
 */
  function findActiveBook(event) {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;
  
    for (const node of pathArray) {
      if (active) break;
  
      if (node?.dataset?.preview) {
        let result = null;
  
        for (const singleBook of books) {
          if (result) break;
          if (singleBook.id === node?.dataset?.preview) result = singleBook;
        }
  
        active = result;
      }
    }
  
    return active;
  }

/**
 * Opens the data list active element.
 */
  function openDataListActive() {
    const dataListActive = document.querySelector('[data-list-active]');
    dataListActive.open = true;
  }

/**
 * Updates the data list blur image source.
 * @param {string} image - The image URL.
 */
  function updateDataListBlur(image) {
    const dataListBlur = document.querySelector('[data-list-blur]');
    dataListBlur.src = image;
  }
  
/**
 * Updates the data list image source.
 * @param {string} image - The image URL.
 */
  function updateDataListImage(image) {
    const dataListImage = document.querySelector('[data-list-image]');
    dataListImage.src = image;
  }
  
 /**
 * Updates the data list title text.
 * @param {string} title - The title text.
 */
  function updateDataListTitle(title) {
    const dataListTitle = document.querySelector('[data-list-title]');
    dataListTitle.innerText = title;
  }
  
/**
 * Updates the data list subtitle text.
 * @param {string} author - The author identifier.
 * @param {string} published - The publication date.
 */
  function updateDataListSubtitle(author, published) {
    const dataListSubtitle = document.querySelector('[data-list-subtitle]');
    dataListSubtitle.innerText = `${authors[author]} (${new Date(published).getFullYear()})`;
  }
  
/**
 * Updates the data list description text.
 * @param {string} description - The description text.
 */
  function updateDataListDescription(description) {
    const dataListDescription = document.querySelector('[data-list-description]');
    dataListDescription.innerText = description;
  }
  
  // Adds the click event listener to the list items container.
  document.querySelector('[data-list-items]').addEventListener('click', handleListItemClick);
  

  