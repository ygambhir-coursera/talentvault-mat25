// Portfolio-specific functionality
function addProject() {
    alert('🎨 Add Project feature coming soon! You\'ll be able to add projects from various platforms.');
}

function sharePortfolio() {
    // Generate shareable link
    const portfolioUrl = window.location.origin + '/pages/portfolio.html';
    
    if (navigator.share) {
        navigator.share({
            title: 'My TalentVault Portfolio',
            text: 'Check out my professional portfolio on TalentVault!',
            url: portfolioUrl
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(portfolioUrl).then(() => {
            showClipboardNotification();
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = portfolioUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showClipboardNotification();
        });
    }
}

function showClipboardNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'clipboard-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Portfolio link copied to clipboard!</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Load portfolio data when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('portfolio.html')) {
        loadPortfolioData();
    }
});

function loadPortfolioData() {
    console.log('📁 Loading portfolio data...');
    
    // Simulate loading connected platform data
    if (appState.connectedPlatforms.length > 0) {
        updatePortfolioStats();
        loadProjectsFromPlatforms();
    }
}

function updatePortfolioStats() {
    // Update stats based on connected platforms and projects
    const stats = {
        views: Math.floor(Math.random() * 200) + 100,
        likes: Math.floor(Math.random() * 50) + 10,
        comments: Math.floor(Math.random() * 15) + 3,
        downloads: Math.floor(Math.random() * 20) + 5
    };
    
    // Update DOM if elements exist
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards.length >= 4) {
        statCards[0].textContent = stats.views;
        statCards[1].textContent = stats.likes;
        statCards[2].textContent = stats.comments;
        statCards[3].textContent = stats.downloads;
    }
}

function loadProjectsFromPlatforms() {
    // This would normally fetch real data from connected platforms
    console.log('🔗 Loading projects from connected platforms...');
    
    // Simulate adding more projects based on connected platforms
    appState.connectedPlatforms.forEach(platform => {
        console.log(`Loading projects from ${platform}...`);
    });
}