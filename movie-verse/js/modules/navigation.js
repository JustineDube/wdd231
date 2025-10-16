/**
 * Navigation Module - Handles hamburger menu and wayfinding
 */

export function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // Hamburger menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // Close menu when link clicked
    if (navMenu) {
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Set active nav link based on current page
    setActiveNavLink();
}

/**
 * Set active navigation link based on current page
 */
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname;

    navLinks.forEach(link => {
        // Remove active class from all
        link.classList.remove('active');

        // Add active class to matching link
        const href = link.getAttribute('href');
        if (currentPage.includes(href) || 
            (currentPage.endsWith('/') && href === 'index.html') ||
            (currentPage.includes('index.html') && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}