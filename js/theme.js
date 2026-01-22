'use strict';

// ===== Theme and Mode Management =====

// Load saved preferences
const savedTheme = localStorage.getItem('theme') || 'blue';
const savedMode = localStorage.getItem('mode') || 'light';

document.documentElement.setAttribute('data-theme', savedTheme);
document.documentElement.setAttribute('data-mode', savedMode);

// Update active selectors
document.getElementById('theme-select').value = savedTheme;
document.querySelector(`.mode-btn[data-mode="${savedMode}"]`)?.classList.add('active');

/**
 * Change the color theme
 * @param {string} theme - Theme name (blue, gray, cyan, etc.)
 */
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // Redraw flowcharts with new colors
    setTimeout(redrawCurrentFlowchart, 100);
}

/**
 * Change the display mode (light/dark)
 * @param {string} mode - Mode name (light or dark)
 */
function changeMode(mode) {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);

    // Update buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.mode-btn[data-mode="${mode}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-checked', 'true');
    }

    // Update aria-checked for other buttons
    document.querySelectorAll(`.mode-btn:not([data-mode="${mode}"])`).forEach(btn => {
        btn.setAttribute('aria-checked', 'false');
    });

    // Redraw flowcharts with new colors
    setTimeout(redrawCurrentFlowchart, 100);
}

/**
 * Show/hide navigation controls based on mouse/touch position
 * Works on both desktop and mobile devices
 */
function handleNavigationVisibility() {
    const navControls = document.querySelector('.navigation-controls');
    const threshold = 150; // Distance from bottom in pixels to trigger visibility
    let hideTimer = null;
    let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    function showNavigation() {
        if (navControls) {
            navControls.classList.add('visible');
        }
        // Clear any existing hide timer
        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    function hideNavigation() {
        // Set a timer to hide after mouse/touch leaves the area
        hideTimer = setTimeout(() => {
            if (navControls) {
                navControls.classList.remove('visible');
            }
        }, isTouchDevice ? 3000 : 500); // Longer delay on touch devices
    }

    // Track mouse movement (desktop)
    document.addEventListener('mousemove', (e) => {
        if (isTouchDevice) return; // Skip on touch devices
        const distanceFromBottom = window.innerHeight - e.clientY;

        if (distanceFromBottom <= threshold) {
            showNavigation();
        } else if (distanceFromBottom > threshold + 100) {
            // Only hide if mouse is well away from the threshold
            hideNavigation();
        }
    });

    // Touch handling for mobile devices
    if (isTouchDevice) {
        // Show navigation on any tap on the bottom third of the screen
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const distanceFromBottom = window.innerHeight - touch.clientY;

            if (distanceFromBottom <= window.innerHeight / 3) {
                showNavigation();
                hideNavigation(); // Auto-hide after delay
            }
        });

        // Also show on any tap on the navigation itself
        if (navControls) {
            navControls.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                showNavigation();
            });
        }
    }

    // Keep navigation visible when mouse is over it (desktop)
    if (navControls && !isTouchDevice) {
        navControls.addEventListener('mouseenter', () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
                hideTimer = null;
            }
            showNavigation();
        });

        navControls.addEventListener('mouseleave', () => {
            hideNavigation();
        });
    }

    // Show navigation briefly on page load
    showNavigation();
    setTimeout(hideNavigation, isTouchDevice ? 3000 : 2000);
}

// Initialize navigation visibility handler when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleNavigationVisibility);
} else {
    handleNavigationVisibility();
}

// Add click handler to toggle navigation panel
let hideTimeout;
const navControls = document.querySelector('.navigation-controls');

navControls.addEventListener('click', function() {
    this.classList.add('visible');
    
    // Auto-hide after 3 seconds of inactivity
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        navControls.classList.remove('visible');
    }, 3000);
});

// Keep visible during interaction
navControls.addEventListener('touchstart', function() {
    clearTimeout(hideTimeout);
});
