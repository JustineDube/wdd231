/**
 * Shows Module - Handles shows display, filtering, sorting, and favorites
 */

const API_URL = 'https://api.tvmaze.com/shows';
const STORAGE_KEY = 'movieverse_favorites';

let allShows = [];
let filteredShows = [];
let favorites = [];

export async function initializeShows() {
    // Load favorites from local storage
    loadFavorites();

    // Fetch and display shows
    await displayShows();

    // Initialize filter and sort controls
    initializeControls();

    // Initialize modal
    initializeModal();
}

/**
 * Fetch shows from TVMaze API
 */
async function fetchShows() {
    const container = document.getElementById('showsGrid');
    
    try {
        container.innerHTML = '<div class="loading">Loading shows...</div>';

        // Fetch first two pages to get 30+ shows
        const page0 = await fetch(`${API_URL}?page=0`);
        const page1 = await fetch(`${API_URL}?page=1`);

        if (!page0.ok || !page1.ok) {
            throw new Error('Failed to fetch shows');
        }

        const shows0 = await page0.json();
        const shows1 = await page1.json();

        // Combine and take first 15 shows
        allShows = [...shows0, ...shows1].slice(0, 15);
        filteredShows = [...allShows];

        return allShows;

    } catch (error) {
        console.error('Error fetching shows:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Unable to load shows. Please try again later.</p>
            </div>
        `;
        return [];
    }
}

/**
 * Display shows in grid
 */
async function displayShows() {
    const shows = await fetchShows();
    const container = document.getElementById('showsGrid');

    if (shows.length === 0) return;

    // Generate HTML for shows
    const showsHTML = shows.map(show => createShowCard(show)).join('');
    container.innerHTML = showsHTML;

    // Add click listeners to show cards
    document.querySelectorAll('.show-card').forEach(card => {
        card.addEventListener('click', () => {
            const showId = card.getAttribute('data-show-id');
            const show = allShows.find(s => s.id === parseInt(showId));
            if (show) {
                openModal(show);
            }
        });
    });
}

/**
 * Create show card template
 */
function createShowCard(show) {
    const image = show.image?.medium || 'images/no-image.jpg';
    const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
    const genres = show.genres.slice(0, 2).join(', ') || 'Unspecified';
    const premiere = show.premiered || 'N/A';
    const isFavorite = favorites.some(fav => fav.id === show.id);
    const favoriteClass = isFavorite ? 'favorite' : '';

    return `
        <div class="show-card ${favoriteClass}" data-show-id="${show.id}">
            <div class="show-image">
                <img src="${image}" alt="${show.name}" loading="lazy">
            </div>
            <div class="show-info">
                <h3>${show.name}</h3>
                <div class="show-meta">
                    <div class="show-rating">⭐ ${rating}/10</div>
                    <div class="show-meta">Premiered: ${premiere}</div>
                </div>
                <div class="show-genres">${genres}</div>
                <button class="view-btn">View Details</button>
            </div>
        </div>
    `;
}

/**
 * Initialize filter and sort controls
 */
function initializeControls() {
    const genreFilter = document.getElementById('genreFilter');
    const sortBy = document.getElementById('sortBy');
    const resetBtn = document.getElementById('resetFilters');

    if (genreFilter) {
        genreFilter.addEventListener('change', applyFiltersAndSort);
    }

    if (sortBy) {
        sortBy.addEventListener('change', applyFiltersAndSort);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

/**
 * Apply filters and sorting
 */
function applyFiltersAndSort() {
    const genre = document.getElementById('genreFilter')?.value || '';
    const sortBy = document.getElementById('sortBy')?.value || 'name';

    // Filter by genre
    if (genre) {
        filteredShows = allShows.filter(show => 
            show.genres.includes(genre)
        );
    } else {
        filteredShows = [...allShows];
    }

    // Sort shows
    switch (sortBy) {
        case 'name':
            filteredShows.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            filteredShows.sort((a, b) => {
                const ratingA = a.rating?.average || 0;
                const ratingB = b.rating?.average || 0;
                return ratingB - ratingA;
            });
            break;
        case 'premiered':
            filteredShows.sort((a, b) => {
                const dateA = new Date(a.premiered || '1900-01-01');
                const dateB = new Date(b.premiered || '1900-01-01');
                return dateB - dateA;
            });
            break;
    }

    // Re-render shows
    renderFilteredShows();
}

/**
 * Render filtered shows
 */
function renderFilteredShows() {
    const container = document.getElementById('showsGrid');
    
    if (filteredShows.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No shows found matching your criteria.</p></div>';
        return;
    }

    const showsHTML = filteredShows.map(show => createShowCard(show)).join('');
    container.innerHTML = showsHTML;

    // Re-attach event listeners
    document.querySelectorAll('.show-card').forEach(card => {
        card.addEventListener('click', () => {
            const showId = card.getAttribute('data-show-id');
            const show = allShows.find(s => s.id === parseInt(showId));
            if (show) {
                openModal(show);
            }
        });
    });
}

/**
 * Reset filters
 */
function resetFilters() {
    document.getElementById('genreFilter').value = '';
    document.getElementById('sortBy').value = 'name';
    filteredShows = [...allShows];
    renderFilteredShows();
}

/**
 * Initialize modal dialog
 */
function initializeModal() {
    const modal = document.getElementById('showModal');
    const closeBtn = document.getElementById('closeModal');
    const addToFavBtn = document.getElementById('addToFavoritesBtn');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    if (addToFavBtn) {
        addToFavBtn.addEventListener('click', addToFavorites);
    }
}

/**
 * Open modal with show details
 */
function openModal(show) {
    const modal = document.getElementById('showModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) return;

    const image = show.image?.medium || '';
    const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
    const genres = show.genres.join(', ') || 'Not specified';
    const summary = show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'No summary available';
    const network = show.network?.name || 'Not available';
    const premiered = show.premiered || 'N/A';

    const isFavorite = favorites.some(fav => fav.id === show.id);
    const btnText = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
    const btnClass = isFavorite ? 'remove' : '';

    modalBody.innerHTML = `
        ${image ? `<img src="${image}" alt="${show.name}" class="modal-image" loading="lazy">` : ''}
        <h2>${show.name}</h2>
        <p><strong>Rating:</strong> ${rating} / 10</p>
        <p><strong>Genres:</strong> ${genres}</p>
        <p><strong>Network:</strong> ${network}</p>
        <p><strong>Premiered:</strong> ${premiered}</p>
        <p><strong>Status:</strong> ${show.status || 'Unknown'}</p>
        <p><strong>Summary:</strong></p>
        <p>${summary}</p>
    `;

    const addBtn = document.getElementById('addToFavoritesBtn');
    if (addBtn) {
        addBtn.textContent = btnText;
        addBtn.className = `modal-button ${btnClass}`;
        addBtn.setAttribute('data-show-id', show.id);
    }

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('showModal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Add or remove show from favorites
 */
function addToFavorites() {
    const showId = parseInt(document.getElementById('addToFavoritesBtn').getAttribute('data-show-id'));
    const show = allShows.find(s => s.id === showId);

    if (!show) return;

    const isFavorite = favorites.some(fav => fav.id === showId);

    if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== showId);
    } else {
        favorites.push(show);
    }

    // Save to local storage
    saveFavorites();

    // Update UI
    updateFavoriteButtons();
    displayShows();

    closeModal();
}

/**
 * Load favorites from local storage
 */
function loadFavorites() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        favorites = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading favorites:', error);
        favorites = [];
    }
}

/**
 * Save favorites to local storage
 */
function saveFavorites() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites:', error);
    }
}

/**
 * Update favorite button states
 */
function updateFavoriteButtons() {
    const cards = document.querySelectorAll('.show-card');
    cards.forEach(card => {
        const showId = parseInt(card.getAttribute('data-show-id'));
        const isFavorite = favorites.some(fav => fav.id === showId);
        
        if (isFavorite) {
            card.classList.add('favorite');
        } else {
            card.classList.remove('favorite');
        }
    });
}