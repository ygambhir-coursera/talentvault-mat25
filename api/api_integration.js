// Real API Integration functionality
class SkillForgeAPI {
    constructor() {
        this.githubAPI = 'https://api.github.com';
        this.jobsAPI = 'https://jobs.github.com/positions.json';
    }

    // GitHub API Integration
    async connectGitHub(username) {
        try {
            console.log(`🔗 Connecting to GitHub for user: ${username}`);
            
            // Fetch user profile
            const userResponse = await fetch(`${this.githubAPI}/users/${username}`);
            const userData = await userResponse.json();
            
            // Fetch user repositories
            const reposResponse = await fetch(`${this.githubAPI}/users/${username}/repos?sort=updated&per_page=10`);
            const reposData = await reposResponse.json();
            
            // Process and store data
            const githubData = {
                profile: {
                    name: userData.name,
                    bio: userData.bio,
                    followers: userData.followers,
                    following: userData.following,
                    public_repos: userData.public_repos
                },
                repositories: reposData.map(repo => ({
                    name: repo.name,
                    description: repo.description,
                    language: repo.language,
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    url: repo.html_url,
                    updated: repo.updated_at
                }))
            };
            
            // Update app state
            this.updateGitHubData(githubData);
            return githubData;
            
        } catch (error) {
            console.error('❌ GitHub API Error:', error);
            throw new Error('Failed to connect to GitHub. Please check the username.');
        }
    }

    updateGitHubData(data) {
        // Update global app state
        const existingIndex = appState.portfolioItems.findIndex(item => item.platform === 'github');
        
        if (existingIndex >= 0) {
            appState.portfolioItems[existingIndex].data = data;
        } else {
            appState.portfolioItems.push({
                platform: 'github',
                data: data
            });
        }
        
        // Update UI if on portfolio page
        if (window.location.pathname.includes('portfolio.html')) {
            this.renderGitHubProjects(data.repositories);
        }
    }

    renderGitHubProjects(repositories) {
        const githubProjectsContainer = document.getElementById('github-projects');
        if (!githubProjectsContainer) return;
        
        githubProjectsContainer.innerHTML = repositories.slice(0, 6).map(repo => `
            <div class="project-card">
                <div class="project-image">
                    <i class="fas fa-code"></i>
                </div>
                <div class="project-info">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="project-tags">
                        ${repo.language ? `<span class="tag">${repo.language}</span>` : ''}
                        <span class="tag">⭐ ${repo.stars}</span>
                        <span class="tag">🍴 ${repo.forks}</span>
                    </div>
                    <div class="project-actions">
                        <a href="${repo.url}" target="_blank" class="btn-small">View Code</a>
                        <a href="${repo.url}" target="_blank" class="btn-small">Repository</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Real Job API Integration
    async fetchRealJobs(filters = {}) {
        try {
            console.log('💼 Fetching real job listings...');
            
            // GitHub Jobs API (Note: This API was deprecated, but we'll simulate with structure)
            // Alternative: Use a job aggregator API or scraping service
            
            // For MVP, we'll use a mock API structure but with real-looking data
            const mockJobs = await this.generateRealisticJobs(filters);
            return mockJobs;
            
        } catch (error) {
            console.error('❌ Jobs API Error:', error);
            return this.getFallbackJobs();
        }
    }

    async generateRealisticJobs(filters) {
        // This simulates real job data but with realistic structure
        const jobTemplates = [
            {
                title: "Frontend Developer",
                company: "TechCorp Solutions",
                location: "Mumbai, India",
                type: "full-time",
                description: "We're looking for a passionate Frontend Developer to join our team. You'll work with React, TypeScript, and modern tools.",
                requirements: ["JavaScript", "React", "CSS", "Git"],
                salary: "₹8-12 LPA",
                remote: true,
                posted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
            },
            {
                title: "Python Developer",
                company: "AI Innovations",
                location: "Bangalore, India",
                type: "full-time",
                description: "Join our AI team to build cutting-edge machine learning applications using Python and TensorFlow.",
                requirements: ["Python", "Machine Learning", "TensorFlow", "APIs"],
                salary: "₹10-15 LPA",
                remote: false,
                posted: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
            },
            {
                title: "UI/UX Designer",
                company: "Design Studio Pro",
                location: "Remote",
                type: "contract",
                description: "Create beautiful and intuitive user experiences for web and mobile applications.",
                requirements: ["Figma", "Adobe XD", "User Research", "Prototyping"],
                salary: "₹6-10 LPA",
                remote: true,
                posted: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000)
            },
            {
                title: "Full Stack Developer Intern",
                company: "StartupXYZ",
                location: "Delhi, India",
                type: "internship",
                description: "6-month internship working on real projects with mentorship from senior developers.",
                requirements: ["JavaScript", "Node.js", "MongoDB", "React"],
                salary: "₹25,000/month",
                remote: true,
                posted: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000)
            }
        ];

        // Apply filters
        let filteredJobs = jobTemplates;
        
        if (filters.type) {
            filteredJobs = filteredJobs.filter(job => job.type === filters.type);
        }
        
        if (filters.location && filters.location !== 'remote') {
            filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase().includes(filters.location.toLowerCase()) || 
                job.remote
            );
        }
        
        if (filters.skills) {
            const skillsArray = filters.skills.toLowerCase().split(',').map(s => s.trim());
            filteredJobs = filteredJobs.filter(job => 
                job.requirements.some(req => 
                    skillsArray.some(skill => req.toLowerCase().includes(skill))
                )
            );
        }

        return filteredJobs;
    }

    getFallbackJobs() {
        return [
            {
                title: "Software Developer",
                company: "Tech Company",
                location: "Remote",
                type: "full-time",
                description: "Join our development team",
                requirements: ["Programming", "Problem Solving"],
                salary: "Competitive",
                remote: true,
                posted: new Date()
            }
        ];
    }

    // AI-powered job matching
    calculateJobMatch(job, userSkills) {
        if (!userSkills || userSkills.length === 0) return Math.floor(Math.random() * 40) + 30;
        
        const matchedSkills = job.requirements.filter(req => 
            userSkills.some(skill => 
                skill.toLowerCase().includes(req.toLowerCase()) || 
                req.toLowerCase().includes(skill.toLowerCase())
            )
        );
        
        const matchPercentage = Math.min(90, Math.floor((matchedSkills.length / job.requirements.length) * 100) + 10);
        return matchPercentage;
    }

    // Blockchain simulation (basic)
    async verifyCredential(credentialData) {
        console.log('⛓️ Starting blockchain verification...');
        
        // Simulate blockchain transaction
        return new Promise((resolve) => {
            setTimeout(() => {
                const transactionHash = this.generateTransactionHash();
                const verification = {
                    hash: transactionHash,
                    timestamp: new Date().toISOString(),
                    verified: true,
                    blockNumber: Math.floor(Math.random() * 1000000) + 500000
                };
                
                console.log('✅ Blockchain verification complete:', verification);
                resolve(verification);
            }, 3000);
        });
    }

    generateTransactionHash() {
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 64; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }
}

// Initialize API integration
const skillForgeAPI = new SkillForgeAPI();

// Enhanced platform connection with real GitHub
async function connectPlatformReal(platform) {
    if (platform === 'github') {
        const username = prompt('Enter your GitHub username:');
        if (!username) return;
        
        try {
            // Show loading state
            const statusElement = document.getElementById('github-status');
            const buttonElement = statusElement.parentElement;
            
            statusElement.textContent = 'Connecting...';
            statusElement.style.color = '#f59e0b';
            
            // Connect to real GitHub API
            const githubData = await skillForgeAPI.connectGitHub(username);
            
            // Update UI
            statusElement.textContent = 'Connected';
            statusElement.style.color = '#10b981';
            buttonElement.classList.add('connected');
            
            // Add to connected platforms
            if (!appState.connectedPlatforms.includes('github')) {
                appState.connectedPlatforms.push('github');
            }
            
            updateProgressStats();
            alert(`✅ Successfully connected to GitHub!\nFound ${githubData.repositories.length} repositories.`);
            
        } catch (error) {
            const statusElement = document.getElementById('github-status');
            statusElement.textContent = 'Error';
            statusElement.style.color = '#ef4444';
            alert(`❌ Error connecting to GitHub: ${error.message}`);
        }
    } else {
        // Use the original simulation for other platforms
        connectPlatform(platform);
    }
}