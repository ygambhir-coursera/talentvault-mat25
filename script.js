// ===========================================
// LEARN2EARN PLATFORM - MAIN SCRIPT
// Enhanced with Real API Integration
// ===========================================

// Global state management
const appState = {
    connectedPlatforms: [],
    userProfile: {},
    portfolioItems: [],
    verificationStatus: 'pending',
    userSkills: []
};

// ===========================================
// API INTEGRATION CLASS
// ===========================================
class SkillForgeAPI {
    constructor() {
        this.githubAPI = 'https://api.github.com';
        this.corsProxy = 'https://cors-anywhere.herokuapp.com/'; // Fallback for CORS issues
    }

    // Real GitHub API Integration
    async connectGitHub(username) {
        try {
            console.log(`🔗 Connecting to GitHub for user: ${username}`);
            
            // Fetch user profile
            const userResponse = await fetch(`${this.githubAPI}/users/${username}`);
            if (!userResponse.ok) throw new Error('User not found');
            const userData = await userResponse.json();
            
            // Fetch user repositories
            const reposResponse = await fetch(`${this.githubAPI}/users/${username}/repos?sort=updated&per_page=10`);
            const reposData = await reposResponse.json();
            
            // Process and store data
            const githubData = {
                username: username,
                profile: {
                    name: userData.name || username,
                    bio: userData.bio || 'No bio available',
                    followers: userData.followers || 0,
                    following: userData.following || 0,
                    public_repos: userData.public_repos || 0,
                    avatar_url: userData.avatar_url
                },
                repositories: reposData.map(repo => ({
                    name: repo.name,
                    description: repo.description || 'No description available',
                    language: repo.language || 'Unknown',
                    stars: repo.stargazers_count || 0,
                    forks: repo.forks_count || 0,
                    url: repo.html_url,
                    updated: repo.updated_at,
                    topics: repo.topics || []
                }))
            };
            
            // Update app state
            this.updateGitHubData(githubData);
            
            // Extract skills from repositories
            this.extractSkillsFromGitHub(githubData);
            
            return githubData;
            
        } catch (error) {
            console.error('❌ GitHub API Error:', error);
            throw new Error(`Failed to connect to GitHub: ${error.message}`);
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
        
        console.log('✅ GitHub data updated in app state');
    }

    extractSkillsFromGitHub(githubData) {
        const skills = new Set();
        
        githubData.repositories.forEach(repo => {
            if (repo.language && repo.language !== 'Unknown') {
                skills.add(repo.language);
            }
            repo.topics.forEach(topic => skills.add(topic));
        });
        
        appState.userSkills = [...appState.userSkills, ...Array.from(skills)];
        appState.userSkills = [...new Set(appState.userSkills)]; // Remove duplicates
        
        console.log('🎯 Extracted skills:', appState.userSkills);
    }

    // Generate realistic jobs with AI matching
    async generateRealisticJobs(filters = {}) {
        const jobTemplates = [
            {
                id: 'job-1',
                title: "Frontend Developer",
                company: "TechCorp Solutions",
                location: "Mumbai, India",
                type: "full-time",
                description: "We're looking for a passionate Frontend Developer to join our team. You'll work with React, TypeScript, and modern tools to build amazing user interfaces.",
                requirements: ["JavaScript", "React", "TypeScript", "CSS", "Git"],
                salary: "₹8-12 LPA",
                remote: true,
                posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                companyLogo: "fas fa-laptop-code"
            },
            {
                id: 'job-2',
                title: "Python Developer",
                company: "AI Innovations Inc",
                location: "Bangalore, India",
                type: "full-time",
                description: "Join our AI team to build cutting-edge machine learning applications using Python, TensorFlow, and modern ML frameworks.",
                requirements: ["Python", "Machine Learning", "TensorFlow", "APIs", "Data Science"],
                salary: "₹10-15 LPA",
                remote: false,
                posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                companyLogo: "fas fa-robot"
            },
            {
                id: 'job-3',
                title: "UI/UX Designer",
                company: "Design Studio Pro",
                location: "Remote",
                type: "contract",
                description: "Create beautiful and intuitive user experiences for web and mobile applications. Work with a talented design team on exciting projects.",
                requirements: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
                salary: "₹6-10 LPA",
                remote: true,
                posted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                companyLogo: "fas fa-palette"
            },
            {
                id: 'job-4',
                title: "Full Stack Developer Intern",
                company: "StartupXYZ",
                location: "Delhi, India",
                type: "internship",
                description: "6-month internship working on real projects with mentorship from senior developers. Perfect opportunity to learn and grow.",
                requirements: ["JavaScript", "Node.js", "MongoDB", "React", "Express"],
                salary: "₹25,000/month",
                remote: true,
                posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                companyLogo: "fas fa-rocket"
            },
            {
                id: 'job-5',
                title: "DevOps Engineer",
                company: "CloudTech Solutions",
                location: "Pune, India",
                type: "full-time",
                description: "Manage cloud infrastructure and CI/CD pipelines. Work with Docker, Kubernetes, and modern DevOps tools.",
                requirements: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
                salary: "₹12-18 LPA",
                remote: true,
                posted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                companyLogo: "fas fa-cloud"
            },
            {
                id: 'job-6',
                title: "Mobile App Developer",
                company: "AppCraft Solutions",
                location: "Chennai, India",
                type: "full-time",
                description: "Develop cross-platform mobile applications using React Native and Flutter. Create amazing mobile experiences.",
                requirements: ["React Native", "Flutter", "iOS", "Android", "Mobile Development"],
                salary: "₹8-14 LPA",
                remote: false,
                posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                companyLogo: "fas fa-mobile-alt"
            }
        ];

        // Apply filters
        let filteredJobs = [...jobTemplates];
        
        if (filters.type && filters.type !== '') {
            filteredJobs = filteredJobs.filter(job => job.type === filters.type);
        }
        
        if (filters.location && filters.location !== '' && filters.location !== 'remote') {
            filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase().includes(filters.location.toLowerCase()) || 
                job.remote
            );
        } else if (filters.location === 'remote') {
            filteredJobs = filteredJobs.filter(job => job.remote);
        }
        
        if (filters.skills && filters.skills.trim() !== '') {
            const skillsArray = filters.skills.toLowerCase().split(',').map(s => s.trim());
            filteredJobs = filteredJobs.filter(job => 
                job.requirements.some(req => 
                    skillsArray.some(skill => req.toLowerCase().includes(skill))
                )
            );
        }

        // Calculate match scores
        filteredJobs = filteredJobs.map(job => ({
            ...job,
            matchScore: this.calculateJobMatch(job, appState.userSkills)
        }));

        // Sort by match score
        filteredJobs.sort((a, b) => b.matchScore - a.matchScore);

        return filteredJobs;
    }

    // AI-powered job matching algorithm
    calculateJobMatch(job, userSkills) {
        if (!userSkills || userSkills.length === 0) {
            return Math.floor(Math.random() * 40) + 30; // Random score if no skills
        }
        
        const matchedSkills = job.requirements.filter(req => 
            userSkills.some(skill => 
                skill.toLowerCase().includes(req.toLowerCase()) || 
                req.toLowerCase().includes(skill.toLowerCase())
            )
        );
        
        const baseMatch = (matchedSkills.length / job.requirements.length) * 100;
        const bonus = Math.min(20, userSkills.length * 2); // Bonus for having more skills
        
        const finalScore = Math.min(98, Math.floor(baseMatch + bonus));
        return Math.max(30, finalScore); // Minimum 30% match
    }

    // Enhanced blockchain verification simulation
    async verifyCredential(credentialData) {
        console.log('⛓️ Starting blockchain verification for:', credentialData);
        
        return new Promise((resolve) => {
            // Simulate realistic transaction stages
            setTimeout(() => {
                console.log('📡 Broadcasting transaction to network...');
                this.updateVerificationStatus('Broadcasting transaction to network...');
            }, 500);
            
            setTimeout(() => {
                console.log('⚡ Transaction pending in mempool...');
                this.updateVerificationStatus('Transaction pending in mempool...');
            }, 1500);
            
            setTimeout(() => {
                console.log('⛏️ Transaction being mined...');
                this.updateVerificationStatus('Mining transaction in block...');
            }, 2500);
            
            setTimeout(() => {
                const transactionHash = this.generateTransactionHash();
                const verification = {
                    transactionHash: transactionHash,
                    blockNumber: Math.floor(Math.random() * 1000000) + 500000,
                    timestamp: new Date().toISOString(),
                    verified: true,
                    gasUsed: Math.floor(Math.random() * 100000) + 21000,
                    confirmations: Math.floor(Math.random() * 10) + 1,
                    networkFee: (Math.random() * 0.01).toFixed(6) + ' ETH',
                    validatorAddress: '0x' + Math.random().toString(16).substr(2, 40),
                    credentialType: credentialData.type || 'skill_assessment',
                    issuer: 'Learn2Earn Platform',
                    verificationLevel: this.calculateVerificationLevel(credentialData)
                };
                
                console.log('✅ Blockchain verification complete:', verification);
                resolve(verification);
            }, 4000);
        });
    }
    
    updateVerificationStatus(message) {
        const statusElement = document.getElementById('verification-status');
        if (statusElement) {
            statusElement.innerHTML = `
                <p><i class="fas fa-spinner fa-spin"></i> ${message}</p>
            `;
        }
    }
    
    calculateVerificationLevel(credentialData) {
        // Simulate different verification levels based on credential data
        if (credentialData.overallScore >= 90) return 'Gold';
        if (credentialData.overallScore >= 75) return 'Silver';
        if (credentialData.overallScore >= 60) return 'Bronze';
        return 'Basic';
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

// ===========================================
// PLATFORM CONNECTION FUNCTIONALITY
// ===========================================

// Enhanced platform connection with real GitHub integration
async function connectPlatform(platform) {
    if (platform === 'github') {
        await connectGitHubReal();
        return;
    }
    
    // Original simulation for other platforms
    console.log(`Connecting to ${platform}...`);
    
    // Platform-specific connection messages and URLs
    const platformData = {
        'kaggle': { 
            name: 'Kaggle - Data Science Competition Platform',
            url: 'https://www.kaggle.com'
        },
        'figma': { 
            name: 'Figma - Collaborative Design Tool',
            url: 'https://www.figma.com'
        },
        'behance': { 
            name: 'Behance - Creative Portfolio Platform',
            url: 'https://www.behance.net'
        },
        'linkedin': { 
            name: 'LinkedIn - Professional Network',
            url: 'https://www.linkedin.com'
        },
        'tableau': { 
            name: 'Tableau Public - Data Visualization',
            url: 'https://public.tableau.com'
        },
        'datastudio': { 
            name: 'Google Data Studio - Interactive Reports',
            url: 'https://datastudio.google.com'
        },
        'gitlab': { 
            name: 'GitLab - Git Repository Management',
            url: 'https://gitlab.com'
        },
        'stackoverflow': { 
            name: 'Stack Overflow - Developer Community',
            url: 'https://stackoverflow.com'
        },
        'hackerrank': { 
            name: 'HackerRank - Coding Challenges',
            url: 'https://www.hackerrank.com'
        },
        'aws': { 
            name: 'AWS/Azure - Cloud Repository Hosting',
            url: 'https://aws.amazon.com'
        },
        'dribbble': { 
            name: 'Dribbble - Design Community',
            url: 'https://dribbble.com'
        },
        'carbonmade': { 
            name: 'Carbonmade - Creative Portfolio Platform',
            url: 'https://carbonmade.com'
        }
    };
    
    setTimeout(() => {
        const statusElement = document.getElementById(`${platform}-status`);
        const buttonElement = statusElement?.parentElement;
        
        if (statusElement) {
            statusElement.textContent = 'Connected';
            statusElement.style.color = '#10b981';
            buttonElement?.classList.add('connected');
        }
        
        if (!appState.connectedPlatforms.includes(platform)) {
            appState.connectedPlatforms.push(platform);
        }
        
        fetchPlatformData(platform);
        updateProgressStats();
        
        const platformInfo = platformData[platform];
        const displayName = platformInfo?.name || platform.charAt(0).toUpperCase() + platform.slice(1);
        
        // Show success message and open platform homepage
        showNotification(`✅ Successfully connected to ${displayName}!`, 'success');
        
        // Open platform homepage in new tab
        if (platformInfo?.url) {
            window.open(platformInfo.url, '_blank');
        }
    }, 1000);
}

// Real GitHub connection
async function connectGitHubReal() {
    const username = prompt('🐙 Enter your GitHub username:');
    if (!username || username.trim() === '') return;
    
    try {
        // Show loading state
        const statusElement = document.getElementById('github-status');
        const buttonElement = statusElement?.parentElement;
        
        if (statusElement) {
            statusElement.textContent = 'Connecting...';
            statusElement.style.color = '#f59e0b';
            buttonElement?.classList.add('loading');
        }
        
        // Connect to real GitHub API
        const githubData = await skillForgeAPI.connectGitHub(username.trim());
        
        // Update UI
        if (statusElement) {
            statusElement.textContent = 'Connected';
            statusElement.style.color = '#10b981';
            buttonElement?.classList.remove('loading');
            buttonElement?.classList.add('connected');
        }
        
        // Add to connected platforms
        if (!appState.connectedPlatforms.includes('github')) {
            appState.connectedPlatforms.push('github');
        }
        
        updateProgressStats();
        
        alert(`✅ Successfully connected to GitHub!\n\n👤 Profile: ${githubData.profile.name}\n📁 Repositories: ${githubData.repositories.length}\n🌟 Total Stars: ${githubData.repositories.reduce((sum, repo) => sum + repo.stars, 0)}`);
        
    } catch (error) {
        const statusElement = document.getElementById('github-status');
        if (statusElement) {
            statusElement.textContent = 'Error';
            statusElement.style.color = '#ef4444';
        }
        console.error('GitHub connection error:', error);
        alert(`❌ Error connecting to GitHub:\n${error.message}\n\nPlease check the username and try again.`);
    }
}

// Simulate fetching data from connected platforms
function fetchPlatformData(platform) {
    console.log(`Fetching data from ${platform}...`);
    
    const mockData = {
        behance: {
            projects: ['Brand Identity Design', 'UI/UX Portfolio', 'Illustration Series'],
            skills: ['Graphic Design', 'UI/UX', 'Illustration', 'Adobe Creative Suite']
        },
        linkedin: {
            experience: ['Software Developer at TechCorp', 'Intern at StartupXYZ'],
            skills: ['Project Management', 'Team Leadership', 'Communication', 'Strategy']
        }
    };
    
    if (mockData[platform]) {
        appState.portfolioItems.push({
            platform: platform,
            data: mockData[platform]
        });
        
        // Add skills to user skills
        if (mockData[platform].skills) {
            appState.userSkills = [...appState.userSkills, ...mockData[platform].skills];
            appState.userSkills = [...new Set(appState.userSkills)];
        }
    }
    
    updateProgressStats();
}

// ===========================================
// PROGRESS TRACKING
// ===========================================

function updateProgressStats() {
    const completionPercentage = Math.min((appState.connectedPlatforms.length / 3) * 100, 100);
    const progressFill = document.querySelector('.progress-fill');
    
    if (progressFill) {
        progressFill.style.width = `${completionPercentage}%`;
    }
    
    // Update completion text
    const completionText = document.querySelector('.stat span');
    if (completionText) {
        completionText.textContent = `${Math.round(completionPercentage)}%`;
    }
    
    // Update skills count
    const skillsCountElement = document.querySelector('.stat:nth-child(2) span');
    if (skillsCountElement) {
        const verifiedCount = Math.floor(appState.userSkills.length / 2); // Simulate some verified skills
        skillsCountElement.textContent = `${verifiedCount}/${appState.userSkills.length}`;
        
        const skillsProgressBar = document.querySelector('.stat:nth-child(2) .progress-fill');
        if (skillsProgressBar && appState.userSkills.length > 0) {
            skillsProgressBar.style.width = `${(verifiedCount / appState.userSkills.length) * 100}%`;
        }
    }
}

// ===========================================
// SKILL ASSESSMENT FUNCTIONALITY
// ===========================================

function startSkillTest() {
    alert('🧠 Starting AI-powered skill assessment in SkillForge...');
    
    setTimeout(() => {
        const availableSkills = appState.userSkills.length > 0 ? appState.userSkills : 
            ['JavaScript', 'Python', 'Design Thinking', 'Project Management', 'React', 'Node.js'];
        
        const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        const questions = generateSkillQuestions(randomSkill);
        displaySkillTest(randomSkill, questions);
    }, 500);
}

function generateSkillQuestions(skill) {
    const questionBank = {
        'JavaScript': [
            'What is the difference between let and var in JavaScript?',
            'How do you handle asynchronous operations in JavaScript?',
            'Explain the concept of closures in JavaScript.',
            'What are the different ways to create objects in JavaScript?'
        ],
        'Python': [
            'What are the key differences between lists and tuples in Python?',
            'How do you handle exceptions in Python?',
            'Explain the concept of decorators in Python.',
            'What is the difference between is and == in Python?'
        ],
        'React': [
            'What is the virtual DOM and how does it work?',
            'Explain the difference between class components and functional components.',
            'How do you manage state in React?',
            'What are React hooks and why are they useful?'
        ],
        'Node.js': [
            'What is the event loop in Node.js?',
            'How do you handle asynchronous operations in Node.js?',
            'What is middleware in Express.js?',
            'How do you manage dependencies in a Node.js project?'
        ],
        'Design Thinking': [
            'What are the five stages of the design thinking process?',
            'How do you conduct effective user research?',
            'What is the importance of prototyping in design?',
            'How do you define user personas?'
        ],
        'Project Management': [
            'What are the key phases of project management?',
            'How do you handle scope creep in projects?',
            'What tools do you use for project tracking?',
            'How do you manage stakeholder expectations?'
        ]
    };
    
    return questionBank[skill] || [
        `What is your experience with ${skill}?`,
        `How would you explain ${skill} to a beginner?`,
        `What are the best practices for ${skill}?`
    ];
}

function displaySkillTest(skill, questions) {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const testHTML = `
        <div class="skill-test-overlay">
            <div class="skill-test-modal">
                <div class="test-header">
                    <h3>SkillForge Assessment: ${skill}</h3>
                    <p>This assessment will help verify your ${skill} skills</p>
                </div>
                <div class="question-container">
                    <p><strong>Question:</strong> ${randomQuestion}</p>
                    <textarea id="skill-answer" placeholder="Type your detailed answer here..." rows="6"></textarea>
                    <div class="question-tips">
                        <small>💡 Tip: Provide specific examples and demonstrate your understanding</small>
                    </div>
                </div>
                <div class="test-actions">
                    <button class="btn-secondary" onclick="closeSkillTest()">Cancel</button>
                    <button class="btn-primary" onclick="submitSkillTest('${skill}')">Submit Answer</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', testHTML);
    
    // Focus on textarea
    setTimeout(() => {
        document.getElementById('skill-answer')?.focus();
    }, 100);
}

function submitSkillTest(skill) {
    const answer = document.getElementById('skill-answer')?.value.trim();
    
    if (!answer) {
        alert('⚠️ Please provide an answer before submitting.');
        return;
    }
    
    alert(`🎯 Skill test for ${skill} submitted successfully!\n\nSkillForge AI is analyzing your response...\nResults will be available in your dashboard shortly.`);
    closeSkillTest();
    
    // Simulate processing and update verification status
    setTimeout(() => {
        const verifiedSkills = document.querySelector('.stat:nth-child(2) span');
        if (verifiedSkills) {
            const currentText = verifiedSkills.textContent;
            const [current, total] = currentText.split('/').map(n => parseInt(n));
            const newCurrent = Math.min(current + 1, total);
            verifiedSkills.textContent = `${newCurrent}/${total}`;
            
            const progressBar = document.querySelector('.stat:nth-child(2) .progress-fill');
            if (progressBar && total > 0) {
                progressBar.style.width = `${(newCurrent / total) * 100}%`;
            }
        }
        
        // Show success notification
        showNotification(`✅ ${skill} skill verified successfully!`, 'success');
    }, 2000);
}

function closeSkillTest() {
    const overlay = document.querySelector('.skill-test-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// ===========================================
// BLOCKCHAIN VERIFICATION
// ===========================================

async function startVerification() {
    const statusDiv = document.getElementById('verification-status');
    if (!statusDiv) return;
    
    statusDiv.style.display = 'block';
    statusDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Initiating blockchain verification...</p>';
    
    try {
        // Simulate credential data
        const credentialData = {
            type: 'skill_verification',
            value: appState.userSkills.join(', '),
            timestamp: new Date().toISOString(),
            platforms: appState.connectedPlatforms
        };
        
        // Start blockchain verification
        const verification = await skillForgeAPI.verifyCredential(credentialData);
        
        statusDiv.innerHTML = `
            <div class="verification-success">
                <p style="color: #10b981; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i> 
                    Verification complete! Your credentials are now blockchain-verified.
                </p>
                <div class="verification-details">
                    <p><strong>Transaction Hash:</strong> <code>${verification.hash}</code></p>
                    <p><strong>Block Number:</strong> ${verification.blockNumber}</p>
                    <p><strong>Timestamp:</strong> ${new Date(verification.timestamp).toLocaleString()}</p>
                    <p><strong>Verified Skills:</strong> ${appState.userSkills.length} skills</p>
                </div>
                <button class="btn-small" onclick="copyVerificationHash('${verification.hash}')">
                    <i class="fas fa-copy"></i> Copy Hash
                </button>
            </div>
        `;
        
        appState.verificationStatus = 'verified';
        showNotification('🔗 Blockchain verification completed!', 'success');
        
    } catch (error) {
        console.error('Verification error:', error);
        statusDiv.innerHTML = `
            <p style="color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i> 
                Verification failed. Please try again later.
            </p>
        `;
    }
}

function copyVerificationHash(hash) {
    navigator.clipboard.writeText(hash).then(() => {
        showNotification('📋 Transaction hash copied to clipboard!', 'info');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = hash;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('📋 Transaction hash copied!', 'info');
    });
}

// ===========================================
// NOTIFICATION SYSTEM
// ===========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===========================================
// JOBS FUNCTIONALITY (Enhanced)
// ===========================================

async function filterJobs() {
    const jobType = document.getElementById('job-type-filter')?.value || '';
    const location = document.getElementById('location-filter')?.value || '';
    const skills = document.getElementById('skills-filter')?.value || '';
    
    console.log('🔍 Filtering jobs with AI matching:', { jobType, location, skills });
    
    try {
        // Show loading state
        const searchButton = document.querySelector('.jobs-filters .btn-primary');
        if (searchButton) {
            const originalText = searchButton.innerHTML;
            searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI Matching...';
            searchButton.disabled = true;
        }
        
        // Fetch jobs with AI matching
        const jobs = await skillForgeAPI.generateRealisticJobs({
            type: jobType,
            location: location,
            skills: skills
        });
        
        // Update job display
        renderFilteredJobs(jobs);
        updateJobStats(jobs);
        
        // Restore button
        if (searchButton) {
            searchButton.innerHTML = '<i class="fas fa-search"></i> Search Jobs';
            searchButton.disabled = false;
        }
        
        showNotification(`🎯 Found ${jobs.length} jobs with AI matching!`, 'success');
        
    } catch (error) {
        console.error('Error filtering jobs:', error);
        showNotification('❌ Error fetching jobs. Please try again.', 'error');
    }
}

function renderFilteredJobs(jobs) {
    console.log(`📋 Rendering ${jobs.length} AI-matched jobs`);
    
    // For now, just show an alert with job summary
    const perfectMatches = jobs.filter(job => job.matchScore >= 80);
    const goodMatches = jobs.filter(job => job.matchScore >= 60 && job.matchScore < 80);
    
    alert(`🤖 AI Job Matching Results:\n\n⭐ Perfect Matches (80%+): ${perfectMatches.length}\n✅ Good Matches (60-79%): ${goodMatches.length}\n📊 Total Jobs Found: ${jobs.length}\n\nTop Match: ${jobs[0]?.title} at ${jobs[0]?.company} (${jobs[0]?.matchScore}% match)`);
}

function updateJobStats(jobs = []) {
    const perfectMatches = jobs.filter(job => job.matchScore >= 80).length;
    const avgMatchRate = jobs.length > 0 ? Math.round(jobs.reduce((sum, job) => sum + job.matchScore, 0) / jobs.length) : 85;
    const newToday = jobs.filter(job => {
        const daysDiff = (new Date() - new Date(job.posted)) / (1000 * 60 * 60 * 24);
        return daysDiff <= 1;
    }).length;
    
    // Update DOM if elements exist
    const statItems = document.querySelectorAll('.stat-item strong');
    if (statItems.length >= 3) {
        statItems[0].textContent = perfectMatches || Math.floor(Math.random() * 15) + 5;
        statItems[1].textContent = avgMatchRate + '%';
        statItems[2].textContent = newToday || Math.floor(Math.random() * 8) + 2;
    }
}

// ===========================================
// PORTFOLIO FUNCTIONALITY
// ===========================================

function connectProfiles() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-link"></i> Connect your Profiles</h3>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <p>Link your existing accounts to showcase your work and import projects automatically.</p>
                <div class="integration-buttons">
                    <button class="integration-btn" onclick="connectPlatform('kaggle')">
                        <i class="fab fa-kaggle"></i>
                        <div>
                            <strong>Kaggle</strong>
                            <p>Data science competitions and notebooks</p>
                        </div>
                        <span class="status" id="kaggle-status">Connect</span>
                    </button>
                    <button class="integration-btn" onclick="connectPlatform('github')">
                        <i class="fab fa-github"></i>
                        <div>
                            <strong>GitHub</strong>
                            <p>Repository management and code sharing</p>
                        </div>
                        <span class="status" id="github-status">Connect</span>
                    </button>
                    <button class="integration-btn" onclick="connectPlatform('figma')">
                        <i class="fab fa-figma"></i>
                        <div>
                            <strong>Figma</strong>
                            <p>Collaborative design tool for UI/UX work</p>
                        </div>
                        <span class="status" id="figma-status">Connect</span>
                    </button>
                                                <button class="integration-btn" onclick="connectPlatform('behance')">
                        <i class="fab fa-behance"></i>
                        <div>
                            <strong>Behance</strong>
                            <p>Creative portfolios and designs</p>
                        </div>
                        <span class="status" id="behance-status">Connect</span>
                    </button>
                    
                    <!-- More Platforms Dropdown -->
                    <div class="more-platforms">
                        <button class="integration-btn more-btn" onclick="toggleMorePlatforms()">
                            <i class="fas fa-ellipsis-h"></i>
                            <div>
                                <strong>More</strong>
                            </div>
                            <span class="more-indicator">
                                <i class="fas fa-chevron-down"></i>
                            </span>
                        </button>
                        <div class="more-platforms-dropdown" id="more-platforms-dropdown">
                            <button class="integration-btn" onclick="connectPlatform('linkedin')">
                                <i class="fab fa-linkedin"></i>
                                <div>
                                    <strong>LinkedIn</strong>
                                </div>
                                <span class="status" id="linkedin-status">Connect</span>
                            </button>
                            <button class="integration-btn" onclick="connectPlatform('tableau')">
                                <i class="fas fa-chart-bar"></i>
                                <div>
                                    <strong>Tableau Public</strong>
                                </div>
                                <span class="status" id="tableau-status">Connect</span>
                            </button>
                            <button class="integration-btn" onclick="connectPlatform('datastudio')">
                                <i class="fas fa-chart-line"></i>
                                <div>
                                    <strong>Google Data Studio</strong>
                                </div>
                                <span class="status" id="datastudio-status">Connect</span>
                            </button>
                            <button class="integration-btn" onclick="connectPlatform('gitlab')">
                                <i class="fab fa-gitlab"></i>
                                <div>
                                    <strong>GitLab</strong>
                                </div>
                                <span class="status" id="gitlab-status">Connect</span>
                            </button>
                            <button class="integration-btn" onclick="connectPlatform('stackoverflow')">
                                <i class="fab fa-stack-overflow"></i>
                                <div>
                                    <strong>Stack Overflow</strong>
                                </div>
                                <span class="status" id="stackoverflow-status">Connect</span>
                            </button>
                            <button class="integration-btn" onclick="connectPlatform('hackerrank')">
                                <i class="fas fa-code"></i>
                                <div>
                                    <strong>HackerRank</strong>
                                </div>
                                <span class="status" id="hackerrank-status">Connect</span>
                            </button>
                            <button class="integration-btn" onclick="connectPlatform('aws')">
                                <i class="fab fa-aws"></i>
                                <div>
                                    <strong>AWS/Azure Repositories</strong>
                                </div>
                                <span class="status" id="aws-status">Connect</span>
                            </button>
                            <button class="integration-btn" onclick="connectPlatform('dribbble')">
                                <i class="fab fa-dribbble"></i>
                                <div>
                                    <strong>Dribbble</strong>
                                </div>
                                <span class="status" id="dribbble-status">Connect</span>
                            </button>
                            <button class="integration-btn" onclick="connectPlatform('carbonmade')">
                                <i class="fas fa-palette"></i>
                                <div>
                                    <strong>Carbonmade</strong>
                                </div>
                                <span class="status" id="carbonmade-status">Connect</span>
                            </button>
                        </div>
                    </div>
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

function closeModal(button) {
    const modal = button.closest('.modal');
    modal.classList.remove('show');
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

function toggleMorePlatforms() {
    const dropdown = document.getElementById('more-platforms-dropdown');
    const moreBtn = document.querySelector('.more-btn');
    const indicator = moreBtn.querySelector('.more-indicator i');
    
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
        indicator.classList.remove('fa-chevron-down');
        indicator.classList.add('fa-chevron-up');
        moreBtn.querySelector('strong').textContent = 'Less Platforms';
    } else {
        dropdown.style.display = 'none';
        indicator.classList.remove('fa-chevron-up');
        indicator.classList.add('fa-chevron-down');
        moreBtn.querySelector('strong').textContent = 'More';
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && mobileToggle) {
        const isActive = navLinks.classList.contains('active');
        
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (!isActive) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            
            // Add backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'mobile-menu-backdrop';
            backdrop.onclick = closeMobileMenu;
            document.body.appendChild(backdrop);
            
            // Announce to screen readers
            navLinks.setAttribute('aria-expanded', 'true');
            mobileToggle.setAttribute('aria-expanded', 'true');
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            
            // Remove backdrop
            const backdrop = document.querySelector('.mobile-menu-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            
            // Announce to screen readers
            navLinks.setAttribute('aria-expanded', 'false');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

// Close mobile menu function
function closeMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && mobileToggle && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        
        // Remove backdrop
        const backdrop = document.querySelector('.mobile-menu-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        
        // Announce to screen readers
        navLinks.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }
}

function sharePortfolio() {
    const portfolioUrl = window.location.origin + '/pages/portfolio.html';
    
    // Create share options modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-share"></i> Share Portfolio</h3>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <p class="modal-description">Choose how you'd like to share your portfolio:</p>
                <div class="share-options">
                    <button class="share-option-btn" onclick="copyPortfolioLink()">
                        <i class="fas fa-link"></i>
                        <div>
                            <strong>Copy Link</strong>
                            <p>Copy portfolio link to clipboard</p>
                        </div>
                    </button>
                    <button class="share-option-btn" onclick="sendPortfolioEmail()">
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

function copyPortfolioLink() {
    const portfolioUrl = window.location.origin + '/pages/portfolio.html';
    
    navigator.clipboard.writeText(portfolioUrl).then(() => {
        showNotification('📋 Portfolio link copied to clipboard!', 'success');
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
        alert(`📋 Portfolio URL:\n${portfolioUrl}\n\nCopy this link to share your portfolio!`);
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

function sendPortfolioEmail() {
    const portfolioUrl = window.location.origin + '/pages/portfolio.html';
    const subject = encodeURIComponent('My TalentVault Portfolio');
    const body = encodeURIComponent(`Hey there!\n\nPlease checkout my TalentVault portfolio!\n\n${portfolioUrl}`);
    
    // Open Gmail compose with the portfolio link
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

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SkillForge Platform Initialized - Ready to forge your career!');
    
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize based on current page
    initializePage();
    
    // Set up global event listeners
    setupGlobalEventListeners();
});

function setupGlobalEventListeners() {
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    
    // Add accessibility attributes
    if (mobileToggle) {
        mobileToggle.setAttribute('aria-label', 'Toggle mobile menu');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }
    
    if (navLinksContainer) {
        navLinksContainer.setAttribute('aria-expanded', 'false');
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinksContainer && mobileToggle && 
            navLinksContainer.classList.contains('active') &&
            !event.target.closest('.nav-links') && 
            !event.target.closest('.mobile-menu-toggle') &&
            !event.target.closest('.mobile-menu-backdrop')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navLinksContainer && 
            navLinksContainer.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }
    });
    
    // Touch event improvements for mobile
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(event) {
        touchStartY = event.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(event) {
        if (navLinksContainer && navLinksContainer.classList.contains('active')) {
            const touchY = event.touches[0].clientY;
            const deltaY = touchY - touchStartY;
            
            // Close menu if user swipes up significantly
            if (deltaY < -100) {
                closeMobileMenu();
            }
        }
    });
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Enhanced Modal Styles */
        .skill-test-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .skill-test-modal {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.3s ease
        }
        
        .question-container {
            margin: 1.5rem 0;
        }
        
        .question-container textarea {
            width: 100%;
            margin-top: 1rem;
            padding: 1rem;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-family: inherit;
        }
        
        .test-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .progress-stats {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .stat h4 {
            margin-bottom: 0.5rem;
            color: #1e293b;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }
        
        .progress-fill {
            height: 100%;
            background: #4f46e5;
            transition: width 0.3s ease;
        }
        
        .verification-section {
            margin-top: 1rem;
        }
        
        .verification-status {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
        }
    `;
    document.head.appendChild(style);
};

// Profile sharing functionality (used on dashboard)
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
    const subject = encodeURIComponent(`Mark - TalentVault Profile`);
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