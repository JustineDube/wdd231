/**
 * Favorites Module - Handles favorite shows display and management
 */

const STORAGE_KEY = 'movieverse_favorites';

let favorites = [];

export function initializeFavorites() {
    // Load favorites from local storage
    loadFavorites();

    // Display favorites
    displayFavorites();

    // Initialize modal
    initializeModal();
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
 * Display favorite shows
 */
function displayFavorites() {
    const container = document.getElementById('favoritesGrid');

    if (!container) return;

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No favorites yet! <a href="shows.html">Browse shows</a> and add your favorites.</p>
            </div>
        `;
        return;
    }

    // Generate HTML for favorite shows
    const favoritesHTML = favorites.map(show => createFavoriteCard(show)).join('');
    container.innerHTML = favoritesHTML;

    // Add click listeners to favorite cards
    document.querySelectorAll('.show-card').forEach(card => {
        card.addEventListener('click', () => {
            const showId = card.getAttribute('data-show-id');
            const show = favorites.find(s => s.id === parseInt(showId));
            if (show) {
                openModal(show);
            }
        });
    });
}

/**
 * Create favorite show card template
 */
function createFavoriteCard(show) {
    const image = show.image?.medium || 'images/no-image.jpg';
    const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
    const genres = show.genres.slice(0, 2).join(', ') || 'Unspecified';
    const premiere = show.premiered || 'N/A';

    return `
        <div class="show-card favorite" data-show-id="${show.id}">
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
 * Initialize modal dialog
 */
function initializeModal() {
    const modal = document.getElementById('showModal');
    const closeBtn = document.getElementById('closeModal');
    const removeBtn = document.getElementById('removeFavoritesBtn');

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

    if (removeBtn) {
        removeBtn.addEventListener('click', removeFromFavorites);
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

    const removeBtn = document.getElementById('removeFavoritesBtn');
    if (removeBtn) {
        removeBtn.setAttribute('data-show-id', show.id);
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
 * Remove show from favorites
 */
function removeFromFavorites() {
    const showId = parseInt(document.getElementById('removeFavoritesBtn').getAttribute('data-show-id'));
    
    favorites = favorites.filter(fav => fav.id !== showId);
    
    // Save to local storage
    saveFavorites();

    // Refresh display
    displayFavorites();

    closeModal();
}