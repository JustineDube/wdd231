/**
 * Form Result Module - Displays submitted form data using URL Search Params
 */

document.addEventListener('DOMContentLoaded', () => {
    displayFormData();
});

/**
 * Display form data from URL search parameters
 */
function displayFormData() {
    const resultContent = document.getElementById('resultContent');
    
    if (!resultContent) return;

    // Get URL search parameters
    const searchParams = new URLSearchParams(window.location.search);

    // Check if there are any parameters
    if (searchParams.size === 0) {
        resultContent.innerHTML = '<p>No form data received.</p>';
        return;
    }

    // Create display for form data
    let html = '';

    // Define field labels for better readability
    const fieldLabels = {
        'name': 'Name',
        'email': 'Email Address',
        'subject': 'Subject',
        'showSuggestion': 'Show Suggestion',
        'message': 'Message',
        'subscribe': 'Newsletter Subscription'
    };

    // Iterate through search params
    for (const [key, value] of searchParams) {
        const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
        const displayValue = value || 'Not provided';
        
        // Handle subscription checkbox
        let finalValue = displayValue;
        if (key === 'subscribe') {
            finalValue = displayValue === 'yes' ? 'Yes, subscribe me' : 'No';
        }

        html += `
            <div class="result-item">
                <strong>${label}:</strong>
                <span>${escapeHtml(finalValue)}</span>
            </div>
        `;
    }

    resultContent.innerHTML = html;
}

/**
 * Escape HTML special characters for security
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}