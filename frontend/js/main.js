// Main JavaScript file for Digital Banking System

// Global variables
let currentUser = null;
let isAuthenticated = false;

// Utility functions
const Utils = {
    // Show alert message
    showAlert: function(message, type = 'info', duration = 5000) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const alertId = 'alert-' + Date.now();
        const alertHtml = `
            <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertContainer.insertAdjacentHTML('beforeend', alertHtml);
        
        // Auto remove after duration
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.remove();
            }
        }, duration);
    },

    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate password strength
    validatePassword: function(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    },

    // Get password strength indicator
    getPasswordStrength: function(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        if (strength <= 2) return { level: 'weak', class: 'danger' };
        if (strength <= 3) return { level: 'medium', class: 'warning' };
        return { level: 'strong', class: 'success' };
    },

    // Show loading spinner
    showSpinner: function(buttonId, textId) {
        const button = document.getElementById(buttonId);
        const text = document.getElementById(textId);
        const spinner = document.getElementById(buttonId.replace('Btn', 'Spinner'));
        
        if (button && text && spinner) {
            button.disabled = true;
            text.style.display = 'none';
            spinner.classList.remove('d-none');
        }
    },

    // Hide loading spinner
    hideSpinner: function(buttonId, textId) {
        const button = document.getElementById(buttonId);
        const text = document.getElementById(textId);
        const spinner = document.getElementById(buttonId.replace('Btn', 'Spinner'));
        
        if (button && text && spinner) {
            button.disabled = false;
            text.style.display = 'inline';
            spinner.classList.add('d-none');
        }
    },

    // Toggle password visibility
    togglePasswordVisibility: function(inputId, toggleId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(toggleId);
        
        if (input && toggle) {
            toggle.addEventListener('click', function() {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            });
        }
    },

    // Check authentication status
    checkAuth: function() {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            isAuthenticated = true;
            currentUser = JSON.parse(user);
            return true;
        }
        return false;
    },

    // Redirect to login if not authenticated
    requireAuth: function() {
        if (!this.checkAuth()) {
            window.location.href = '/login';
            return false;
        }
        return true;
    },

    // Logout function
    logout: function() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        isAuthenticated = false;
        currentUser = null;
        window.location.href = '/login';
    },

    // API request helper
    apiRequest: async function(url, options = {}) {
        const token = localStorage.getItem('authToken');
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
};

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize password toggles
    const passwordToggles = document.querySelectorAll('[id*="togglePassword"]');
    passwordToggles.forEach(toggle => {
        const inputId = toggle.getAttribute('data-target') || toggle.id.replace('toggle', '');
        Utils.togglePasswordVisibility(inputId, toggle.id);
    });

    // Initialize logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            Utils.logout();
        });
    }

    // Check authentication on protected pages
    const protectedPages = ['/dashboard', '/transactions', '/transfer', '/profile'];
    const currentPath = window.location.pathname;
    
    if (protectedPages.includes(currentPath)) {
        if (!Utils.requireAuth()) {
            return;
        }
    }

    // Initialize navigation active states
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
});

// Export for use in other modules
window.Utils = Utils;
window.currentUser = currentUser;
window.isAuthenticated = isAuthenticated; 