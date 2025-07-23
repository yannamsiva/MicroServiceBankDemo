// Profile JavaScript for Digital Banking System

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!Utils.requireAuth()) {
        return;
    }

    // Initialize profile page
    initializeProfile();
    loadUserProfile();
    initializeSecuritySettings();
});

function initializeProfile() {
    // Initialize profile form
    initializeProfileForm();
    
    // Initialize password change modal
    initializePasswordChange();
    
    // Initialize photo upload
    initializePhotoUpload();
}

function initializeProfileForm() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateProfileForm()) {
            return;
        }

        const formData = new FormData(profileForm);
        const profileData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phoneNumber: formData.get('phone'), // Send as phoneNumber
            dateOfBirth: formData.get('dateOfBirth'),
            address: formData.get('address')
        };

        try {
            Utils.showSpinner('profileBtn', 'profileBtnText');
            
            // Simulate API call
            await updateProfile(profileData);
            
            Utils.showAlert('Profile updated successfully!', 'success');
            
            // After successful update, reload profile UI
            loadUserProfile();
            
        } catch (error) {
            Utils.showAlert('Failed to update profile. Please try again.', 'danger');
        } finally {
            Utils.hideSpinner('profileBtn', 'profileBtnText');
        }
    });
}

function validateProfileForm() {
    const form = document.getElementById('profileForm');
    const fields = {
        firstName: form.querySelector('#firstName'),
        lastName: form.querySelector('#lastName'),
        email: form.querySelector('#email'),
        phone: form.querySelector('#phone'),
        dateOfBirth: form.querySelector('#dateOfBirth')
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
        
        if (name === 'email') {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else if (!Utils.validateEmail(field.value)) {
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

function initializePasswordChange() {
    const updatePasswordBtn = document.getElementById('updatePassword');
    if (!updatePasswordBtn) return;

    updatePasswordBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        if (!validatePasswordChangeForm()) {
            return;
        }

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        try {
            Utils.showSpinner('updatePassword', 'passwordBtnText');
            
            // Simulate API call
            await changePassword(currentPassword, newPassword);
            
            Utils.showAlert('Password updated successfully!', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('changePasswordForm').reset();
            
        } catch (error) {
            Utils.showAlert('Failed to update password. Please check your current password.', 'danger');
        } finally {
            Utils.hideSpinner('updatePassword', 'passwordBtnText');
        }
    });
}

function validatePasswordChangeForm() {
    const form = document.getElementById('changePasswordForm');
    const fields = {
        currentPassword: form.querySelector('#currentPassword'),
        newPassword: form.querySelector('#newPassword'),
        confirmNewPassword: form.querySelector('#confirmNewPassword')
    };
    
    let isValid = true;
    
    // Reset validation states
    Object.values(fields).forEach(field => {
        if (field) {
            field.classList.remove('is-invalid');
        }
    });
    
    // Validate current password
    if (!fields.currentPassword.value.trim()) {
        fields.currentPassword.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate new password
    if (!fields.newPassword.value.trim()) {
        fields.newPassword.classList.add('is-invalid');
        isValid = false;
    } else if (!Utils.validatePassword(fields.newPassword.value)) {
        fields.newPassword.classList.add('is-invalid');
        isValid = false;
    }
    
    // Validate confirm password
    if (!fields.confirmNewPassword.value.trim()) {
        fields.confirmNewPassword.classList.add('is-invalid');
        isValid = false;
    } else if (fields.confirmNewPassword.value !== fields.newPassword.value) {
        fields.confirmNewPassword.classList.add('is-invalid');
        isValid = false;
    }
    
    return isValid;
}

function initializePhotoUpload() {
    const uploadPhotoBtn = document.getElementById('uploadPhoto');
    const profilePhotoInput = document.getElementById('profilePhoto');
    
    if (!uploadPhotoBtn || !profilePhotoInput) return;

    uploadPhotoBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const file = profilePhotoInput.files[0];
        if (!file) {
            Utils.showAlert('Please select a photo to upload.', 'warning');
            return;
        }

        // Validate file type and size
        if (!validatePhotoFile(file)) {
            return;
        }

        try {
            Utils.showSpinner('uploadPhoto', 'photoBtnText');
            
            // Simulate API call
            await uploadProfilePhoto(file);
            
            Utils.showAlert('Profile photo updated successfully!', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('changePhotoModal'));
            modal.hide();
            
            // Reset form
            profilePhotoInput.value = '';
            
        } catch (error) {
            Utils.showAlert('Failed to upload photo. Please try again.', 'danger');
        } finally {
            Utils.hideSpinner('uploadPhoto', 'photoBtnText');
        }
    });
}

function validatePhotoFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if (!allowedTypes.includes(file.type)) {
        Utils.showAlert('Please select a valid image file (JPG, PNG).', 'danger');
        return false;
    }
    
    if (file.size > maxSize) {
        Utils.showAlert('File size must be less than 5MB.', 'danger');
        return false;
    }
    
    return true;
}

function initializeSecuritySettings() {
    // Initialize security toggles
    const securityToggles = [
        'twoFactorAuth',
        'loginNotifications',
        'transactionAlerts',
        'biometricLogin'
    ];
    
    securityToggles.forEach(toggleId => {
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('change', function() {
                updateSecuritySetting(toggleId, this.checked);
            });
        }
    });
}

function updateSecuritySetting(setting, enabled) {
    // Simulate API call to update security setting
    console.log(`Security setting ${setting} updated to: ${enabled}`);
    
    Utils.showAlert(
        `${setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${enabled ? 'enabled' : 'disabled'}.`,
        'info'
    );
}

function loadUserProfile() {
    // Load user profile data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update profile form with user data
    const fields = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '', // Use phoneNumber from backend
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || ''
    };
    
    Object.entries(fields).forEach(([key, value]) => {
        const field = document.getElementById(key);
        if (field) {
            field.value = value;
        }
    });
    
    // Update user name in navigation
    const userNameElements = document.querySelectorAll('#navbarDropdown');
    userNameElements.forEach(element => {
        element.innerHTML = `<i class="fas fa-user-circle me-1"></i>${user.firstName || 'User'}`;
    });
}

// Simulate API calls
async function updateProfile(profileData) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        throw new Error('User ID not found.');
    }
    console.log('[DEBUG] Sending profile update:', profileData);
    const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
    });
    console.log('[DEBUG] PUT response status:', response.status);
    if (!response.ok) {
        const errorText = await response.text();
        console.error('[DEBUG] PUT error:', errorText);
        throw new Error('Failed to update profile in database.');
    }
    const updatedUser = await response.json();
    console.log('[DEBUG] Updated user from backend:', updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { success: true, message: 'Profile updated successfully' };
}

async function changePassword(currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate password change validation
            if (currentPassword === 'Password123!' && Utils.validatePassword(newPassword)) {
                resolve({
                    success: true,
                    message: 'Password changed successfully'
                });
            } else {
                reject(new Error('Invalid current password or weak new password'));
            }
        }, 1000);
    });
}

async function uploadProfilePhoto(file) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate photo upload
            if (file && file.size > 0) {
                resolve({
                    success: true,
                    message: 'Photo uploaded successfully',
                    photoUrl: URL.createObjectURL(file)
                });
            } else {
                reject(new Error('Failed to upload photo'));
            }
        }, 1500);
    });
}

// Export functions for use in other modules
window.Profile = {
    initializeProfile,
    loadUserProfile,
    updateProfile,
    changePassword,
    uploadProfilePhoto
}; 