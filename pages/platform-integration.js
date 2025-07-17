// ===========================================
// MULTI-PLATFORM INTEGRATION SYSTEM
// Support for GitHub, Behance, LinkedIn, Dribbble, and more
// ===========================================

class MultiPlatformIntegrator {
    constructor() {
        this.platforms = {
            github: {
                name: 'GitHub',
                icon: 'fab fa-github',
                color: '#333',
                connected: false,
                baseUrl: 'https://api.github.com',
                corsProxy: 'https://cors-anywhere.herokuapp.com/',
                data: null
            },
            behance: {
                name: 'Behance',
                icon: 'fab fa-behance',
                color: '#1769ff',
                connected: false,
                baseUrl: 'https://www.behance.net/v2',
                corsProxy: 'https://cors-anywhere.herokuapp.com/',
                data: null
            },
            linkedin: {
                name: 'LinkedIn',
                icon: 'fab fa-linkedin',
                color: '#0077b5',
                connected: false,
                baseUrl: 'https://api.linkedin.com/v2',
                corsProxy: 'https://cors-anywhere.herokuapp.com/',
                data: null
            },
            dribbble: {
                name: 'Dribbble',
                icon: 'fab fa-dribbble',
                color: '#ea4c89',
                connected: false,
                baseUrl: 'https://api.dribbble.com/v2',
                corsProxy: 'https://cors-anywhere.herokuapp.com/',
                data: null
            },
            medium: {
                name: 'Medium',
                icon: 'fab fa-medium',
                color: '#00ab6c',
                connected: false,
                baseUrl: 'https://medium.com',
                corsProxy: 'https://cors-anywhere.herokuapp.com/',
                data: null
            },
            codepen: {
                name: 'CodePen',
                icon: 'fab fa-codepen',
                color: '#000000',
                connected: false,
                baseUrl: 'https://codepen.io',
                corsProxy: 'https://cors-anywhere.herokuapp.com/',
                data: null
            }
        };
        this.initializeIntegration();
    }

    initializeIntegration() {
        console.log('🔌 Multi-platform integrator initialized');
        
        // Load previously connected platforms from localStorage
        this.loadConnectedPlatforms();
        
        // Set up event listeners for platform connections
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for platform connection buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-platform]')) {
                const platform = e.target.getAttribute('data-platform');
                this.connectPlatform(platform);
            }
        });
    }

    loadConnectedPlatforms() {
        const savedPlatforms = localStorage.getItem('connectedPlatforms');
        if (savedPlatforms) {
            const parsedPlatforms = JSON.parse(savedPlatforms);
            Object.keys(parsedPlatforms).forEach(key => {
                if (this.platforms[key]) {
                    this.platforms[key].connected = parsedPlatforms[key].connected;
                    this.platforms[key].data = parsedPlatforms[key].data;
                }
            });
        }
    }

    saveConnectedPlatforms() {
        localStorage.setItem('connectedPlatforms', JSON.stringify(this.platforms));
    }

    async connectPlatform(platformKey) {
        const platform = this.platforms[platformKey];
        if (!platform) {
            console.error(`Platform ${platformKey} not found`);
            return;
        }

        console.log(`🔗 Connecting to ${platform.name}...`);
        
        try {
            let data;
            switch (platformKey) {
                case 'github':
                    data = await this.connectGitHub();
                    break;
                case 'behance':
                    data = await this.connectBehance();
                    break;
                case 'linkedin':
                    data = await this.connectLinkedIn();
                    break;
                case 'dribbble':
                    data = await this.connectDribbble();
                    break;
                case 'medium':
                    data = await this.connectMedium();
                    break;
                case 'codepen':
                    data = await this.connectCodePen();
                    break;
                default:
                    throw new Error(`Integration not implemented for ${platformKey}`);
            }

            // Mark platform as connected
            platform.connected = true;
            platform.data = data;
            
            // Save to localStorage
            this.saveConnectedPlatforms();
            
            // Update UI
            this.updatePlatformUI(platformKey);
            
            // Show success notification
            this.showNotification(`✅ Successfully connected to ${platform.name}!`, 'success');
            
            // Update global app state
            if (window.appState) {
                window.appState.connectedPlatforms.push(platformKey);
                this.extractSkillsFromPlatform(platformKey, data);
            }
            
        } catch (error) {
            console.error(`❌ Failed to connect to ${platform.name}:`, error);
            this.showNotification(`Failed to connect to ${platform.name}. ${error.message}`, 'error');
        }
    }

    async connectGitHub() {
        const username = prompt('Enter your GitHub username:');
        if (!username) throw new Error('Username is required');

        const userResponse = await fetch(`${this.platforms.github.baseUrl}/users/${username}`);
        if (!userResponse.ok) throw new Error('User not found');
        
        const userData = await userResponse.json();
        const reposResponse = await fetch(`${this.platforms.github.baseUrl}/users/${username}/repos?sort=updated&per_page=12`);
        const reposData = await reposResponse.json();

        return {
            username: username,
            profile: {
                name: userData.name || username,
                bio: userData.bio || 'No bio available',
                followers: userData.followers || 0,
                following: userData.following || 0,
                public_repos: userData.public_repos || 0,
                avatar_url: userData.avatar_url,
                location: userData.location,
                company: userData.company,
                blog: userData.blog
            },
            repositories: reposData.map(repo => ({
                name: repo.name,
                description: repo.description || 'No description available',
                language: repo.language || 'Unknown',
                stars: repo.stargazers_count || 0,
                forks: repo.forks_count || 0,
                url: repo.html_url,
                updated: repo.updated_at,
                topics: repo.topics || [],
                size: repo.size || 0
            }))
        };
    }

    async connectBehance() {
        const username = prompt('Enter your Behance username:');
        if (!username) throw new Error('Username is required');

        // Simulate Behance API data (since real API requires authentication)
        const mockData = {
            username: username,
            profile: {
                name: username,
                bio: 'Creative professional showcasing design work',
                followers: Math.floor(Math.random() * 1000) + 100,
                following: Math.floor(Math.random() * 500) + 50,
                location: 'Creative City',
                website: `https://www.behance.net/${username}`,
                avatar: `https://via.placeholder.com/150?text=${username.charAt(0).toUpperCase()}`
            },
            projects: [
                {
                    name: 'Brand Identity Design',
                    description: 'Complete brand identity package for startup',
                    url: `https://www.behance.net/gallery/${Math.floor(Math.random() * 100000000)}`,
                    image: 'https://via.placeholder.com/400x300?text=Brand+Design',
                    appreciations: Math.floor(Math.random() * 200) + 50,
                    views: Math.floor(Math.random() * 5000) + 1000,
                    tags: ['branding', 'logo', 'identity', 'design']
                },
                {
                    name: 'Mobile App UI Design',
                    description: 'Modern mobile application interface',
                    url: `https://www.behance.net/gallery/${Math.floor(Math.random() * 100000000)}`,
                    image: 'https://via.placeholder.com/400x300?text=Mobile+UI',
                    appreciations: Math.floor(Math.random() * 300) + 75,
                    views: Math.floor(Math.random() * 8000) + 2000,
                    tags: ['mobile', 'ui', 'app', 'design']
                },
                {
                    name: 'Website Redesign',
                    description: 'Complete website redesign for e-commerce',
                    url: `https://www.behance.net/gallery/${Math.floor(Math.random() * 100000000)}`,
                    image: 'https://via.placeholder.com/400x300?text=Web+Design',
                    appreciations: Math.floor(Math.random() * 150) + 25,
                    views: Math.floor(Math.random() * 3000) + 500,
                    tags: ['web', 'ui', 'ux', 'ecommerce']
                }
            ]
        };

        return mockData;
    }

    async connectLinkedIn() {
        const profileUrl = prompt('Enter your LinkedIn profile URL:');
        if (!profileUrl) throw new Error('Profile URL is required');

        // Simulate LinkedIn data (real API requires OAuth)
        const mockData = {
            profileUrl: profileUrl,
            profile: {
                name: 'Professional Name',
                headline: 'Software Developer | Tech Enthusiast',
                location: 'Tech City, Country',
                summary: 'Passionate developer with experience in modern web technologies',
                avatar: 'https://via.placeholder.com/150?text=LI',
                connections: Math.floor(Math.random() * 500) + 500,
                followers: Math.floor(Math.random() * 1000) + 200
            },
            experience: [
                {
                    title: 'Senior Software Developer',
                    company: 'Tech Company Inc.',
                    duration: '2020 - Present',
                    description: 'Lead development of web applications using React and Node.js'
                },
                {
                    title: 'Frontend Developer',
                    company: 'Digital Agency',
                    duration: '2018 - 2020',
                    description: 'Developed responsive websites and web applications'
                }
            ],
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX Design'],
            education: [
                {
                    degree: 'Bachelor of Computer Science',
                    institution: 'University of Technology',
                    year: '2018'
                }
            ]
        };

        return mockData;
    }

    async connectDribbble() {
        const username = prompt('Enter your Dribbble username:');
        if (!username) throw new Error('Username is required');

        // Simulate Dribbble data
        const mockData = {
            username: username,
            profile: {
                name: username,
                bio: 'Creative designer sharing visual inspiration',
                followers: Math.floor(Math.random() * 800) + 200,
                following: Math.floor(Math.random() * 300) + 100,
                likes: Math.floor(Math.random() * 2000) + 500,
                avatar: `https://via.placeholder.com/150?text=${username.charAt(0).toUpperCase()}`,
                location: 'Design City'
            },
            shots: [
                {
                    title: 'Logo Design Concept',
                    description: 'Modern logo design for tech startup',
                    image: 'https://via.placeholder.com/400x300?text=Logo+Design',
                    likes: Math.floor(Math.random() * 100) + 20,
                    views: Math.floor(Math.random() * 1000) + 200,
                    tags: ['logo', 'branding', 'design']
                },
                {
                    title: 'UI Animation',
                    description: 'Smooth micro-interactions for mobile app',
                    image: 'https://via.placeholder.com/400x300?text=UI+Animation',
                    likes: Math.floor(Math.random() * 150) + 40,
                    views: Math.floor(Math.random() * 1500) + 400,
                    tags: ['animation', 'ui', 'mobile']
                }
            ]
        };

        return mockData;
    }

    async connectMedium() {
        const username = prompt('Enter your Medium username:');
        if (!username) throw new Error('Username is required');

        // Simulate Medium data
        const mockData = {
            username: username,
            profile: {
                name: username,
                bio: 'Writer sharing insights about technology and development',
                followers: Math.floor(Math.random() * 1000) + 300,
                following: Math.floor(Math.random() * 500) + 100,
                avatar: `https://via.placeholder.com/150?text=${username.charAt(0).toUpperCase()}`
            },
            articles: [
                {
                    title: 'Modern JavaScript Best Practices',
                    description: 'Essential practices for writing maintainable JavaScript code',
                    url: `https://medium.com/@${username}/modern-javascript-best-practices`,
                    claps: Math.floor(Math.random() * 500) + 100,
                    readTime: '8 min read',
                    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    title: 'Building Scalable React Applications',
                    description: 'Strategies for creating maintainable React applications',
                    url: `https://medium.com/@${username}/building-scalable-react-applications`,
                    claps: Math.floor(Math.random() * 300) + 50,
                    readTime: '12 min read',
                    publishedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        };

        return mockData;
    }

    async connectCodePen() {
        const username = prompt('Enter your CodePen username:');
        if (!username) throw new Error('Username is required');

        // Simulate CodePen data
        const mockData = {
            username: username,
            profile: {
                name: username,
                bio: 'Frontend developer sharing creative code experiments',
                followers: Math.floor(Math.random() * 600) + 150,
                following: Math.floor(Math.random() * 400) + 80,
                avatar: `https://via.placeholder.com/150?text=${username.charAt(0).toUpperCase()}`
            },
            pens: [
                {
                    title: 'CSS Animation Showcase',
                    description: 'Creative CSS animations and transitions',
                    url: `https://codepen.io/${username}/pen/abc123`,
                    likes: Math.floor(Math.random() * 200) + 30,
                    views: Math.floor(Math.random() * 2000) + 500,
                    tags: ['css', 'animation', 'transitions']
                },
                {
                    title: 'Interactive JavaScript Widget',
                    description: 'Dynamic widget with smooth interactions',
                    url: `https://codepen.io/${username}/pen/def456`,
                    likes: Math.floor(Math.random() * 150) + 25,
                    views: Math.floor(Math.random() * 1500) + 300,
                    tags: ['javascript', 'interactive', 'widget']
                }
            ]
        };

        return mockData;
    }

    extractSkillsFromPlatform(platformKey, data) {
        const skills = new Set();
        
        switch (platformKey) {
            case 'github':
                data.repositories.forEach(repo => {
                    if (repo.language) skills.add(repo.language);
                    repo.topics.forEach(topic => skills.add(topic));
                });
                break;
            case 'behance':
                data.projects.forEach(project => {
                    project.tags.forEach(tag => skills.add(tag));
                });
                break;
            case 'linkedin':
                data.skills.forEach(skill => skills.add(skill));
                break;
            case 'dribbble':
                data.shots.forEach(shot => {
                    shot.tags.forEach(tag => skills.add(tag));
                });
                break;
            case 'medium':
                // Extract skills from article titles and descriptions
                skills.add('Technical Writing');
                skills.add('Communication');
                break;
            case 'codepen':
                data.pens.forEach(pen => {
                    pen.tags.forEach(tag => skills.add(tag));
                });
                break;
        }
        
        // Add extracted skills to global state
        if (window.appState) {
            window.appState.userSkills = [...window.appState.userSkills, ...Array.from(skills)];
            window.appState.userSkills = [...new Set(window.appState.userSkills)]; // Remove duplicates
        }
        
        console.log(`🎯 Extracted skills from ${platformKey}:`, Array.from(skills));
    }

    updatePlatformUI(platformKey) {
        const platform = this.platforms[platformKey];
        const statusElement = document.getElementById(`${platformKey}-status`);
        
        if (statusElement) {
            statusElement.textContent = 'Connected';
            statusElement.style.color = '#34a853';
        }
        
        // Update platform button
        const platformButton = document.querySelector(`[data-platform="${platformKey}"]`);
        if (platformButton) {
            platformButton.style.backgroundColor = platform.color;
            platformButton.style.color = 'white';
            platformButton.innerHTML = `<i class="${platform.icon}"></i> Connected`;
        }
    }

    renderPlatformData(platformKey, containerId) {
        const platform = this.platforms[platformKey];
        const container = document.getElementById(containerId);
        
        if (!container || !platform.connected || !platform.data) return;
        
        switch (platformKey) {
            case 'github':
                this.renderGitHubData(platform.data, container);
                break;
            case 'behance':
                this.renderBehanceData(platform.data, container);
                break;
            case 'linkedin':
                this.renderLinkedInData(platform.data, container);
                break;
            case 'dribbble':
                this.renderDribbbleData(platform.data, container);
                break;
            case 'medium':
                this.renderMediumData(platform.data, container);
                break;
            case 'codepen':
                this.renderCodePenData(platform.data, container);
                break;
        }
    }

    renderGitHubData(data, container) {
        container.innerHTML = data.repositories.slice(0, 6).map(repo => `
            <div class="project-card">
                <div class="project-image">
                    <i class="fab fa-github"></i>
                </div>
                <div class="project-info">
                    <h3>${repo.name}</h3>
                    <p>${repo.description}</p>
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

    renderBehanceData(data, container) {
        container.innerHTML = data.projects.slice(0, 6).map(project => `
            <div class="project-card">
                <div class="project-image" style="background-image: url(${project.image});">
                </div>
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-stats">
                        <span><i class="fas fa-heart"></i> ${project.appreciations}</span>
                        <span><i class="fas fa-eye"></i> ${project.views}</span>
                    </div>
                    <div class="project-actions">
                        <a href="${project.url}" target="_blank" class="btn-small">View Project</a>
                        <a href="${project.url}" target="_blank" class="btn-small">Behance</a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                          type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add to container
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    getPlatformData(platformKey) {
        return this.platforms[platformKey];
    }

    getAllConnectedPlatforms() {
        return Object.keys(this.platforms).filter(key => this.platforms[key].connected);
    }

    disconnectPlatform(platformKey) {
        const platform = this.platforms[platformKey];
        if (platform) {
            platform.connected = false;
            platform.data = null;
            this.saveConnectedPlatforms();
            this.updatePlatformUI(platformKey);
            this.showNotification(`Disconnected from ${platform.name}`, 'info');
        }
    }
}

// Initialize the multi-platform integrator
const multiPlatformIntegrator = new MultiPlatformIntegrator();

// Global function for connecting platforms
function connectPlatform(platformKey) {
    multiPlatformIntegrator.connectPlatform(platformKey);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiPlatformIntegrator;
} 