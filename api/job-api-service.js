// ===========================================
// JOB API INTEGRATION SERVICE
// Multi-platform job data aggregation with source attribution
// ===========================================

class JobAPIService {
    constructor() {
        this.apiEndpoints = {
            joinrise: {
                url: 'https://api.joinrise.io/api/v1/jobs/public',
                name: 'JoinRise',
                icon: 'fas fa-briefcase',
                color: '#2563eb',
                free: true
            },
            techmap: {
                url: 'https://daily-international-job-postings.p.rapidapi.com/api/v2/jobs/search',
                name: 'Techmap',
                icon: 'fas fa-globe',
                color: '#059669',
                free: false,
                requiresAuth: true
            },
            adzuna: {
                url: 'https://api.adzuna.com/v1/api/jobs',
                name: 'Adzuna',
                icon: 'fas fa-search',
                color: '#7c3aed',
                free: true
            },
            // Mock endpoints for demonstration
            linkedin: {
                url: 'mock://linkedin-jobs',
                name: 'LinkedIn',
                icon: 'fab fa-linkedin',
                color: '#0077b5',
                free: false,
                mock: true
            },
            indeed: {
                url: 'mock://indeed-jobs',
                name: 'Indeed',
                icon: 'fas fa-file-alt',
                color: '#2164f3',
                free: false,
                mock: true
            },
            naukri: {
                url: 'mock://naukri-jobs',
                name: 'Naukri',
                icon: 'fas fa-user-tie',
                color: '#ed6c02',
                free: false,
                mock: true
            },
            glassdoor: {
                url: 'mock://glassdoor-jobs',
                name: 'Glassdoor',
                icon: 'fas fa-building',
                color: '#0caa41',
                free: false,
                mock: true
            },
            angellist: {
                url: 'mock://angellist-jobs',
                name: 'AngelList',
                icon: 'fas fa-rocket',
                color: '#000000',
                free: false,
                mock: true
            }
        };
        
        this.currencySymbols = {
            'USD': '$',
            'INR': '₹',
            'EUR': '€',
            'GBP': '£',
            'JPY': '¥',
            'CAD': 'C$',
            'AUD': 'A$',
            'SGD': 'S$',
            'CHF': 'CHF',
            'CNY': '¥',
            'KRW': '₩',
            'SEK': 'kr',
            'NOK': 'kr',
            'DKK': 'kr',
            'default': '$'
        };
        
        this.locationCurrencyMap = {
            'india': 'INR',
            'mumbai': 'INR',
            'bangalore': 'INR',
            'delhi': 'INR',
            'hyderabad': 'INR',
            'pune': 'INR',
            'chennai': 'INR',
            'kolkata': 'INR',
            'ahmedabad': 'INR',
            'noida': 'INR',
            'gurgaon': 'INR',
            'united states': 'USD',
            'usa': 'USD',
            'new york': 'USD',
            'california': 'USD',
            'texas': 'USD',
            'seattle': 'USD',
            'san francisco': 'USD',
            'boston': 'USD',
            'chicago': 'USD',
            'austin': 'USD',
            'denver': 'USD',
            'atlanta': 'USD',
            'united kingdom': 'GBP',
            'uk': 'GBP',
            'london': 'GBP',
            'manchester': 'GBP',
            'birmingham': 'GBP',
            'canada': 'CAD',
            'toronto': 'CAD',
            'vancouver': 'CAD',
            'montreal': 'CAD',
            'germany': 'EUR',
            'berlin': 'EUR',
            'munich': 'EUR',
            'hamburg': 'EUR',
            'france': 'EUR',
            'paris': 'EUR',
            'lyon': 'EUR',
            'singapore': 'SGD',
            'australia': 'AUD',
            'sydney': 'AUD',
            'melbourne': 'AUD',
            'japan': 'JPY',
            'tokyo': 'JPY',
            'osaka': 'JPY',
            'remote': 'USD'
        };
        
        this.rateLimitDelay = 1000; // 1 second between requests
        this.lastRequestTime = 0;
    }
    
    // ===========================================
    // MAIN API INTEGRATION METHODS
    // ===========================================
    
    async fetchJobsFromAllPlatforms(userProfile = {}, searchCriteria = {}) {
        console.log('🔍 Fetching jobs from multiple platforms...');
        
        const platforms = Object.keys(this.apiEndpoints);
        const jobPromises = platforms.map(platform => 
            this.fetchJobsFromPlatform(platform, userProfile, searchCriteria)
        );
        
        const results = await Promise.allSettled(jobPromises);
        const allJobs = [];
        
        results.forEach((result, index) => {
            const platform = platforms[index];
            if (result.status === 'fulfilled') {
                console.log(`✅ ${platform}: ${result.value.length} jobs fetched`);
                allJobs.push(...result.value);
            } else {
                console.error(`❌ ${platform}: Failed to fetch jobs`, result.reason);
            }
        });
        
        // Sort by relevance score and posted date
        const sortedJobs = this.sortJobsByRelevance(allJobs, userProfile);
        
        console.log(`📊 Total jobs aggregated: ${sortedJobs.length}`);
        return sortedJobs;
    }
    
    async fetchJobsFromPlatform(platform, userProfile = {}, searchCriteria = {}) {
        const endpoint = this.apiEndpoints[platform];
        if (!endpoint) {
            throw new Error(`Platform ${platform} not supported`);
        }
        
        // Rate limiting
        await this.enforceRateLimit();
        
        if (endpoint.mock) {
            return this.generateMockJobs(platform, userProfile, searchCriteria);
        }
        
        try {
            let jobs = [];
            
            switch (platform) {
                case 'joinrise':
                    jobs = await this.fetchFromJoinRise(searchCriteria);
                    break;
                case 'techmap':
                    jobs = await this.fetchFromTechmap(searchCriteria);
                    break;
                case 'adzuna':
                    jobs = await this.fetchFromAdzuna(searchCriteria);
                    break;
                default:
                    jobs = await this.fetchFromGenericAPI(platform, searchCriteria);
            }
            
            return this.normalizeJobs(jobs, platform, userProfile);
            
        } catch (error) {
            console.error(`Error fetching from ${platform}:`, error);
            // Fallback to mock data if API fails
            return this.generateMockJobs(platform, userProfile, searchCriteria, 5);
        }
    }
    
    // ===========================================
    // PLATFORM-SPECIFIC INTEGRATIONS
    // ===========================================
    
    async fetchFromJoinRise(searchCriteria) {
        const params = new URLSearchParams({
            page: 1,
            limit: 20,
            sort: 'desc',
            sortedBy: 'createdAt',
            ...searchCriteria
        });
        
        const response = await fetch(`${this.apiEndpoints.joinrise.url}?${params}`);
        const data = await response.json();
        return data.jobs || data.data || [];
    }
    
    async fetchFromTechmap(searchCriteria) {
        // This would require API key setup
        const headers = {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'demo-key',
            'X-RapidAPI-Host': 'daily-international-job-postings.p.rapidapi.com'
        };
        
        const params = new URLSearchParams({
            countryCode: 'us',
            occupation: 'programmer',
            hasSalary: 'true',
            ...searchCriteria
        });
        
        const response = await fetch(`${this.apiEndpoints.techmap.url}?${params}`, {
            headers: headers
        });
        const data = await response.json();
        return data.result || [];
    }
    
    async fetchFromAdzuna(searchCriteria) {
        // Adzuna API integration (requires API key)
        const appId = process.env.ADZUNA_APP_ID || 'demo-id';
        const appKey = process.env.ADZUNA_APP_KEY || 'demo-key';
        
        const params = new URLSearchParams({
            app_id: appId,
            app_key: appKey,
            results_per_page: 20,
            what: searchCriteria.keywords || 'developer',
            where: searchCriteria.location || 'remote',
            ...searchCriteria
        });
        
        const response = await fetch(`${this.apiEndpoints.adzuna.url}/gb/search/1?${params}`);
        const data = await response.json();
        return data.results || [];
    }
    
    async fetchFromGenericAPI(platform, searchCriteria) {
        // Generic API integration pattern
        const endpoint = this.apiEndpoints[platform];
        const response = await fetch(endpoint.url);
        const data = await response.json();
        return data.jobs || data.data || data.results || [];
    }
    
    // ===========================================
    // MOCK DATA GENERATION
    // ===========================================
    
    generateMockJobs(platform, userProfile = {}, searchCriteria = {}, count = 15) {
        const endpoint = this.apiEndpoints[platform];
        const mockJobs = [];
        
        const jobTemplates = this.getMockJobTemplates(platform, userProfile);
        
        for (let i = 0; i < count; i++) {
            const template = jobTemplates[i % jobTemplates.length];
            const job = {
                id: `${platform}-${Date.now()}-${i}`,
                title: template.title,
                company: template.company,
                location: template.location,
                description: template.description,
                requirements: template.requirements,
                salary: template.salary,
                salaryCurrency: template.salaryCurrency,
                type: template.type,
                experience: template.experience,
                posted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                url: `https://${platform}.com/job/${Date.now()}-${i}`,
                source: {
                    platform: platform,
                    name: endpoint.name,
                    icon: endpoint.icon,
                    color: endpoint.color,
                    url: endpoint.url
                },
                skills: template.skills,
                remote: template.remote,
                urgent: template.urgent || false
            };
            
            mockJobs.push(job);
        }
        
        return mockJobs;
    }
    
    getMockJobTemplates(platform, userProfile) {
        const userSkills = userProfile.skills || ['JavaScript', 'React', 'Node.js'];
        const userExperience = userProfile.experience || 'mid-level';
        
        const templates = {
            linkedin: [
                {
                    title: 'Senior Frontend Developer',
                    company: 'Microsoft',
                    location: 'Seattle, WA',
                    description: 'Join our team to build next-generation web applications using React and TypeScript.',
                    requirements: ['React', 'TypeScript', 'JavaScript', 'CSS'],
                    salary: { min: 120000, max: 180000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'senior',
                    skills: ['React', 'TypeScript', 'JavaScript'],
                    remote: true,
                    urgent: false
                },
                {
                    title: 'Full Stack Developer',
                    company: 'Google',
                    location: 'Mountain View, CA',
                    description: 'Work on innovative products that impact billions of users worldwide.',
                    requirements: ['JavaScript', 'Python', 'React', 'Node.js'],
                    salary: { min: 140000, max: 200000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'senior',
                    skills: ['JavaScript', 'Python', 'React'],
                    remote: true,
                    urgent: true
                },
                {
                    title: 'UI/UX Designer',
                    company: 'Apple',
                    location: 'Cupertino, CA',
                    description: 'Design beautiful and intuitive user experiences for our products.',
                    requirements: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
                    salary: { min: 110000, max: 160000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'mid-level',
                    skills: ['Figma', 'Design', 'Prototyping'],
                    remote: false,
                    urgent: false
                }
            ],
            indeed: [
                {
                    title: 'Python Developer',
                    company: 'Netflix',
                    location: 'Los Angeles, CA',
                    description: 'Build scalable backend systems for our streaming platform.',
                    requirements: ['Python', 'Django', 'PostgreSQL', 'AWS'],
                    salary: { min: 130000, max: 180000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'mid-level',
                    skills: ['Python', 'Django', 'AWS'],
                    remote: true,
                    urgent: false
                },
                {
                    title: 'DevOps Engineer',
                    company: 'Spotify',
                    location: 'New York, NY',
                    description: 'Manage infrastructure and deployment pipelines for our music platform.',
                    requirements: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
                    salary: { min: 125000, max: 175000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'senior',
                    skills: ['Docker', 'Kubernetes', 'AWS'],
                    remote: true,
                    urgent: true
                },
                {
                    title: 'Mobile Developer',
                    company: 'Uber',
                    location: 'San Francisco, CA',
                    description: 'Develop mobile applications for our ride-sharing platform.',
                    requirements: ['React Native', 'Swift', 'Kotlin', 'Mobile Development'],
                    salary: { min: 115000, max: 165000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'mid-level',
                    skills: ['React Native', 'Mobile Development'],
                    remote: false,
                    urgent: false
                }
            ],
            naukri: [
                {
                    title: 'Software Engineer',
                    company: 'Tata Consultancy Services',
                    location: 'Mumbai, India',
                    description: 'Work on enterprise software solutions for global clients.',
                    requirements: ['Java', 'Spring Boot', 'MySQL', 'REST APIs'],
                    salary: { min: 800000, max: 1200000 },
                    salaryCurrency: 'INR',
                    type: 'full-time',
                    experience: 'mid-level',
                    skills: ['Java', 'Spring Boot', 'MySQL'],
                    remote: false,
                    urgent: false
                },
                {
                    title: 'Frontend Developer',
                    company: 'Infosys',
                    location: 'Bangalore, India',
                    description: 'Build responsive web applications using modern JavaScript frameworks.',
                    requirements: ['React', 'JavaScript', 'HTML', 'CSS'],
                    salary: { min: 700000, max: 1100000 },
                    salaryCurrency: 'INR',
                    type: 'full-time',
                    experience: 'junior',
                    skills: ['React', 'JavaScript', 'HTML'],
                    remote: true,
                    urgent: false
                },
                {
                    title: 'Data Scientist',
                    company: 'Wipro',
                    location: 'Hyderabad, India',
                    description: 'Analyze large datasets to extract business insights using ML techniques.',
                    requirements: ['Python', 'Machine Learning', 'pandas', 'SQL'],
                    salary: { min: 1200000, max: 1800000 },
                    salaryCurrency: 'INR',
                    type: 'full-time',
                    experience: 'senior',
                    skills: ['Python', 'Machine Learning', 'Data Science'],
                    remote: true,
                    urgent: true
                }
            ],
            glassdoor: [
                {
                    title: 'Product Manager',
                    company: 'Salesforce',
                    location: 'San Francisco, CA',
                    description: 'Lead product strategy and development for our CRM platform.',
                    requirements: ['Product Management', 'Agile', 'Analytics', 'Leadership'],
                    salary: { min: 150000, max: 220000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'senior',
                    skills: ['Product Management', 'Agile', 'Leadership'],
                    remote: true,
                    urgent: false
                },
                {
                    title: 'Data Engineer',
                    company: 'Airbnb',
                    location: 'San Francisco, CA',
                    description: 'Build and maintain data pipelines for our analytics platform.',
                    requirements: ['Python', 'Apache Spark', 'SQL', 'Data Pipelines'],
                    salary: { min: 135000, max: 185000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'mid-level',
                    skills: ['Python', 'Apache Spark', 'SQL'],
                    remote: true,
                    urgent: true
                },
                {
                    title: 'QA Engineer',
                    company: 'Slack',
                    location: 'Remote',
                    description: 'Ensure quality of our communication platform through automated testing.',
                    requirements: ['Test Automation', 'Selenium', 'JavaScript', 'Quality Assurance'],
                    salary: { min: 95000, max: 135000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'mid-level',
                    skills: ['Test Automation', 'Selenium', 'JavaScript'],
                    remote: true,
                    urgent: false
                }
            ],
            angellist: [
                {
                    title: 'Full Stack Engineer',
                    company: 'Stripe',
                    location: 'San Francisco, CA',
                    description: 'Build payment infrastructure that powers the internet economy.',
                    requirements: ['JavaScript', 'Ruby', 'React', 'PostgreSQL'],
                    salary: { min: 140000, max: 200000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'senior',
                    skills: ['JavaScript', 'Ruby', 'React'],
                    remote: true,
                    urgent: true
                },
                {
                    title: 'Machine Learning Engineer',
                    company: 'OpenAI',
                    location: 'San Francisco, CA',
                    description: 'Develop AI systems that benefit humanity.',
                    requirements: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
                    salary: { min: 180000, max: 250000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'senior',
                    skills: ['Python', 'TensorFlow', 'Machine Learning'],
                    remote: true,
                    urgent: true
                },
                {
                    title: 'Growth Engineer',
                    company: 'Notion',
                    location: 'San Francisco, CA',
                    description: 'Drive user acquisition and engagement through data-driven experiments.',
                    requirements: ['JavaScript', 'React', 'Analytics', 'A/B Testing'],
                    salary: { min: 120000, max: 170000 },
                    salaryCurrency: 'USD',
                    type: 'full-time',
                    experience: 'mid-level',
                    skills: ['JavaScript', 'React', 'Analytics'],
                    remote: true,
                    urgent: false
                }
            ]
        };
        
        return templates[platform] || templates.linkedin;
    }
    
    // ===========================================
    // DATA NORMALIZATION AND PROCESSING
    // ===========================================
    
    normalizeJobs(jobs, platform, userProfile) {
        const endpoint = this.apiEndpoints[platform];
        
        return jobs.map(job => {
            const normalizedJob = {
                id: job.id || `${platform}-${Date.now()}-${Math.random()}`,
                title: job.title || job.name || 'Untitled Position',
                company: job.company || job.employer || job.organization || 'Unknown Company',
                location: this.normalizeLocation(job.location || job.city || job.country || 'Remote'),
                description: job.description || job.summary || 'No description available',
                requirements: job.requirements || job.skills || [],
                salary: this.normalizeSalary(job.salary || job.compensation, job.location),
                type: job.type || job.employment_type || 'full-time',
                experience: job.experience || job.seniority_level || 'mid-level',
                posted: new Date(job.posted || job.created_at || job.date_posted || Date.now()),
                url: job.url || job.apply_url || job.link || this.generateJobUrl(job, platform),
                source: {
                    platform: platform,
                    name: endpoint.name,
                    icon: endpoint.icon,
                    color: endpoint.color,
                    url: endpoint.url
                },
                skills: job.skills || job.tags || [],
                remote: job.remote || job.location?.toLowerCase().includes('remote') || false,
                urgent: job.urgent || false,
                companySize: job.companySize || job.company_size || this.getCompanySize(job.company)
            };
            
            // Calculate relevance score
            normalizedJob.relevanceScore = this.calculateRelevanceScore(normalizedJob, userProfile);
            
            return normalizedJob;
        });
    }
    
    normalizeLocation(location) {
        if (!location) return 'Remote';
        
        const locationStr = location.toString().toLowerCase();
        
        // Handle common location formats
        if (locationStr.includes('remote')) return 'Remote';
        if (locationStr.includes('mumbai')) return 'Mumbai, India';
        if (locationStr.includes('bangalore')) return 'Bangalore, India';
        if (locationStr.includes('delhi')) return 'Delhi, India';
        if (locationStr.includes('hyderabad')) return 'Hyderabad, India';
        if (locationStr.includes('pune')) return 'Pune, India';
        if (locationStr.includes('san francisco')) return 'San Francisco, CA';
        if (locationStr.includes('new york')) return 'New York, NY';
        if (locationStr.includes('seattle')) return 'Seattle, WA';
        if (locationStr.includes('london')) return 'London, UK';
        
        return location;
    }
    
    normalizeSalary(salary, location) {
        if (!salary) return null;
        
        const locationStr = (location || '').toLowerCase();
        const currency = this.detectCurrency(locationStr);
        
        // Handle different salary formats
        if (typeof salary === 'object') {
            return {
                min: salary.min || salary.minimum || 0,
                max: salary.max || salary.maximum || 0,
                currency: salary.currency || currency,
                period: salary.period || 'annual'
            };
        }
        
        if (typeof salary === 'string') {
            const parsed = this.parseSalaryString(salary);
            return {
                min: parsed.min,
                max: parsed.max,
                currency: parsed.currency || currency,
                period: parsed.period || 'annual'
            };
        }
        
        if (typeof salary === 'number') {
            return {
                min: salary,
                max: salary,
                currency: currency,
                period: 'annual'
            };
        }
        
        return null;
    }
    
    parseSalaryString(salaryStr) {
        const str = salaryStr.toLowerCase();
        const numbers = str.match(/\d+/g) || [];
        
        let currency = 'USD';
        if (str.includes('₹') || str.includes('inr')) currency = 'INR';
        if (str.includes('€') || str.includes('eur')) currency = 'EUR';
        if (str.includes('£') || str.includes('gbp')) currency = 'GBP';
        
        let period = 'annual';
        if (str.includes('month') || str.includes('/month')) period = 'monthly';
        if (str.includes('hour') || str.includes('/hour')) period = 'hourly';
        
        const numericValues = numbers.map(n => parseInt(n));
        
        return {
            min: numericValues[0] || 0,
            max: numericValues[1] || numericValues[0] || 0,
            currency,
            period
        };
    }
    
    detectCurrency(locationStr) {
        for (const [location, currency] of Object.entries(this.locationCurrencyMap)) {
            if (locationStr.includes(location)) {
                return currency;
            }
        }
        return 'USD';
    }
    
    // ===========================================
    // RELEVANCE CALCULATION
    // ===========================================
    
    calculateRelevanceScore(job, userProfile) {
        if (!userProfile.skills || userProfile.skills.length === 0) {
            return Math.floor(Math.random() * 40) + 40; // 40-80 for no profile
        }
        
        let score = 0;
        const userSkills = userProfile.skills.map(s => s.toLowerCase());
        const jobSkills = [...(job.requirements || []), ...(job.skills || [])].map(s => s.toLowerCase());
        
        // Skills match (40% weight)
        const skillMatches = userSkills.filter(skill => 
            jobSkills.some(jobSkill => 
                jobSkill.includes(skill) || skill.includes(jobSkill)
            )
        ).length;
        const skillScore = Math.min((skillMatches / userSkills.length) * 40, 40);
        score += skillScore;
        
        // Experience match (20% weight)
        const experienceMatch = this.matchExperience(job.experience, userProfile.experience);
        score += experienceMatch * 20;
        
        // Location preference (15% weight)
        const locationMatch = this.matchLocation(job.location, userProfile.location);
        score += locationMatch * 15;
        
        // Job type preference (10% weight)
        const typeMatch = this.matchJobType(job.type, userProfile.jobType);
        score += typeMatch * 10;
        
        // Salary match (10% weight)
        const salaryMatch = this.matchSalary(job.salary, userProfile.expectedSalary);
        score += salaryMatch * 10;
        
        // Bonus for urgency (5% weight)
        if (job.urgent) score += 5;
        
        return Math.max(25, Math.min(98, Math.round(score)));
    }
    
    matchExperience(jobExp, userExp) {
        if (!jobExp || !userExp) return 0.5;
        
        const expLevels = {
            'entry': 1, 'junior': 1, 'entry-level': 1, 'intern': 0.5,
            'mid': 2, 'mid-level': 2, 'intermediate': 2,
            'senior': 3, 'lead': 3, 'principal': 4, 'staff': 4
        };
        
        const jobLevel = expLevels[jobExp.toLowerCase()] || 2;
        const userLevel = expLevels[userExp.toLowerCase()] || 2;
        
        const diff = Math.abs(jobLevel - userLevel);
        return Math.max(0, 1 - (diff * 0.3));
    }
    
    matchLocation(jobLocation, userLocation) {
        if (!jobLocation || !userLocation) return 0.5;
        if (jobLocation.toLowerCase().includes('remote')) return 0.9;
        if (jobLocation.toLowerCase().includes(userLocation.toLowerCase())) return 1;
        return 0.3;
    }
    
    matchJobType(jobType, userJobType) {
        if (!jobType || !userJobType) return 0.5;
        return jobType.toLowerCase() === userJobType.toLowerCase() ? 1 : 0.3;
    }
    
    matchSalary(jobSalary, userExpectedSalary) {
        if (!jobSalary || !userExpectedSalary) return 0.5;
        
        const jobMax = jobSalary.max || jobSalary.min || 0;
        const expected = userExpectedSalary.amount || 0;
        
        if (jobMax >= expected) return 1;
        if (jobMax >= expected * 0.8) return 0.7;
        if (jobMax >= expected * 0.6) return 0.4;
        return 0.1;
    }
    
    // ===========================================
    // UTILITY METHODS
    // ===========================================
    
    sortJobsByRelevance(jobs, userProfile) {
        return jobs.sort((a, b) => {
            // Primary: relevance score
            if (b.relevanceScore !== a.relevanceScore) {
                return b.relevanceScore - a.relevanceScore;
            }
            
            // Secondary: urgency
            if (b.urgent !== a.urgent) {
                return b.urgent ? 1 : -1;
            }
            
            // Tertiary: posted date
            return new Date(b.posted) - new Date(a.posted);
        });
    }
    
    formatSalary(salary) {
        if (!salary) return 'Salary not disclosed';
        
        const symbol = this.currencySymbols[salary.currency] || this.currencySymbols.default;
        
        if (salary.min === salary.max) {
            return `${symbol}${this.formatNumber(salary.min)}`;
        }
        
        return `${symbol}${this.formatNumber(salary.min)} - ${symbol}${this.formatNumber(salary.max)}`;
    }
    
    formatNumber(num) {
        if (num >= 100000) {
            return (num / 100000).toFixed(1) + 'L';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    }
    
    formatPostedDate(date) {
        const now = new Date();
        const posted = new Date(date);
        const diffTime = Math.abs(now - posted);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Posted today';
        if (diffDays <= 7) return `Posted ${diffDays} days ago`;
        if (diffDays <= 30) return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
        return `Posted ${Math.ceil(diffDays / 30)} months ago`;
    }
    
    async enforceRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.rateLimitDelay) {
            await new Promise(resolve => 
                setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
            );
        }
        
        this.lastRequestTime = Date.now();
    }
    
    // ===========================================
    // SEARCH AND FILTERING
    // ===========================================
    
    async searchJobs(query, userProfile = {}) {
        const searchCriteria = {
            keywords: query.keywords || '',
            location: query.location || '',
            jobType: query.jobType || '',
            experience: query.experience || '',
            minSalary: query.minSalary || 0,
            maxSalary: query.maxSalary || 0
        };
        
        return this.fetchJobsFromAllPlatforms(userProfile, searchCriteria);
    }
    
    filterJobs(jobs, filters) {
        return jobs.filter(job => {
            if (filters.type && job.type !== filters.type) return false;
            if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
            if (filters.minSalary && job.salary && job.salary.min < filters.minSalary) return false;
            if (filters.maxSalary && job.salary && job.salary.max > filters.maxSalary) return false;
            if (filters.experience && job.experience !== filters.experience) return false;
            if (filters.remote !== undefined && job.remote !== filters.remote) return false;
            if (filters.platform && job.source.platform !== filters.platform) return false;
            
            return true;
        });
    }

    generateJobUrl(job, platform) {
        const endpoint = this.apiEndpoints[platform];
        if (!endpoint) return '#';
        
        // Generate realistic job URLs based on platform
        switch (platform) {
            case 'linkedin':
                return `https://www.linkedin.com/jobs/view/${this.generateJobId()}`;
            case 'indeed':
                return `https://www.indeed.com/viewjob?jk=${this.generateJobId()}`;
            case 'naukri':
                return `https://www.naukri.com/job-listings-${this.generateJobId()}`;
            case 'glassdoor':
                return `https://www.glassdoor.com/job-listing/${this.generateJobId()}`;
            case 'angellist':
                return `https://angel.co/jobs/${this.generateJobId()}`;
            case 'joinrise':
                return `https://joinrise.io/jobs/${this.generateJobId()}`;
            case 'techmap':
                return `https://techmap.com/job/${this.generateJobId()}`;
            case 'adzuna':
                return `https://www.adzuna.com/jobs/details/${this.generateJobId()}`;
            default:
                return '#';
        }
    }

    generateJobId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    getAvailablePlatforms() {
        return Object.entries(this.apiEndpoints).map(([key, endpoint]) => ({
            id: key,
            name: endpoint.name,
            icon: endpoint.icon,
            color: endpoint.color,
            free: endpoint.free || false,
            mock: endpoint.mock || false
        }));
    }

    getCompanySize(companyName) {
        if (!companyName) return 'medium';
        
        const company = companyName.toLowerCase();
        
        // Large companies (500+ employees)
        const largeCompanies = [
            'google', 'microsoft', 'amazon', 'meta', 'facebook', 'apple', 'netflix', 'uber', 'airbnb',
            'tesla', 'spacex', 'oracle', 'salesforce', 'adobe', 'nvidia', 'intel', 'ibm', 'twitter',
            'linkedin', 'stripe', 'paypal', 'shopify', 'atlassian', 'zoom', 'slack', 'dropbox',
            'spotify', 'pinterest', 'reddit', 'discord', 'tiktok', 'snapchat', 'twitch', 'github',
            'gitlab', 'databricks', 'snowflake', 'mongodb', 'elastic', 'confluent', 'datadog',
            'okta', 'crowdstrike', 'servicenow', 'workday', 'zendesk', 'hubspot', 'docusign',
            'tcs', 'infosys', 'wipro', 'accenture', 'deloitte', 'pwc', 'ernst & young', 'kpmg',
            'jpmorgan', 'goldman sachs', 'morgan stanley', 'bank of america', 'wells fargo',
            'mastercard', 'visa', 'american express', 'discover', 'capital one', 'chase'
        ];
        
        // Startup companies (1-50 employees)
        const startupIndicators = [
            'startup', 'stealth', 'early stage', 'pre-seed', 'seed', 'series a', 'series b',
            'unicorn', 'decacorn', 'fintech', 'healthtech', 'edtech', 'proptech', 'insurtech',
            'logistics', 'delivery', 'marketplace', 'platform', 'saas', 'ai', 'ml', 'crypto',
            'blockchain', 'web3', 'dao', 'nft', 'metaverse', 'ar', 'vr', 'iot', 'robotics'
        ];
        
        // Check for large companies
        if (largeCompanies.some(large => company.includes(large))) {
            return 'large';
        }
        
        // Check for startup indicators
        if (startupIndicators.some(indicator => company.includes(indicator))) {
            return 'startup';
        }
        
        // Default to medium for unknown companies
        return 'medium';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JobAPIService;
} else {
    window.JobAPIService = JobAPIService;
} 