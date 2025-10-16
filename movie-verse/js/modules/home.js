/**
 * Home Module - Handles featured show display
 */

const API_URL = 'https://api.tvmaze.com/shows';

export async function initializeHome() {
    await displayFeaturedShow();
}

/**
 * Fetch and display a random featured show
 */
async function displayFeaturedShow() {
    const container = document.getElementById('featuredShow');
    
    if (!container) return;

    try {
        // Fetch shows from TVMaze API
        const response = await fetch(`${API_URL}?page=0`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const shows = await response.json();

        // Get a random show from the list
        const randomIndex = Math.floor(Math.random() * shows.length);
        const show = shows[randomIndex];

        // Display the featured show
        container.innerHTML = displayFeaturedTemplate(show);

    } catch (error) {
        console.error('Error fetching featured show:', error);
        container.innerHTML = `
            <div class="error-message">
                <p>Unable to load featured show. Please try again later.</p>
            </div>
        `;
    }
}

/**
 * Template for featured show display
 */
function displayFeaturedTemplate(show) {
    const image = show.image?.medium || 'images/no-image.jpg';
    const rating = show.rating?.average ? show.rating.average.toFixed(1) : 'N/A';
    const genres = show.genres.length > 0 ? show.genres.join(', ') : 'Not specified';
    const premiere = show.premiered || 'N/A';
    const summary = show.summary ? 
        show.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : 
        'No summary available';

    return `
        <div class="featured-image">
            <img src="${image}" alt="${show.name}" loading="lazy">
        </div>
        <div class="featured-info">
            <h3>${show.name}</h3>
            <div class="featured-rating">
                <strong>Rating:</strong> ${rating} / 10
            </div>
            <p><strong>Genres:</strong> ${genres}</p>
            <p><strong>Premiered:</strong> ${premiere}</p>
            <p><strong>Network:</strong> ${show.network?.name || 'Not available'}</p>
            <p><strong>Summary:</strong></p>
            <p>${summary}</p>
        </div>
    `;
}