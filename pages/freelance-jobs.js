// ===========================================
// FREELANCE JOBS PAGE - API INTEGRATION
// ===========================================

let freelanceJobs = [];
let filteredJobs = [];
let currentSearchTerm = '';

// Mock API data for freelance platforms
const freelanceJobsData = [
    {
        id: 'upwork_1',
        title: 'Full Stack Web Developer Needed',
        platform: 'upwork',
        category: 'web-development',
        budget: '$2,500 - $5,000',
        budgetRange: '1000-5000',
        description: 'Looking for an experienced full stack developer to build a modern e-commerce platform using React and Node.js.',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        duration: '3-6 months',
        clientRating: 4.8,
        clientReviews: 45,
        postedDate: '2024-01-15',
        proposals: 12,
        url: 'https://www.upwork.com/freelance-jobs/apply/Full-Stack-Web-Developer-Needed_123456'
    },
    {
        id: 'peopleperhour_1',
        title: 'UI/UX Designer for Mobile App',
        platform: 'peopleperhour',
        category: 'design',
        budget: '$800 - $1,500',
        budgetRange: '500-1000',
        description: 'Need a creative UI/UX designer to design a mobile app interface for a fitness tracking application.',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
        duration: '2-3 months',
        clientRating: 4.9,
        clientReviews: 32,
        postedDate: '2024-01-14',
        proposals: 8,
        url: 'https://www.peopleperhour.com/freelance-jobs/design/ui-ux-designer-mobile-app_789012'
    },
    {
        id: 'freelancer_1',
        title: 'Content Writer for Tech Blog',
        platform: 'freelancer',
        category: 'writing',
        budget: '$300 - $800',
        budgetRange: '0-500',
        description: 'Looking for a skilled content writer to create engaging articles for our technology blog.',
        skills: ['Content Writing', 'SEO', 'Technical Writing', 'Research'],
        duration: '1-2 months',
        clientRating: 4.7,
        clientReviews: 28,
        postedDate: '2024-01-13',
        proposals: 15,
        url: 'https://www.freelancer.com/projects/content-writing/tech-blog-writer_345678'
    },
    {
        id: 'upwork_2',
        title: 'React Native Mobile App Developer',
        platform: 'upwork',
        category: 'mobile-development',
        budget: '$3,000 - $7,000',
        budgetRange: '5000+',
        description: 'Seeking an experienced React Native developer to build a cross-platform mobile application.',
        skills: ['React Native', 'JavaScript', 'Redux', 'Firebase'],
        duration: '4-6 months',
        clientRating: 4.9,
        clientReviews: 67,
        postedDate: '2024-01-12',
        proposals: 18,
        url: 'https://www.upwork.com/freelance-jobs/apply/React-Native-Mobile-App-Developer_456789'
    },
    {
        id: 'guru_1',
        title: 'Digital Marketing Specialist',
        platform: 'guru',
        category: 'marketing',
        budget: '$1,200 - $2,500',
        budgetRange: '1000-5000',
        description: 'Need a digital marketing expert to manage social media campaigns and SEO optimization.',
        skills: ['Social Media Marketing', 'SEO', 'Google Ads', 'Analytics'],
        duration: '3-4 months',
        clientRating: 4.6,
        clientReviews: 41,
        postedDate: '2024-01-11',
        proposals: 22,
        url: 'https://www.guru.com/freelance-jobs/digital-marketing-specialist_567890'
    },
    {
        id: 'fiverr_1',
        title: 'Python Data Scientist',
        platform: 'fiverr',
        category: 'data-science',
        budget: '$1,500 - $3,500',
        budgetRange: '1000-5000',
        description: 'Looking for a data scientist to analyze customer data and build predictive models.',
        skills: ['Python', 'Machine Learning', 'Pandas', 'Scikit-learn'],
        duration: '2-3 months',
        clientRating: 4.8,
        clientReviews: 39,
        postedDate: '2024-01-10',
        proposals: 14,
        url: 'https://www.fiverr.com/freelance-jobs/python-data-scientist_678901'
    },
    {
        id: 'peopleperhour_2',
        title: 'WordPress Developer',
        platform: 'peopleperhour',
        category: 'web-development',
        budget: '$600 - $1,200',
        budgetRange: '500-1000',
        description: 'Need a WordPress developer to customize themes and develop custom plugins.',
        skills: ['WordPress', 'PHP', 'MySQL', 'JavaScript'],
        duration: '1-2 months',
        clientRating: 4.7,
        clientReviews: 35,
        postedDate: '2024-01-09',
        proposals: 11,
        url: 'https://www.peopleperhour.com/freelance-jobs/web-development/wordpress-developer_789012'
    },
    {
        id: 'upwork_3',
        title: 'Business Consultant for Startup',
        platform: 'upwork',
        category: 'consulting',
        budget: '$2,000 - $4,000',
        budgetRange: '1000-5000',
        description: 'Seeking a business consultant to help with strategic planning and market analysis.',
        skills: ['Business Strategy', 'Market Research', 'Financial Analysis', 'Consulting'],
        duration: '2-4 months',
        clientRating: 4.9,
        clientReviews: 56,
        postedDate: '2024-01-08',
        proposals: 9,
        url: 'https://www.upwork.com/freelance-jobs/apply/Business-Consultant-Startup_890123'
    },
    {
        id: 'freelancer_2',
        title: 'Graphic Designer for Brand Identity',
        platform: 'freelancer',
        category: 'design',
        budget: '$400 - $900',
        budgetRange: '0-500',
        description: 'Looking for a creative graphic designer to create a complete brand identity package.',
        skills: ['Adobe Illustrator', 'Photoshop', 'Brand Design', 'Logo Design'],
        duration: '1-2 months',
        clientRating: 4.8,
        clientReviews: 43,
        postedDate: '2024-01-07',
        proposals: 16,
        url: 'https://www.freelancer.com/projects/graphic-design/brand-identity-designer_901234'
    },
    {
        id: 'guru_2',
        title: 'Vue.js Frontend Developer',
        platform: 'guru',
        category: 'web-development',
        budget: '$1,800 - $3,200',
        budgetRange: '1000-5000',
        description: 'Need a Vue.js developer to build a responsive web application with modern UI.',
        skills: ['Vue.js', 'JavaScript', 'HTML5', 'CSS3'],
        duration: '3-5 months',
        clientRating: 4.7,
        clientReviews: 38,
        postedDate: '2024-01-06',
        proposals: 13,
        url: 'https://www.guru.com/freelance-jobs/vue-js-frontend-developer_012345'
    },
    {
        id: 'upwork_4',
        title: 'Machine Learning Engineer',
        platform: 'upwork',
        category: 'data-science',
        budget: '$4,000 - $8,000',
        budgetRange: '5000+',
        description: 'Seeking an ML engineer to develop recommendation systems and predictive models.',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'AWS'],
        duration: '4-6 months',
        clientRating: 4.9,
        clientReviews: 72,
        postedDate: '2024-01-05',
        proposals: 25,
        url: 'https://www.upwork.com/freelance-jobs/apply/Machine-Learning-Engineer_123789'
    },
    {
        id: 'freelancer_3',
        title: 'Social Media Manager',
        platform: 'freelancer',
        category: 'marketing',
        budget: '$800 - $1,500',
        budgetRange: '500-1000',
        description: 'Looking for a social media manager to handle Instagram, Facebook, and LinkedIn accounts.',
        skills: ['Social Media', 'Content Creation', 'Canva', 'Analytics'],
        duration: '3-6 months',
        clientRating: 4.6,
        clientReviews: 29,
        postedDate: '2024-01-04',
        proposals: 19,
        url: 'https://www.freelancer.com/projects/social-media-manager_456123'
    },
    {
        id: 'peopleperhour_3',
        title: 'E-commerce Store Developer',
        platform: 'peopleperhour',
        category: 'web-development',
        budget: '$2,000 - $4,500',
        budgetRange: '1000-5000',
        description: 'Need an experienced developer to build a complete e-commerce store with payment integration.',
        skills: ['Shopify', 'WooCommerce', 'Payment Gateway', 'React'],
        duration: '2-4 months',
        clientRating: 4.8,
        clientReviews: 51,
        postedDate: '2024-01-03',
        proposals: 16,
        url: 'https://www.peopleperhour.com/freelance-jobs/ecommerce-store-developer_789456'
    },
    {
        id: 'fiverr_2',
        title: 'Video Editor for YouTube',
        platform: 'fiverr',
        category: 'design',
        budget: '$600 - $1,200',
        budgetRange: '500-1000',
        description: 'Looking for a skilled video editor to create engaging YouTube content with motion graphics.',
        skills: ['After Effects', 'Premiere Pro', 'Motion Graphics', 'Video Editing'],
        duration: '2-3 months',
        clientRating: 4.7,
        clientReviews: 33,
        postedDate: '2024-01-02',
        proposals: 21,
        url: 'https://www.fiverr.com/freelance-jobs/video-editor-youtube_987654'
    },
    {
        id: 'upwork_5',
        title: 'DevOps Engineer',
        platform: 'upwork',
        category: 'web-development',
        budget: '$3,500 - $7,000',
        budgetRange: '5000+',
        description: 'Seeking a DevOps engineer to set up CI/CD pipelines and manage cloud infrastructure.',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
        duration: '3-5 months',
        clientRating: 4.9,
        clientReviews: 68,
        postedDate: '2024-01-01',
        proposals: 12,
        url: 'https://www.upwork.com/freelance-jobs/apply/DevOps-Engineer_654321'
    },
    {
        id: 'guru_3',
        title: 'Technical Writer',
        platform: 'guru',
        category: 'writing',
        budget: '$1,000 - $2,500',
        budgetRange: '1000-5000',
        description: 'Need a technical writer to create documentation for software products and APIs.',
        skills: ['Technical Writing', 'API Documentation', 'Markdown', 'Git'],
        duration: '2-4 months',
        clientRating: 4.8,
        clientReviews: 47,
        postedDate: '2023-12-31',
        proposals: 14,
        url: 'https://www.guru.com/freelance-jobs/technical-writer_147258'
    },
    {
        id: 'freelancer_4',
        title: 'iOS App Developer',
        platform: 'freelancer',
        category: 'mobile-development',
        budget: '$2,500 - $5,500',
        budgetRange: '1000-5000',
        description: 'Looking for an iOS developer to create a native iPhone app with Core Data integration.',
        skills: ['Swift', 'iOS', 'Core Data', 'UIKit'],
        duration: '3-5 months',
        clientRating: 4.7,
        clientReviews: 35,
        postedDate: '2023-12-30',
        proposals: 18,
        url: 'https://www.freelancer.com/projects/ios-app-developer_369852'
    },
    {
        id: 'peopleperhour_4',
        title: 'SEO Specialist',
        platform: 'peopleperhour',
        category: 'marketing',
        budget: '$900 - $1,800',
        budgetRange: '500-1000',
        description: 'Need an SEO expert to improve website rankings and organic traffic.',
        skills: ['SEO', 'Google Analytics', 'Keyword Research', 'Content Strategy'],
        duration: '2-3 months',
        clientRating: 4.6,
        clientReviews: 42,
        postedDate: '2023-12-29',
        proposals: 23,
        url: 'https://www.peopleperhour.com/freelance-jobs/seo-specialist_741963'
    },
    {
        id: 'upwork_6',
        title: 'Product Manager',
        platform: 'upwork',
        category: 'consulting',
        budget: '$3,000 - $6,000',
        budgetRange: '5000+',
        description: 'Seeking a product manager to define product strategy and manage development roadmap.',
        skills: ['Product Management', 'Agile', 'Market Research', 'Strategy'],
        duration: '4-6 months',
        clientRating: 4.8,
        clientReviews: 59,
        postedDate: '2023-12-28',
        proposals: 17,
        url: 'https://www.upwork.com/freelance-jobs/apply/Product-Manager_852741'
    },
    {
        id: 'fiverr_3',
        title: 'Brand Logo Designer',
        platform: 'fiverr',
        category: 'design',
        budget: '$200 - $800',
        budgetRange: '0-500',
        description: 'Looking for a creative designer to create a modern logo and brand identity.',
        skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Creative Design'],
        duration: '1-2 months',
        clientRating: 4.9,
        clientReviews: 156,
        postedDate: '2023-12-27',
        proposals: 31,
        url: 'https://www.fiverr.com/freelance-jobs/brand-logo-designer_963741'
    },
    {
        id: 'guru_4',
        title: 'Blockchain Developer',
        platform: 'guru',
        category: 'web-development',
        budget: '$4,500 - $9,000',
        budgetRange: '5000+',
        description: 'Need a blockchain developer to create smart contracts and DeFi applications.',
        skills: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts'],
        duration: '3-6 months',
        clientRating: 4.8,
        clientReviews: 31,
        postedDate: '2023-12-26',
        proposals: 9,
        url: 'https://www.guru.com/freelance-jobs/blockchain-developer_159753'
    },
    {
        id: 'freelancer_5',
        title: 'Data Analyst',
        platform: 'freelancer',
        category: 'data-science',
        budget: '$1,200 - $2,800',
        budgetRange: '1000-5000',
        description: 'Looking for a data analyst to analyze sales data and create interactive dashboards.',
        skills: ['SQL', 'Python', 'Tableau', 'Excel'],
        duration: '2-3 months',
        clientRating: 4.7,
        clientReviews: 44,
        postedDate: '2023-12-25',
        proposals: 20,
        url: 'https://www.freelancer.com/projects/data-analyst_357951'
    },
    {
        id: 'peopleperhour_5',
        title: 'UX/UI Designer',
        platform: 'peopleperhour',
        category: 'design',
        budget: '$1,500 - $3,000',
        budgetRange: '1000-5000',
        description: 'Need a UX/UI designer to redesign our web application with modern user experience.',
        skills: ['Figma', 'UX Research', 'Wireframing', 'Prototyping'],
        duration: '2-4 months',
        clientRating: 4.9,
        clientReviews: 67,
        postedDate: '2023-12-24',
        proposals: 15,
        url: 'https://www.peopleperhour.com/freelance-jobs/ux-ui-designer_753159'
    },
    {
        id: 'upwork_7',
        title: 'Flutter App Developer',
        platform: 'upwork',
        category: 'mobile-development',
        budget: '$2,800 - $5,200',
        budgetRange: '1000-5000',
        description: 'Seeking a Flutter developer to create cross-platform mobile application.',
        skills: ['Flutter', 'Dart', 'Firebase', 'Mobile Development'],
        duration: '3-5 months',
        clientRating: 4.8,
        clientReviews: 53,
        postedDate: '2023-12-23',
        proposals: 22,
        url: 'https://www.upwork.com/freelance-jobs/apply/Flutter-App-Developer_951357'
    },
    {
        id: 'fiverr_4',
        title: 'Voice Over Artist',
        platform: 'fiverr',
        category: 'other',
        budget: '$150 - $500',
        budgetRange: '0-500',
        description: 'Looking for a professional voice over artist for commercials and explainer videos.',
        skills: ['Voice Over', 'Audio Production', 'Storytelling', 'Professional Voice'],
        duration: '1-2 months',
        clientRating: 4.8,
        clientReviews: 89,
        postedDate: '2023-12-22',
        proposals: 27,
        url: 'https://www.fiverr.com/freelance-jobs/voice-over-artist_147852'
    },
    {
        id: 'guru_5',
        title: 'Cybersecurity Consultant',
        platform: 'guru',
        category: 'consulting',
        budget: '$3,500 - $7,500',
        budgetRange: '5000+',
        description: 'Need a cybersecurity expert to assess our security infrastructure and implement improvements.',
        skills: ['Cybersecurity', 'Penetration Testing', 'Security Auditing', 'Risk Assessment'],
        duration: '2-4 months',
        clientRating: 4.9,
        clientReviews: 24,
        postedDate: '2023-12-21',
        proposals: 8,
        url: 'https://www.guru.com/freelance-jobs/cybersecurity-consultant_258741'
    },
    {
        id: 'upwork_8',
        title: 'Email Marketing Specialist',
        platform: 'upwork',
        category: 'marketing',
        budget: '$1,000 - $2,200',
        budgetRange: '1000-5000',
        description: 'Seeking an email marketing expert to design and execute email campaigns.',
        skills: ['Email Marketing', 'Mailchimp', 'Campaign Design', 'Analytics'],
        duration: '2-3 months',
        clientRating: 4.7,
        clientReviews: 45,
        postedDate: '2023-12-20',
        proposals: 19,
        url: 'https://www.upwork.com/freelance-jobs/apply/Email-Marketing-Specialist_741963'
    },
    {
        id: 'freelancer_6',
        title: 'Unity Game Developer',
        platform: 'freelancer',
        category: 'web-development',
        budget: '$2,200 - $4,800',
        budgetRange: '1000-5000',
        description: 'Looking for a Unity developer to create a 2D mobile game with multiplayer features.',
        skills: ['Unity', 'C#', 'Game Development', 'Mobile Gaming'],
        duration: '3-5 months',
        clientRating: 4.8,
        clientReviews: 37,
        postedDate: '2023-12-19',
        proposals: 16,
        url: 'https://www.freelancer.com/projects/unity-game-developer_369741'
    },
    {
        id: 'peopleperhour_6',
        title: 'Translation Services',
        platform: 'peopleperhour',
        category: 'writing',
        budget: '$500 - $1,200',
        budgetRange: '500-1000',
        description: 'Need professional translation services for website content from English to Spanish.',
        skills: ['Translation', 'Spanish', 'Localization', 'Content Writing'],
        duration: '1-2 months',
        clientRating: 4.9,
        clientReviews: 78,
        postedDate: '2023-12-18',
        proposals: 24,
        url: 'https://www.peopleperhour.com/freelance-jobs/translation-services_852963'
    },
    {
        id: 'upwork_9',
        title: 'WordPress Plugin Developer',
        platform: 'upwork',
        category: 'web-development',
        budget: '$800 - $2,000',
        budgetRange: '500-1000',
        description: 'Need a WordPress developer to create a custom plugin for e-commerce functionality.',
        skills: ['WordPress', 'PHP', 'Plugin Development', 'WooCommerce'],
        duration: '1-3 months',
        clientRating: 4.6,
        clientReviews: 52,
        postedDate: '2023-12-17',
        proposals: 21,
        url: 'https://www.upwork.com/freelance-jobs/apply/WordPress-Plugin-Developer_159357'
    },
    {
        id: 'fiverr_5',
        title: 'Podcast Editor',
        platform: 'fiverr',
        category: 'design',
        budget: '$300 - $800',
        budgetRange: '0-500',
        description: 'Looking for a podcast editor to edit weekly episodes with intro/outro music.',
        skills: ['Audio Editing', 'Audacity', 'Podcast Production', 'Sound Design'],
        duration: '3-6 months',
        clientRating: 4.7,
        clientReviews: 91,
        postedDate: '2023-12-16',
        proposals: 33,
        url: 'https://www.fiverr.com/freelance-jobs/podcast-editor_753951'
    },
    {
        id: 'guru_6',
        title: 'Cloud Architect',
        platform: 'guru',
        category: 'web-development',
        budget: '$4,000 - $8,500',
        budgetRange: '5000+',
        description: 'Seeking a cloud architect to design and implement scalable cloud infrastructure.',
        skills: ['AWS', 'Cloud Architecture', 'Microservices', 'Infrastructure'],
        duration: '4-6 months',
        clientRating: 4.8,
        clientReviews: 29,
        postedDate: '2023-12-15',
        proposals: 11,
        url: 'https://www.guru.com/freelance-jobs/cloud-architect_357159'
    },
    {
        id: 'freelancer_7',
        title: 'Virtual Assistant',
        platform: 'freelancer',
        category: 'other',
        budget: '$600 - $1,500',
        budgetRange: '500-1000',
        description: 'Looking for a virtual assistant to handle administrative tasks and customer support.',
        skills: ['Virtual Assistant', 'Customer Service', 'Data Entry', 'Communication'],
        duration: '3-6 months',
        clientRating: 4.5,
        clientReviews: 67,
        postedDate: '2023-12-14',
        proposals: 41,
        url: 'https://www.freelancer.com/projects/virtual-assistant_951753'
    },
    {
        id: 'peopleperhour_7',
        title: 'Salesforce Administrator',
        platform: 'peopleperhour',
        category: 'consulting',
        budget: '$2,500 - $5,000',
        budgetRange: '1000-5000',
        description: 'Need a Salesforce administrator to configure and optimize our CRM system.',
        skills: ['Salesforce', 'CRM', 'System Administration', 'Workflow Automation'],
        duration: '2-4 months',
        clientRating: 4.8,
        clientReviews: 34,
        postedDate: '2023-12-13',
        proposals: 14,
        url: 'https://www.peopleperhour.com/freelance-jobs/salesforce-administrator_147963'
    },
    {
        id: 'upwork_10',
        title: 'Video Game Tester',
        platform: 'upwork',
        category: 'other',
        budget: '$400 - $1,000',
        budgetRange: '0-500',
        description: 'Looking for game testers to test mobile games and report bugs and issues.',
        skills: ['Game Testing', 'Bug Reporting', 'Quality Assurance', 'Mobile Gaming'],
        duration: '2-3 months',
        clientRating: 4.6,
        clientReviews: 56,
        postedDate: '2023-12-12',
        proposals: 38,
        url: 'https://www.upwork.com/freelance-jobs/apply/Video-Game-Tester_456789'
    }
];

// Initialize freelance jobs page
document.addEventListener('DOMContentLoaded', function() {
    initializeFreelanceJobs();
});

function initializeFreelanceJobs() {
    freelanceJobs = [...freelanceJobsData];
    filteredJobs = [...freelanceJobs];
    renderFreelanceJobs();
}

function renderFreelanceJobs() {
    const jobsGrid = document.getElementById('freelance-jobs-grid');
    const noResults = document.getElementById('no-results');
    
    if (filteredJobs.length === 0) {
        jobsGrid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    const jobsHTML = filteredJobs.map(job => `
        <div class="job-card freelance-job" data-platform="${job.platform}">
            <div class="job-header">
                <div class="job-title-section">
                    <h3 class="job-title">${job.title}</h3>
                    <div class="job-platform">
                        <i class="fas fa-laptop-code"></i>
                        <span>${getPlatformName(job.platform)}</span>
                    </div>
                </div>
                <div class="job-save-btn" onclick="toggleSaveJob('${job.id}')">
                    <i class="far fa-heart"></i>
                </div>
            </div>
            
            <div class="job-details">
                <div class="job-budget">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${job.budget}</span>
                </div>
                <div class="job-duration">
                    <i class="fas fa-clock"></i>
                    <span>${job.duration}</span>
                </div>
                <div class="job-proposals">
                    <i class="fas fa-users"></i>
                    <span>${job.proposals} proposals</span>
                </div>
            </div>
            
            <div class="job-description">
                <p>${job.description}</p>
            </div>
            
            <div class="job-skills">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            
            <div class="job-client-info">
                <div class="client-rating">
                    <i class="fas fa-star"></i>
                    <span>${job.clientRating}</span>
                    <span class="reviews-count">(${job.clientReviews} reviews)</span>
                </div>
                <div class="posted-date">
                    <i class="fas fa-calendar"></i>
                    <span>Posted ${formatDate(job.postedDate)}</span>
                </div>
            </div>
            
            <div class="job-actions">
                <button class="btn btn-primary" onclick="applyToFreelanceJob('${job.id}')">
                    <i class="fas fa-paper-plane"></i>
                    Apply Now
                </button>
                <button class="btn btn-secondary" onclick="viewJobDetails('${job.id}')">
                    <i class="fas fa-info-circle"></i>
                    View Details
                </button>
            </div>
        </div>
    `).join('');
    
    jobsGrid.innerHTML = jobsHTML;
}

function getPlatformName(platform) {
    const platformNames = {
        'upwork': 'Upwork',
        'peopleperhour': 'PeoplePerHour',
        'freelancer': 'Freelancer',
        'guru': 'Guru',
        'fiverr': 'Fiverr'
    };
    return platformNames[platform] || platform;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
}

function searchFreelanceJobs() {
    const searchTerm = document.getElementById('job-search').value.toLowerCase();
    currentSearchTerm = searchTerm;
    
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        applyFilters();
        hideLoading();
    }, 800);
}

function filterFreelanceJobs() {
    applyFilters();
}

function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const platformFilter = document.getElementById('platform-filter').value;
    const budgetFilter = document.getElementById('budget-filter').value;
    
    filteredJobs = freelanceJobs.filter(job => {
        const matchesSearch = !currentSearchTerm || 
            job.title.toLowerCase().includes(currentSearchTerm) ||
            job.description.toLowerCase().includes(currentSearchTerm) ||
            job.skills.some(skill => skill.toLowerCase().includes(currentSearchTerm));
        
        const matchesCategory = !categoryFilter || job.category === categoryFilter;
        const matchesPlatform = !platformFilter || job.platform === platformFilter;
        const matchesBudget = !budgetFilter || job.budgetRange === budgetFilter;
        
        return matchesSearch && matchesCategory && matchesPlatform && matchesBudget;
    });
    
    renderFreelanceJobs();
}

function clearFilters() {
    document.getElementById('job-search').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('platform-filter').value = '';
    document.getElementById('budget-filter').value = '';
    
    currentSearchTerm = '';
    filteredJobs = [...freelanceJobs];
    renderFreelanceJobs();
}

function applyToFreelanceJob(jobId) {
    const job = freelanceJobs.find(j => j.id === jobId);
    if (job) {
        // Open the job URL in a new tab
        window.open(job.url, '_blank');
        
        // Show success notification
        showNotification(`🚀 Opening ${job.title} on ${getPlatformName(job.platform)}!`, 'success');
    }
}

function viewJobDetails(jobId) {
    const job = freelanceJobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Create and show job details modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${job.title}</h3>
                <button class="close-btn" onclick="closeModal(this)">&times;</button>
            </div>
            <div class="modal-body">
                <div class="job-detail-platform">
                    <i class="fas fa-laptop-code"></i>
                    <span>${getPlatformName(job.platform)}</span>
                </div>
                
                <div class="job-detail-info">
                    <div class="detail-item">
                        <strong>Budget:</strong> ${job.budget}
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong> ${job.duration}
                    </div>
                    <div class="detail-item">
                        <strong>Proposals:</strong> ${job.proposals}
                    </div>
                </div>
                
                <div class="job-detail-description">
                    <h4>Description:</h4>
                    <p>${job.description}</p>
                </div>
                
                <div class="job-detail-skills">
                    <h4>Required Skills:</h4>
                    <div class="skills-list">
                        ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                
                <div class="job-detail-client">
                    <h4>Client Information:</h4>
                    <div class="client-info">
                        <div class="client-rating">
                            <i class="fas fa-star"></i>
                            <span>${job.clientRating}</span>
                            <span>(${job.clientReviews} reviews)</span>
                        </div>
                        <div class="posted-date">
                            Posted ${formatDate(job.postedDate)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="applyToFreelanceJob('${job.id}')">
                    <i class="fas fa-paper-plane"></i>
                    Apply Now
                </button>
                <button class="btn btn-secondary" onclick="closeModal(this)">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);
}

function toggleSaveJob(jobId) {
    const job = freelanceJobs.find(j => j.id === jobId);
    if (!job) return;
    
    // Get saved jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isAlreadySaved = savedJobs.some(saved => saved.id === jobId);
    
    if (isAlreadySaved) {
        // Remove from saved jobs
        const updatedSavedJobs = savedJobs.filter(saved => saved.id !== jobId);
        localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
        showNotification('💔 Job removed from saved list', 'info');
    } else {
        // Add to saved jobs
        savedJobs.push(job);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        showNotification('💝 Job saved to your wishlist!', 'success');
    }
    
    // Update the heart icon
    updateSaveButtonState(jobId);
}

function updateSaveButtonState(jobId) {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const isAlreadySaved = savedJobs.some(saved => saved.id === jobId);
    
    const saveBtn = document.querySelector(`[onclick="toggleSaveJob('${jobId}')"]`);
    if (saveBtn) {
        const icon = saveBtn.querySelector('i');
        if (isAlreadySaved) {
            icon.className = 'fas fa-heart';
            icon.style.color = '#ef4444';
        } else {
            icon.className = 'far fa-heart';
            icon.style.color = '';
        }
    }
}

function showLoading() {
    document.getElementById('loading-indicator').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading-indicator').style.display = 'none';
}

// Handle Enter key in search input
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('job-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchFreelanceJobs();
            }
        });
    }
}); 