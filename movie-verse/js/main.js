// MovieVerse - Main Module
import { initializeNavigation } from './modules/navigation.js';
import { initializeHome } from './modules/home.js';
import { initializeShows } from './modules/shows.js';
import { initializeFavorites } from './modules/favorites.js';
import { initializeContact } from './modules/contact.js';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation on all pages
    initializeNavigation();

    // Determine which page we're on and initialize accordingly
    const page = document.body.getAttribute('data-page') || getCurrentPage();

    switch (page) {
        case 'home':
            initializeHome();
            break;
        case 'shows':
            initializeShows();
            break;
        case 'favorites':
            initializeFavorites();
            break;
        case 'contact':
            initializeContact();
            break;
        default:
            // Detect page from URL
            const path = window.location.pathname;
            if (path.includes('shows.html')) {
                initializeShows();
            } else if (path.includes('favorites.html')) {
                initializeFavorites();
            } else if (path.includes('contact.html')) {
                initializeContact();
            } else {
                initializeHome();
            }
    }
});

/**
 * Determine current page from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('shows.html')) return 'shows';
    if (path.includes('favorites.html')) return 'favorites';
    if (path.includes('contact.html')) return 'contact';
    if (path.includes('about.html')) return 'about';
    return 'home';
}