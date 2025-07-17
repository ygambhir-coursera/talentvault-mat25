const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Basic routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SkillForge API is running' });
});

// AI Skill Assessment endpoint
app.post('/api/skill-assessment', async (req, res) => {
    try {
        const { skills, difficulty } = req.body;
        
        // Simulate AI-generated quiz questions
        const quizQuestions = generateSkillQuiz(skills, difficulty);
        
        res.json({
            success: true,
            questions: quizQuestions,
            totalQuestions: quizQuestions.length,
            timeLimit: 30 * 60 // 30 minutes
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate skill assessment' });
    }
});

// Blockchain verification endpoint
app.post('/api/verify-credential', async (req, res) => {
    try {
        const { credentialData } = req.body;
        
        // Simulate blockchain verification
        const verification = await simulateBlockchainVerification(credentialData);
        
        res.json({
            success: true,
            verification: verification
        });
    } catch (error) {
        res.status(500).json({ error: 'Blockchain verification failed' });
    }
});

// Job matching endpoint
app.post('/api/match-jobs', async (req, res) => {
    try {
        const { skills, preferences } = req.body;
        
        // Generate matched jobs
        const matchedJobs = await generateMatchedJobs(skills, preferences);
        
        res.json({
            success: true,
            jobs: matchedJobs
        });
    } catch (error) {
        res.status(500).json({ error: 'Job matching failed' });
    }
});

// Community feedback endpoint
app.post('/api/feedback', async (req, res) => {
    try {
        const { userId, feedback, rating } = req.body;
        
        // Store feedback (simulate)
        const feedbackResult = await storeFeedback(userId, feedback, rating);
        
        res.json({
            success: true,
            feedback: feedbackResult
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});

// Helper functions
function generateSkillQuiz(skills, difficulty = 'medium') {
    const questions = [];
    
    skills.forEach(skill => {
        const skillQuestions = getQuestionsBySkill(skill, difficulty);
        questions.push(...skillQuestions);
    });
    
    return questions.slice(0, 20); // Limit to 20 questions
}

function getQuestionsBySkill(skill, difficulty) {
    const questionBank = {
        'JavaScript': [
            {
                question: "What is the output of: console.log(typeof null)?",
                options: ["null", "undefined", "object", "boolean"],
                correct: 2,
                difficulty: "medium",
                explanation: "In JavaScript, typeof null returns 'object' due to a historical bug that was never fixed."
            },
            {
                question: "Which method is used to add elements to the end of an array?",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correct: 0,
                difficulty: "easy",
                explanation: "push() adds elements to the end of an array and returns the new length."
            },
            {
                question: "What does the 'this' keyword refer to in JavaScript?",
                options: ["The global object", "The current function", "The object that owns the method", "The DOM element"],
                correct: 2,
                difficulty: "medium",
                explanation: "'this' refers to the object that is executing the current function."
            }
        ],
        'Python': [
            {
                question: "What is the output of: print(type([]))?",
                options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
                correct: 1,
                difficulty: "easy",
                explanation: "[] creates an empty list, so type([]) returns <class 'list'>"
            },
            {
                question: "Which of these is NOT a Python data type?",
                options: ["list", "tuple", "array", "dict"],
                correct: 2,
                difficulty: "medium",
                explanation: "Array is not a built-in Python data type. Lists and tuples are used for ordered collections."
            }
        ],
        'React': [
            {
                question: "What is JSX?",
                options: ["A JavaScript library", "A syntax extension for JavaScript", "A database", "A CSS framework"],
                correct: 1,
                difficulty: "easy",
                explanation: "JSX is a syntax extension for JavaScript that allows writing HTML-like code in React."
            },
            {
                question: "What hook is used to manage state in functional components?",
                options: ["useEffect", "useState", "useContext", "useReducer"],
                correct: 1,
                difficulty: "medium",
                explanation: "useState is the primary hook for managing state in functional components."
            }
        ]
    };
    
    return questionBank[skill] || [];
}

async function simulateBlockchainVerification(credentialData) {
    // Simulate blockchain transaction time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 500000,
        timestamp: new Date().toISOString(),
        verified: true,
        gasUsed: Math.floor(Math.random() * 100000) + 21000,
        networkFee: (Math.random() * 0.01).toFixed(6) + ' ETH'
    };
}

async function generateMatchedJobs(skills, preferences) {
    // Simulate job matching algorithm
    const jobTemplates = [
        {
            title: "Frontend Developer",
            company: "TechCorp Solutions",
            location: "Mumbai, India",
            type: "full-time",
            requiredSkills: ["JavaScript", "React", "CSS"],
            salary: "₹8-12 LPA",
            remote: true
        },
        {
            title: "Python Developer",
            company: "AI Innovations",
            location: "Bangalore, India",
            type: "full-time",
            requiredSkills: ["Python", "Django", "APIs"],
            salary: "₹10-15 LPA",
            remote: false
        },
        {
            title: "Full Stack Developer",
            company: "StartupXYZ",
            location: "Remote",
            type: "contract",
            requiredSkills: ["JavaScript", "Node.js", "React", "MongoDB"],
            salary: "₹12-18 LPA",
            remote: true
        }
    ];
    
    // Calculate match scores
    const matchedJobs = jobTemplates.map(job => {
        const matchScore = calculateMatchScore(job.requiredSkills, skills);
        return { ...job, matchScore };
    });
    
    return matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
}

function calculateMatchScore(requiredSkills, userSkills) {
    const matches = requiredSkills.filter(skill => 
        userSkills.some(userSkill => 
            userSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill.toLowerCase())
        )
    );
    
    return Math.min(95, Math.floor((matches.length / requiredSkills.length) * 100));
}

async function storeFeedback(userId, feedback, rating) {
    // Simulate storing feedback
    return {
        id: Date.now(),
        userId,
        feedback,
        rating,
        timestamp: new Date().toISOString(),
        status: 'approved'
    };
}

app.listen(PORT, () => {
    console.log(`🚀 SkillForge server running on http://localhost:${PORT}`);
});

module.exports = app;
