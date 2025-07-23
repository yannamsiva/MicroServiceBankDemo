// Authentication JavaScript for Digital Banking System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize forms
    initializeLoginForm();
    initializeRegisterForm();
});

function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateLoginForm()) {
            return;
        }

        const formData = new FormData(loginForm);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            rememberMe: formData.get('rememberMe') === 'on'
        };

        try {
            Utils.showSpinner('loginBtn', 'loginBtnText');
            
            // Real API call
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });
            if (!response.ok) {
                let errorText = '';
                try {
                    errorText = await response.text();
                } catch (err) {
                    errorText = '[Could not read error body]';
                }
                console.error('Login failed:', response.status, errorText);
                Utils.showAlert(`Login failed. Status: ${response.status}. Message: ${errorText || 'No message.'}`, 'danger');
                return;
            }
            const data = await response.json();
            localStorage.setItem('authToken', data.token || data.jwt); // adjust as needed
            localStorage.setItem('user', JSON.stringify(data.user)); // adjust as needed
            // Clear cache for new users except demo@example.com
            if (data.user && data.user.email && data.user.email !== 'demo@example.com') {
                localStorage.removeItem('recentTransfers');
                localStorage.removeItem('userAccounts');
                // Add more keys here if needed
            }
            
            Utils.showAlert('Login successful! Redirecting to dashboard...', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
            
        } catch (error) {
            console.error('Login error:', error);
            Utils.showAlert('Login error: ' + error.message, 'danger');
        } finally {
            Utils.hideSpinner('loginBtn', 'loginBtnText');
        }
    });
}

function initializeRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateRegisterForm()) {
            return;
        }

        const formData = new FormData(registerForm);
        const registerData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phoneNumber: formData.get('phone'),
            dateOfBirth: formData.get('dateOfBirth'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
            address: formData.get('address') // if present
        };

        try {
            Utils.showSpinner('registerBtn', 'registerBtnText');
            
            // Real API call
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });
            if (!response.ok) throw new Error('Registration failed');
            const data = await response.json();
            // Clear cache for new users except demo@example.com
            if (registerData.email && registerData.email !== 'demo@example.com') {
                localStorage.removeItem('recentTransfers');
                localStorage.removeItem('userAccounts');
                // Add more keys here if needed
            }
            
            Utils.showAlert('Registration successful! Please log in.', 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            
        } catch (error) {
            Utils.showAlert('Registration failed. Please try again.', 'danger');
        } finally {
            Utils.hideSpinner('registerBtn', 'registerBtnText');
        }
    });

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = Utils.getPasswordStrength(this.value);
            updatePasswordStrengthIndicator(strength);
        });
    }

    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (password && confirmPassword) {
                if (password === confirmPassword) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            }
        });
    }
}

function validateLoginForm() {
    const form = document.getElementById('loginForm');
    const email = form.querySelector('#email');
    const password = form.querySelector('#password');
    
    let isValid = true;
    
    // Reset validation states
    [email, password].forEach(field => {
        field.classList.remove('is-invalid');
    });
    
    // Validate email
    if (!email.value.trim()) {
        email.classList.add('is-invalid');
        isValid = false;
    } else if (!Utils.validateEmail(email.value)) {
        email.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate password
    if (!password.value.trim()) {
        password.classList.add('is-invalid');
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm() {
    const form = document.getElementById('registerForm');
    const fields = {
        firstName: form.querySelector('#firstName'),
        lastName: form.querySelector('#lastName'),
        email: form.querySelector('#email'),
        phone: form.querySelector('#phone'),
        dateOfBirth: form.querySelector('#dateOfBirth'),
        password: form.querySelector('#password'),
        confirmPassword: form.querySelector('#confirmPassword'),
        terms: form.querySelector('#terms')
    };
    
    let isValid = true;
    
    // Reset validation states
    Object.values(fields).forEach(field => {
        if (field) {
            field.classList.remove('is-invalid');
        }
    });
    
    // Validate required fields
    Object.entries(fields).forEach(([name, field]) => {
        if (!field) return;
        
        if (name === 'terms') {
            if (!field.checked) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        } else if (name === 'email') {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (!Utils.validateEmail(field.value)) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        } else if (name === 'password') {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (!Utils.validatePassword(field.value)) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        } else if (name === 'confirmPassword') {
            const password = fields.password.value;
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (field.value !== password) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        } else {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function updatePasswordStrengthIndicator(strength) {
    // Remove existing strength indicator
    const existingIndicator = document.querySelector('.password-strength');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create new strength indicator
    const passwordField = document.getElementById('password');
    if (!passwordField) return;
    
    const indicator = document.createElement('div');
    indicator.className = `password-strength mt-1 small text-${strength.class}`;
    indicator.innerHTML = `
        <i class="fas fa-${strength.level === 'weak' ? 'times' : strength.level === 'medium' ? 'minus' : 'check'} me-1"></i>
        Password strength: ${strength.level}
    `;
    
    passwordField.parentNode.appendChild(indicator);
} 