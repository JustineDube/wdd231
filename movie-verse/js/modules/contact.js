/**
 * Contact Module - Handles contact form submission
 */

export function initializeContact() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * Handle form submission and prepare data for form action page
 */
function handleFormSubmit(e) {
    // Let the form submit naturally to form-result.html
    // The form-result.js file will handle displaying the data
    
    // Optional: Add client-side validation here
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const subject = document.getElementById('subject')?.value;

    if (!name || !email || !subject) {
        e.preventDefault();
        alert('Please fill out all required fields.');
    }
}