// ==========================================
// TALENTVALUE JOBS MODULE - CLEAN VERSION
// ==========================================

// Global state for job management
let jobsData = {
    allJobs: [],
    filteredJobs: [],
    currentFilters: {},
    mandatoryFilters: ['job-type-filter', 'location-filter', 'skills-filter'],
    isLoading: false
};

// Initialize jobs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Jobs page initializing...');
    try {
        initializeJobs();
        setupEventListeners();
        console.log('✅ Jobs page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing jobs:', error);
    }
});

// Initialize jobs with sample data
function initializeJobs() {
    console.log('📊 Loading job data...');
    
    // Check if required DOM elements exist
    const perfectMatchesGrid = document.getElementById('perfect-matches-grid');
    const otherJobsGrid = document.getElementById('other-jobs-grid');
    
    if (!perfectMatchesGrid || !otherJobsGrid) {
        console.error('❌ Required DOM elements not found');
        return;
    }
    
    // Create realistic job data with proper sources
    jobsData.allJobs = [
        {
            id: 'job-001',
            title: 'Senior React Developer',
            company: 'TechCorp Solutions',
            location: 'remote',
            type: 'full-time',
            experience: 'senior',
            skills: ['React', 'TypeScript', 'JavaScript', 'Node.js'],
            salary: '₹12-18 LPA',
            description: 'Join our innovative team to build next-generation web applications using React, TypeScript, and modern frontend technologies.',
            companySize: 'medium',
            posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            relevanceScore: 92,
            url: 'https://linkedin.com/jobs/view/123456',
            source: { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077b5' }
        },
        {
            id: 'job-002',
            title: 'Python Developer',
            company: 'StartupXYZ',
            location: 'mumbai',
            type: 'full-time',
            experience: 'mid',
            skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
            salary: '₹8-15 LPA',
            description: 'Build scalable backend systems and APIs using Python and Django.',
            companySize: 'startup',
            posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            relevanceScore: 85,
            url: 'https://indeed.com/viewjob?jk=abc123',
            source: { name: 'Indeed', icon: 'fas fa-file-alt', color: '#2164f3' }
        },
        {
            id: 'job-003',
            title: 'Full Stack Developer',
            company: 'Digital Agency',
            location: 'bangalore',
            type: 'full-time',
            experience: 'mid',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            salary: '₹10-16 LPA',
            description: 'Work on diverse client projects using modern web technologies.',
            companySize: 'medium',
            posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            relevanceScore: 78,
            url: 'https://glassdoor.com/job/xyz789',
            source: { name: 'Glassdoor', icon: 'fas fa-building', color: '#0caa41' }
        },
        {
            id: 'job-004',
            title: 'Frontend Developer',
            company: 'InnovateTech',
            location: 'pune',
            type: 'full-time',
            experience: 'mid',
            skills: ['React', 'CSS', 'JavaScript', 'HTML'],
            salary: '₹6-12 LPA',
            description: 'Create beautiful user interfaces with React and modern CSS frameworks.',
            companySize: 'medium',
            posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            relevanceScore: 88,
            url: 'https://monster.com/job/def456',
            source: { name: 'Monster', icon: 'fas fa-search', color: '#6b46c1' }
        },
        {
            id: 'job-005',
            title: 'DevOps Engineer',
            company: 'CloudFirst',
            location: 'remote',
            type: 'full-time',
            experience: 'senior',
            skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
            salary: '₹15-25 LPA',
            description: 'Manage cloud infrastructure and CI/CD pipelines for modern applications.',
            companySize: 'startup',
            posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            relevanceScore: 80,
            url: 'https://stackoverflow.com/jobs/789012',
            source: { name: 'Stack Overflow', icon: 'fab fa-stack-overflow', color: '#f48024' }
        },
        {
            id: 'job-006',
            title: 'UI/UX Designer',
            company: 'DesignStudio Pro',
            location: 'delhi',
            type: 'full-time',
            experience: 'mid',
            skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
            salary: '₹8-14 LPA',
            description: 'Create stunning user experiences for web and mobile applications.',
            companySize: 'medium',
            posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            relevanceScore: 75,
            url: 'https://angel.co/job/345678',
            source: { name: 'AngelList', icon: 'fab fa-angellist', color: '#1c1c1c' }
        },
        {
            id: 'job-007',
            title: 'Backend Developer',
            company: 'DataTech Solutions',
            location: 'hyderabad',
            type: 'full-time',
            experience: 'mid',
            skills: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
            salary: '₹9-15 LPA',
            description: 'Develop robust backend systems and APIs for high-traffic applications.',
            companySize: 'large',
            posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            relevanceScore: 82,
            url: 'https://linkedin.com/jobs/view/456789',
            source: { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0077b5' }
        },
        {
            id: 'job-008',
            title: 'Mobile App Developer',
            company: 'AppMakers Inc',
            location: 'mumbai',
            type: 'contract',
            experience: 'mid',
            skills: ['React Native', 'Flutter', 'iOS', 'Android'],
            salary: '₹7-12 LPA',
            description: 'Build cross-platform mobile applications using React Native and Flutter.',
            companySize: 'medium',
            posted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            relevanceScore: 76,
            url: 'https://indeed.com/viewjob?jk=mobile123',
            source: { name: 'Indeed', icon: 'fas fa-file-alt', color: '#2164f3' }
        }
    ];
    
    // Load jobs initially (profile-relevant)
    loadJobs();
    updateHelpText();
    
    // Fallback: ensure jobs are visible
    setTimeout(() => {
        const perfectMatchesGrid = document.getElementById('perfect-matches-grid');
        const otherJobsGrid = document.getElementById('other-jobs-grid');
        
        if (perfectMatchesGrid && otherJobsGrid) {
            if (perfectMatchesGrid.innerHTML.trim() === '' && otherJobsGrid.innerHTML.trim() === '') {
                console.log('🔄 Fallback: Re-attempting to load jobs...');
                loadJobs();
            }
        }
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Filter change listeners
    const filterIds = ['keyword-filter', 'location-filter', 'job-type-filter', 'experience-filter', 'skills-filter', 'salary-filter', 'company-size-filter'];
    filterIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateHelpText);
            element.addEventListener('input', updateHelpText);
        }
    });
}

// Load and display jobs
function loadJobs(filters = {}) {
    console.log('📋 Loading jobs with filters:', filters);
    
    try {
        showLoading(true);
        
        // Apply filters
        jobsData.filteredJobs = applyFilters(jobsData.allJobs, filters);
        
        // Render jobs
        renderJobs(jobsData.filteredJobs);
        
        // Update stats
        updateStats(jobsData.filteredJobs);
        
        showLoading(false);
        
        console.log(`✅ Loaded ${jobsData.filteredJobs.length} jobs`);
    } catch (error) {
        console.error('❌ Error loading jobs:', error);
        showLoading(false);
    }
}

// Apply filters to jobs
function applyFilters(jobs, filters) {
    return jobs.filter(job => {
        // Keyword filter
        if (filters.keyword && filters.keyword.trim()) {
            const keyword = filters.keyword.toLowerCase();
            const matchesKeyword = job.title.toLowerCase().includes(keyword) ||
                                 job.company.toLowerCase().includes(keyword) ||
                                 job.description.toLowerCase().includes(keyword) ||
                                 job.skills.some(skill => skill.toLowerCase().includes(keyword));
            if (!matchesKeyword) return false;
        }
        
        // Location filter
        if (filters.location && job.location !== filters.location) return false;
        
        // Job type filter
        if (filters.jobType && job.type !== filters.jobType) return false;
        
        // Experience filter
        if (filters.experience && job.experience !== filters.experience) return false;
        
        // Skills filter
        if (filters.skills && filters.skills.trim()) {
            const requiredSkills = filters.skills.split(',').map(s => s.trim().toLowerCase());
            const hasSkills = requiredSkills.some(skill => 
                job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill))
            );
            if (!hasSkills) return false;
        }
        
        // Company size filter
        if (filters.companySize && job.companySize !== filters.companySize) return false;
        
        return true;
    });
}

// Render jobs on the page
function renderJobs(jobs) {
    console.log('🎨 Rendering jobs:', jobs.length);
    
    const perfectMatchesGrid = document.getElementById('perfect-matches-grid');
    const otherJobsGrid = document.getElementById('other-jobs-grid');
    
    if (!perfectMatchesGrid || !otherJobsGrid) {
        console.error('❌ Job containers not found');
        return;
    }
    
    // Clear existing content
    perfectMatchesGrid.innerHTML = '';
    otherJobsGrid.innerHTML = '';
    
    if (jobs.length === 0) {
        perfectMatchesGrid.innerHTML = '<p class="no-jobs-message">No jobs found matching your criteria. Try adjusting your filters.</p>';
        return;
    }
    
    // Separate jobs by relevance score
    const perfectMatches = jobs.filter(job => job.relevanceScore >= 80);
    const otherJobs = jobs.filter(job => job.relevanceScore < 80);
    
    // Render perfect matches
    perfectMatches.forEach(job => {
        const jobCard = createJobCard(job, true);
        perfectMatchesGrid.appendChild(jobCard);
    });
    
    // Render other jobs
    otherJobs.forEach(job => {
        const jobCard = createJobCard(job, false);
        otherJobsGrid.appendChild(jobCard);
    });
    
    // Show/hide sections based on content
    const perfectMatchesSection = document.getElementById('perfect-matches-section');
    const otherJobsSection = document.getElementById('other-jobs-section');
    
    if (perfectMatchesSection) {
        perfectMatchesSection.style.display = perfectMatches.length > 0 ? 'block' : 'none';
    }
    if (otherJobsSection) {
        otherJobsSection.style.display = otherJobs.length > 0 ? 'block' : 'none';
    }
}

// Create job card HTML
function createJobCard(job, isPerfectMatch = false) {
    const jobCard = document.createElement('div');
    jobCard.className = `job-card ${isPerfectMatch ? 'match-perfect' : ''}`;
    
    const tagsHtml = job.skills.slice(0, 4).map(skill => `<span class="tag">${skill}</span>`).join('');
    const postedText = formatJobDate(job.posted);
    
    jobCard.innerHTML = `
        <div class="job-header">
            <div class="company-logo">
                <i class="${job.source.icon}"></i>
            </div>
            <div class="job-info">
                <h3>${job.title}</h3>
                <p class="company">${job.company}</p>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${formatLocation(job.location)}</p>
            </div>
            <div class="match-score">
                <span class="score">${job.relevanceScore}%</span>
                <small>Match</small>
            </div>
        </div>
        <div class="job-details">
            <div class="job-tags">
                ${tagsHtml}
                <span class="tag">${formatJobType(job.type)}</span>
            </div>
            <p class="job-description">${job.description}</p>
            <div class="job-footer">
                <div class="job-meta">
                    <span class="job-source">
                        <i class="${job.source.icon}" style="color: ${job.source.color};"></i>
                        <small>${job.source.name}</small>
                    </span>
                    <span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
                    <span><i class="fas fa-clock"></i> ${postedText}</span>
                </div>
                <div class="job-actions">
                    <button class="btn-secondary save-btn" onclick="saveJob('${job.id}')">
                        <i class="far fa-heart"></i> Save
                    </button>
                    <button class="btn-primary" onclick="applyToJob('${job.id}')">Apply Now</button>
                </div>
            </div>
        </div>
    `;
    
    return jobCard;
}

// Update job stats
function updateStats(jobs) {
    const perfectMatches = jobs.filter(job => job.relevanceScore >= 80);
    const newToday = jobs.filter(job => {
        const today = new Date();
        const posted = new Date(job.posted);
        return today.toDateString() === posted.toDateString();
    });
    
    const perfectMatchesCount = document.getElementById('perfect-matches-count');
    const matchRate = document.getElementById('match-rate');
    const newTodayCount = document.getElementById('new-today-count');
    
    if (perfectMatchesCount) perfectMatchesCount.textContent = perfectMatches.length;
    if (matchRate) matchRate.textContent = jobs.length > 0 ? Math.round((perfectMatches.length / jobs.length) * 100) + '%' : '0%';
    if (newTodayCount) newTodayCount.textContent = newToday.length;
}

// Update help text based on mandatory filters
function updateHelpText() {
    const mandatoryFilters = ['job-type-filter', 'location-filter', 'skills-filter'];
    const filledFilters = mandatoryFilters.filter(filterId => {
        const element = document.getElementById(filterId);
        return element && element.value && element.value.trim();
    });
    
    const helpText = document.getElementById('filter-help-text');
    if (helpText) {
        if (filledFilters.length === mandatoryFilters.length) {
            helpText.innerHTML = '<i class="fas fa-check-circle" style="color: #10b981;"></i> All mandatory filters selected. Showing customized results.';
        } else {
            helpText.innerHTML = '<i class="fas fa-info-circle"></i> <span class="mandatory-marker">*</span> Select mandatory filters to get customized results. Until then, showing jobs relevant to your profile.';
        }
    }
}

// Search jobs function
function searchJobs() {
    console.log('🔍 Searching jobs...');
    
    const filters = {
        keyword: document.getElementById('keyword-filter')?.value || '',
        location: document.getElementById('location-filter')?.value || '',
        jobType: document.getElementById('job-type-filter')?.value || '',
        experience: document.getElementById('experience-filter')?.value || '',
        skills: document.getElementById('skills-filter')?.value || '',
        salary: document.getElementById('salary-filter')?.value || '',
        companySize: document.getElementById('company-size-filter')?.value || ''
    };
    
    jobsData.currentFilters = filters;
    loadJobs(filters);
    
    // Show notification
    showNotification('🔍 Search completed! Found ' + jobsData.filteredJobs.length + ' jobs.', 'success');
}

// Clear filters function
function clearFilters() {
    console.log('🧹 Clearing filters...');
    
    const filterIds = ['keyword-filter', 'location-filter', 'job-type-filter', 'experience-filter', 'skills-filter', 'salary-filter', 'company-size-filter'];
    filterIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = '';
        }
    });
    
    jobsData.currentFilters = {};
    loadJobs();
    updateHelpText();
    
    showNotification('🧹 Filters cleared!', 'info');
}

// Utility functions
function formatLocation(location) {
    return location.charAt(0).toUpperCase() + location.slice(1);
}

function formatJobType(type) {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatJobDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted today';
    if (diffDays <= 7) return `Posted ${diffDays} days ago`;
    return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
}

function showLoading(show) {
    try {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'block' : 'none';
        }
    } catch (error) {
        console.error('❌ Error showing loading indicator:', error);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 300px;
    `;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Job action functions
function saveJob(jobId) {
    console.log('💾 Saving job:', jobId);
    const job = jobsData.allJobs.find(j => j.id === jobId);
    if (job) {
        showNotification(`💾 Job "${job.title}" saved to your profile!`, 'success');
    }
}

function applyToJob(jobId) {
    console.log('📝 Applying to job:', jobId);
    const job = jobsData.allJobs.find(j => j.id === jobId);
    if (job) {
        window.open(job.url, '_blank');
        showNotification(`📝 Redirecting to apply for "${job.title}"...`, 'info');
    }
}

// Export functions for global access
window.searchJobs = searchJobs;
window.clearFilters = clearFilters;
window.saveJob = saveJob;
window.applyToJob = applyToJob;

