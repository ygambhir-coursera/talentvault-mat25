// ===========================================
// PROFILE PAGE FUNCTIONALITY
// User Profile Management and Settings
// ===========================================

// Profile data state
let profileData = {
    name: 'Mark',
    title: 'Full Stack Developer',
    email: 'mark@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Passionate full-stack developer with 5+ years of experience in modern web technologies. Love building innovative solutions that make a difference.',
    experienceLevel: 'Senior (5+ years)',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX Design'],
    preferredRoles: 'Full Stack Developer, Frontend Developer, Technical Lead',
    availability: 'Open to opportunities',
    memberSince: 'Jan 2024',
    profileViews: 156,
    verifiedSkills: 3,
    settings: {
        emailNotifications: true,
        profileVisibility: true,
        jobRecommendations: true,
        skillReminders: false
    }
};

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    console.log('👤 Profile page initialized');
    loadProfileData();
    setupEventListeners();
});

function loadProfileData() {
    // Load data from localStorage if available
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
        profileData = { ...profileData, ...JSON.parse(savedProfile) };
    }
    
    // Update UI with profile data
    updateProfileUI();
}

function updateProfileUI() {
    // Update profile overview
    document.getElementById('profile-name').textContent = profileData.name;
    document.getElementById('profile-title').textContent = profileData.title;
    
    // Update personal information
    document.getElementById('full-name').textContent = profileData.name;
    document.getElementById('email').textContent = profileData.email;
    document.getElementById('phone').textContent = profileData.phone;
    document.getElementById('location').textContent = profileData.location;
    document.getElementById('bio').textContent = profileData.bio;
    
    // Update skills
    const skillsContainer = document.querySelector('.skills-list');
    if (skillsContainer) {
        skillsContainer.innerHTML = profileData.skills.map(skill => 
            `<span class="skill-pill">${skill}</span>`
        ).join('');
    }
    
    // Update settings toggles
    Object.keys(profileData.settings).forEach(setting => {
        const toggle = document.querySelector(`input[type="checkbox"][data-setting="${setting}"]`);
        if (toggle) {
            toggle.checked = profileData.settings[setting];
        }
    });
    
    console.log('✅ Profile UI updated');
}

function setupEventListeners() {
    // Settings toggle listeners
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', function() {
            const setting = this.getAttribute('data-setting');
            if (setting) {
                profileData.settings[setting] = this.checked;
                saveProfileData();
                showNotification(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${this.checked ? 'enabled' : 'disabled'}`, 'info');
            }
        });
    });
}

function saveProfileData() {
    localStorage.setItem('profileData', JSON.stringify(profileData));
    console.log('💾 Profile data saved');
}

function shareProfile() {
    const profileUrl = `${window.location.origin}/pages/profile.html`;
    
    // Create share options modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-share"></i> Share Profile</h3>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <p class="modal-description">Choose how you'd like to share your profile:</p>
                <div class="share-options">
                    <button class="share-option-btn" onclick="copyProfileLink()">
                        <i class="fas fa-link"></i>
                        <div>
                            <strong>Copy Link</strong>
                            <p>Copy profile link to clipboard</p>
                        </div>
                    </button>
                    <button class="share-option-btn" onclick="sendProfileEmail()">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <strong>Send Email</strong>
                            <p>Share via email</p>
                        </div>
                    </button>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal(this)">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

function copyProfileLink() {
    const profileUrl = `${window.location.origin}/pages/profile.html`;
    
    navigator.clipboard.writeText(profileUrl).then(() => {
        showShareNotification();
        // Close modal
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = profileUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showShareNotification();
        // Close modal
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
    });
}

function sendProfileEmail() {
    const profileUrl = `${window.location.origin}/pages/profile.html`;
    const subject = encodeURIComponent(`${profileData.name} - TalentVault Profile`);
    const body = encodeURIComponent(`Hey there!\n\nPlease checkout my TalentVault profile!\n\n${profileUrl}`);
    
    // Open Gmail compose with the profile link
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    
    // Close modal
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

function closeModal(button) {
    const modal = button.closest('.modal');
    modal.classList.remove('show');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

function showShareNotification() {
    const notification = document.createElement('div');
    notification.className = 'clipboard-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Profile link copied to clipboard!</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function editProfile() {
    const modal = createEditModal();
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

function createEditModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Profile</h3>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <form id="edit-profile-form">
                    <div class="form-group">
                        <label for="edit-name">Full Name</label>
                        <input type="text" id="edit-name" value="${profileData.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-title">Job Title</label>
                        <input type="text" id="edit-title" value="${profileData.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-email">Email</label>
                        <input type="email" id="edit-email" value="${profileData.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-phone">Phone</label>
                        <input type="tel" id="edit-phone" value="${profileData.phone}">
                    </div>
                    <div class="form-group">
                        <label for="edit-location">Location</label>
                        <input type="text" id="edit-location" value="${profileData.location}">
                    </div>
                    <div class="form-group">
                        <label for="edit-bio">Bio</label>
                        <textarea id="edit-bio" rows="4">${profileData.bio}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit-skills">Skills (comma-separated)</label>
                        <input type="text" id="edit-skills" value="${profileData.skills.join(', ')}">
                    </div>
                </form>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal(this)">Cancel</button>
                <button class="btn btn-primary" onclick="saveProfile()">Save Changes</button>
            </div>
        </div>
    `;
    
    return modal;
}

function saveProfile() {
    const form = document.getElementById('edit-profile-form');
    const formData = new FormData(form);
    
    // Update profile data
    profileData.name = document.getElementById('edit-name').value;
    profileData.title = document.getElementById('edit-title').value;
    profileData.email = document.getElementById('edit-email').value;
    profileData.phone = document.getElementById('edit-phone').value;
    profileData.location = document.getElementById('edit-location').value;
    profileData.bio = document.getElementById('edit-bio').value;
    profileData.skills = document.getElementById('edit-skills').value
        .split(',').map(skill => skill.trim()).filter(skill => skill);
    
    // Save to localStorage
    saveProfileData();
    
    // Update UI
    updateProfileUI();
    
    // Close modal
    closeModal(document.querySelector('.modal'));
    
    // Show success notification
    showNotification('Profile updated successfully!', 'success');
}

function closeModal(element) {
    const modal = element.closest('.modal');
    modal.classList.remove('show');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

function changeAvatar() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatar = document.querySelector('.profile-avatar');
                avatar.innerHTML = `<img src="${e.target.result}" alt="Profile Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                showNotification('Avatar updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function managePlatform(platform) {
    showNotification(`${platform} platform management coming soon!`, 'info');
}

function connectPlatform(platform) {
    // Simulate platform connection
    const platformItem = document.querySelector(`[onclick="connectPlatform('${platform}')"]`).closest('.platform-item');
    const button = platformItem.querySelector('button');
    
    button.textContent = 'Connecting...';
    button.disabled = true;
    
    setTimeout(() => {
        platformItem.classList.add('connected');
        platformItem.querySelector('i').style.color = 'var(--success)';
        button.textContent = 'Manage';
        button.className = 'btn-small btn-secondary';
        button.disabled = false;
        button.onclick = () => managePlatform(platform);
        
        showNotification(`Successfully connected to ${platform}!`, 'success');
    }, 2000);
}

function changePassword() {
    const modal = createPasswordModal();
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

function createPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Change Password</h3>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <form id="password-form">
                    <div class="form-group">
                        <label for="current-password">Current Password</label>
                        <input type="password" id="current-password" required>
                    </div>
                    <div class="form-group">
                        <label for="new-password">New Password</label>
                        <input type="password" id="new-password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Confirm New Password</label>
                        <input type="password" id="confirm-password" required>
                    </div>
                </form>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal(this)">Cancel</button>
                <button class="btn btn-primary" onclick="updatePassword()">Update Password</button>
            </div>
        </div>
    `;
    
    return modal;
}

function updatePassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters long!', 'error');
        return;
    }
    
    // Simulate password update
    setTimeout(() => {
        closeModal(document.querySelector('.modal'));
        showNotification('Password updated successfully!', 'success');
    }, 1000);
}

function setup2FA() {
    showNotification('Two-factor authentication setup coming soon!', 'info');
}

function exportData() {
    const data = {
        profile: profileData,
        exportDate: new Date().toISOString(),
        platform: 'TalentVault'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `talentvault-profile-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Profile data exported successfully!', 'success');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            // Simulate account deletion
            setTimeout(() => {
                localStorage.clear();
                showNotification('Account deleted successfully. Redirecting...', 'info');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            }, 1000);
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type];
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to notification container or create one
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Add required data attributes to toggle switches
document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll('.toggle-switch input');
    const settings = ['emailNotifications', 'profileVisibility', 'jobRecommendations', 'skillReminders'];
    
    toggles.forEach((toggle, index) => {
        if (settings[index]) {
            toggle.setAttribute('data-setting', settings[index]);
        }
    });
    
    // Load saved jobs on page load
    loadSavedJobs();
});

// ===========================================
// SAVED JOBS FUNCTIONALITY
// ===========================================

function loadSavedJobs() {
    const savedJobsList = document.getElementById('saved-jobs-list');
    if (!savedJobsList) return;
    
    // Get saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    if (savedJobs.length === 0) {
        savedJobsList.innerHTML = `
            <div class="empty-saved-jobs">
                <i class="fas fa-heart"></i>
                <h4>No saved jobs yet</h4>
                <p>Jobs you save will appear here for easy access</p>
                <a href="jobs.html" class="btn btn-primary">
                    <i class="fas fa-search"></i> Browse Jobs
                </a>
            </div>
        `;
        return;
    }
    
    // Display saved jobs (limit to 3 for profile preview)
    const displayJobs = savedJobs.slice(0, 3);
    savedJobsList.innerHTML = displayJobs.map(job => createSavedJobItem(job)).join('');
    
    // Show "View All" button if there are more than 3 jobs
    if (savedJobs.length > 3) {
        const viewAllBtn = document.querySelector('.saved-jobs-header button');
        if (viewAllBtn) {
            viewAllBtn.style.display = 'block';
            viewAllBtn.innerHTML = `<i class="fas fa-external-link-alt"></i> View All (${savedJobs.length})`;
        }
    }
}

function createSavedJobItem(job) {
    const postedDate = new Date(job.posted).toLocaleDateString();
    const salary = job.salary ? (typeof job.salary === 'string' ? job.salary : `${job.salary.currency}${job.salary.min/100000}-${job.salary.max/100000} LPA`) : 'Salary not disclosed';
    
    return `
        <div class="saved-job-item" data-job-id="${job.id}">
            <div class="saved-job-info">
                <h4>${job.title}</h4>
                <p>${job.company} • ${job.location}</p>
                <div class="saved-job-meta">
                    <span class="saved-job-source">
                        <i class="${job.source?.icon || 'fas fa-briefcase'}" style="color: ${job.source?.color || '#666'};"></i>
                        ${job.source?.name || 'Unknown'}
                    </span>
                    <span><i class="fas fa-money-bill-wave"></i> ${salary}</span>
                    <span><i class="fas fa-clock"></i> ${postedDate}</span>
                </div>
            </div>
            <div class="saved-job-actions">
                <button class="btn-apply" onclick="applyToSavedJob('${job.id}')">
                    <i class="fas fa-paper-plane"></i> Apply
                </button>
                <button class="btn-remove" onclick="removeSavedJob('${job.id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `;
}

function applyToSavedJob(jobId) {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const job = savedJobs.find(j => j.id === jobId);
    
    if (job) {
        // Redirect to job URL if available
        if (job.url && job.url !== '#') {
            window.open(job.url, '_blank');
            showNotification(`🚀 Redirecting to ${job.company} application page...`, 'success');
        } else {
            showNotification('Job URL not available', 'error');
        }
    }
}

function removeSavedJob(jobId) {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const updatedJobs = savedJobs.filter(job => job.id !== jobId);
    
    localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
    
    // Update UI
    loadSavedJobs();
    
    // Update job cards if on jobs page
    if (window.location.pathname.includes('jobs.html')) {
        const jobCard = document.querySelector(`[data-job-id="${jobId}"]`);
        if (jobCard) {
            const saveBtn = jobCard.querySelector('.save-btn');
            if (saveBtn) {
                saveBtn.innerHTML = '<i class="far fa-heart"></i> Save';
                saveBtn.classList.remove('saved');
            }
        }
    }
    
    showNotification('Job removed from saved list', 'info');
}

function viewAllSavedJobs() {
    // Create a modal to show all saved jobs
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    
    const modalHTML = `
        <div id="saved-jobs-modal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 800px; width: 90%;">
                <div class="modal-header">
                    <h3><i class="fas fa-heart"></i> All Saved Jobs (${savedJobs.length})</h3>
                    <button class="close-btn" onclick="closeSavedJobsModal()">×</button>
                </div>
                <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                    <div class="saved-jobs-list">
                        ${savedJobs.map(job => createSavedJobItem(job)).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeSavedJobsModal()">Close</button>
                    <a href="jobs.html" class="btn btn-primary">
                        <i class="fas fa-search"></i> Browse More Jobs
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeSavedJobsModal() {
    const modal = document.getElementById('saved-jobs-modal');
    if (modal) {
        modal.remove();
    }
}

// Make functions available globally
window.viewAllSavedJobs = viewAllSavedJobs;
window.removeSavedJob = removeSavedJob;
window.applyToSavedJob = applyToSavedJob;
window.closeSavedJobsModal = closeSavedJobsModal;