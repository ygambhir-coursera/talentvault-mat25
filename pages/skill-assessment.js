// ===========================================
// ENHANCED SKILL ASSESSMENT - DYNAMIC & RANDOMIZED
// AI-Powered Skill Evaluation with API Integration
// ===========================================

// Assessment state
let assessmentState = {
    selectedSkills: [],
    difficulty: 'medium',
    questions: [],
    currentQuestion: 0,
    answers: [],
    timeRemaining: 30 * 60, // 30 minutes in seconds
    timerInterval: null,
    startTime: null,
    results: null,
    questionAPIs: {
        trivia: 'https://opentdb.com/api.php',
        programming: 'https://quizapi.io/api/v1/questions',
        // Note: These are example APIs, some may require API keys
    }
};

// Initialize assessment page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧠 Enhanced Skill Assessment initialized');
    
    // Pre-select skills if coming from dashboard
    if (typeof appState !== 'undefined' && appState.userSkills && appState.userSkills.length > 0) {
        preselectSkills(appState.userSkills);
    }
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Skill selection changes
    document.querySelectorAll('input[name="skills"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedSkills);
    });
    
    // Difficulty selection changes
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', updateDifficulty);
    });
}

function preselectSkills(userSkills) {
    // Auto-select skills based on user's portfolio
    const commonSkills = ['JavaScript', 'Python', 'React', 'HTML/CSS', 'Node.js', 'MongoDB'];
    
    userSkills.forEach(skill => {
        const matchingSkill = commonSkills.find(commonSkill => 
            commonSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(commonSkill.toLowerCase())
        );
        
        if (matchingSkill) {
            const checkbox = document.querySelector(`input[value="${matchingSkill}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    });
    
    updateSelectedSkills();
}

function updateSelectedSkills() {
    const checkboxes = document.querySelectorAll('input[name="skills"]:checked');
    assessmentState.selectedSkills = Array.from(checkboxes).map(cb => cb.value);
    
    console.log('Selected skills:', assessmentState.selectedSkills);
    
    // Update UI feedback
    const startButton = document.querySelector('button[onclick="startAssessment()"]');
    if (assessmentState.selectedSkills.length === 0) {
        startButton.disabled = true;
        startButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Select at least one skill';
    } else {
        startButton.disabled = false;
        startButton.innerHTML = '<i class="fas fa-play"></i> Start Assessment';
    }
}

function updateDifficulty() {
    assessmentState.difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    console.log('Selected difficulty:', assessmentState.difficulty);
}

// ===========================================
// DYNAMIC QUESTION GENERATION SYSTEM
// ===========================================

class QuestionGenerator {
    constructor() {
        this.questionTemplates = this.initializeTemplates();
        this.codeSnippets = this.initializeCodeSnippets();
        this.practicalScenarios = this.initializePracticalScenarios();
    }

    initializeTemplates() {
        return {
            JavaScript: {
                conceptual: [
                    {
                        template: "What is the difference between {concept1} and {concept2} in JavaScript?",
                        concepts: [
                            { concept1: "let", concept2: "var" },
                            { concept1: "== ", concept2: "===" },
                            { concept1: "null", concept2: "undefined" },
                            { concept1: "arrow functions", concept2: "regular functions" },
                            { concept1: "async/await", concept2: "promises" },
                            { concept1: "map()", concept2: "forEach()" },
                            { concept1: "const", concept2: "let" },
                            { concept1: "callback", concept2: "promise" },
                            { concept1: "localStorage", concept2: "sessionStorage" },
                            { concept1: "event bubbling", concept2: "event capturing" }
                        ]
                    },
                    {
                        template: "Which method is used to {action} in JavaScript?",
                        actions: [
                            { action: "add an element to the end of an array", answer: "push()" },
                            { action: "remove the last element from an array", answer: "pop()" },
                            { action: "find an element in an array", answer: "find()" },
                            { action: "convert a string to uppercase", answer: "toUpperCase()" },
                            { action: "parse a JSON string", answer: "JSON.parse()" },
                            { action: "remove the first element from an array", answer: "shift()" },
                            { action: "add elements to the beginning of an array", answer: "unshift()" },
                            { action: "create a new array with filtered elements", answer: "filter()" },
                            { action: "combine all array elements into a string", answer: "join()" },
                            { action: "check if an element exists in an array", answer: "includes()" },
                            { action: "get a portion of an array", answer: "slice()" },
                            { action: "round a number to the nearest integer", answer: "Math.round()" }
                        ]
                    },
                    {
                        template: "How do you {action} in JavaScript?",
                        actions: [
                            { action: "declare a variable that can be reassigned", answer: "let variableName" },
                            { action: "declare a constant variable", answer: "const variableName" },
                            { action: "create a function", answer: "function name() {}" },
                            { action: "create an object", answer: "const obj = {}" },
                            { action: "create an array", answer: "const arr = []" },
                            { action: "add a property to an object", answer: "obj.property = value" },
                            { action: "iterate over an array", answer: "for (let item of array)" },
                            { action: "handle errors", answer: "try/catch block" }
                        ]
                    }
                ],
                coding: [
                    {
                        template: "What will the following code output?",
                        codeType: "logic",
                        complexity: ["easy", "medium", "hard"]
                    },
                    {
                        template: "How would you fix this JavaScript code?",
                        codeType: "bugfix",
                        complexity: ["medium", "hard"]
                    }
                ],
                practical: [
                    {
                        template: "You need to {scenario}. Which approach would you use?",
                        scenarios: [
                            { scenario: "make an API call and handle errors", solution: "try/catch with async/await" },
                            { scenario: "prevent a form from submitting", solution: "event.preventDefault()" },
                            { scenario: "validate user input", solution: "input validation with regex or validation library" },
                            { scenario: "optimize a slow rendering component", solution: "React.memo or useMemo" }
                        ]
                    }
                ]
            },
            Python: {
                conceptual: [
                    {
                        template: "What is the difference between {concept1} and {concept2} in Python?",
                        concepts: [
                            { concept1: "list", concept2: "tuple" },
                            { concept1: "dictionary", concept2: "set" },
                            { concept1: "class method", concept2: "static method" },
                            { concept1: "deepcopy", concept2: "shallow copy" }
                        ]
                    }
                ],
                coding: [
                    {
                        template: "What will this Python code output?",
                        codeType: "logic",
                        complexity: ["easy", "medium", "hard"]
                    }
                ],
                practical: [
                    {
                        template: "How would you {task} in Python?",
                        tasks: [
                            { task: "handle file operations safely", solution: "use with statement for file handling" },
                            { task: "create a REST API", solution: "use Flask or FastAPI" },
                            { task: "work with databases", solution: "use SQLAlchemy or Django ORM" }
                        ]
                    }
                ]
            }
        };
    }

    initializeCodeSnippets() {
        return {
            JavaScript: {
                easy: [
                    {
                        code: `let x = 5;
let y = "5";
console.log(x == y);
console.log(x === y);`,
                        output: "true\nfalse",
                        explanation: "== does type coercion, === checks type and value"
                    },
                    {
                        code: `const arr = [1, 2, 3];
arr.push(4);
console.log(arr.length);`,
                        output: "4",
                        explanation: "push() adds element to end and returns new length"
                    },
                    {
                        code: `const str = "Hello";
console.log(str.charAt(1));`,
                        output: "e",
                        explanation: "charAt(1) returns the character at index 1"
                    },
                    {
                        code: `const obj = {name: "John"};
console.log(obj.name);
console.log(obj.age);`,
                        output: "John\nundefined",
                        explanation: "Accessing undefined property returns undefined"
                    },
                    {
                        code: `const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2);
console.log(doubled[0]);`,
                        output: "2",
                        explanation: "map() creates a new array with transformed elements"
                    }
                ],
                medium: [
                    {
                        code: `function test() {
    console.log(a);
    var a = 1;
    console.log(a);
}
test();`,
                        output: "undefined\n1",
                        explanation: "Variable hoisting - var declarations are hoisted but not assignments"
                    },
                    {
                        code: `const arr = [1, 2, 3];
const result = arr.filter(x => x > 1);
console.log(result.length);`,
                        output: "2",
                        explanation: "filter() creates a new array with elements that pass the test"
                    },
                    {
                        code: `function outer() {
    let x = 10;
    return function inner() {
        console.log(x);
    };
}
const fn = outer();
fn();`,
                        output: "10",
                        explanation: "Closures allow inner functions to access outer function variables"
                    }
                ],
                hard: [
                    {
                        code: `const obj = { a: 1 };
const arr = [obj, obj];
arr[0].a = 2;
console.log(arr[1].a);`,
                        output: "2",
                        explanation: "Objects are passed by reference, so both array elements point to the same object"
                    }
                ]
            },
            Python: {
                easy: [
                    {
                        code: `x = [1, 2, 3]
y = x
y.append(4)
print(len(x))`,
                        output: "4",
                        explanation: "Lists are mutable and passed by reference"
                    }
                ],
                medium: [
                    {
                        code: `def func(lst=[]):
    lst.append(1)
    return lst

print(func())
print(func())`,
                        output: "[1]\n[1, 1]",
                        explanation: "Mutable default arguments are dangerous - they persist between function calls"
                    }
                ]
            }
        };
    }

    initializePracticalScenarios() {
        return {
            JavaScript: [
                {
                    scenario: "You're building a search feature that should wait for the user to stop typing before making an API call. What technique would you use?",
                    options: [
                        "Debouncing",
                        "Throttling", 
                        "Polling",
                        "WebSockets"
                    ],
                    correct: 0,
                    explanation: "Debouncing delays the API call until the user stops typing for a specified time"
                },
                {
                    scenario: "Your React component is re-rendering too often and causing performance issues. What would you use to optimize it?",
                    options: [
                        "useCallback and useMemo",
                        "useState and useEffect",
                        "setTimeout and clearTimeout",
                        "try/catch blocks"
                    ],
                    correct: 0,
                    explanation: "useCallback memoizes functions and useMemo memoizes expensive calculations"
                }
            ],
            Python: [
                {
                    scenario: "You need to process a large CSV file without loading it entirely into memory. What approach would you use?",
                    options: [
                        "Read the file line by line using a generator",
                        "Load the entire file into a list",
                        "Use pandas read_csv with no parameters",
                        "Use pickle to serialize the data"
                    ],
                    correct: 0,
                    explanation: "Generators allow you to process data one item at a time without loading everything into memory"
                }
            ]
        };
    }

    async generateQuestions(skills, difficulty, count = 15) {
        console.log(`🎯 Generating ${count} questions for skills: ${skills.join(', ')} at ${difficulty} level`);
        console.log(`🎲 Random seed: ${Math.random()}`);
        
        const questions = [];
        const questionsPerSkill = Math.ceil(count / skills.length);

        for (const skill of skills) {
            console.log(`🔍 Generating questions for ${skill}...`);
            // Generate different types of questions
            const skillQuestions = await this.generateSkillQuestions(skill, difficulty, questionsPerSkill);
            console.log(`✅ Generated ${skillQuestions.length} questions for ${skill}`);
            questions.push(...skillQuestions);
        }

        console.log(`📚 Total questions before shuffle: ${questions.length}`);
        
        // Shuffle questions and limit to requested count
        const shuffled = this.shuffleArray(questions).slice(0, count);
        console.log(`🔀 Questions after shuffle: ${shuffled.length}`);
        
        // Add API questions if available
        try {
            const apiQuestions = await this.fetchAPIQuestions(skills, difficulty);
            if (apiQuestions.length > 0) {
                console.log(`🌐 Adding ${apiQuestions.length} API questions`);
                // Replace some generated questions with API questions
                const replaceCount = Math.min(apiQuestions.length, Math.floor(count * 0.3));
                shuffled.splice(0, replaceCount, ...apiQuestions.slice(0, replaceCount));
            }
        } catch (error) {
            console.log('📡 API questions not available, using generated questions only');
        }

        const finalQuestions = this.shuffleArray(shuffled);
        
        // Remove duplicates by question text
        const uniqueQuestions = this.removeDuplicateQuestions(finalQuestions);
        
        console.log(`🎯 Final questions generated: ${uniqueQuestions.length}`);
        console.log(`🔍 Removed ${finalQuestions.length - uniqueQuestions.length} duplicate questions`);
        
        // Log first few questions for debugging
        uniqueQuestions.slice(0, 3).forEach((q, i) => {
            console.log(`Q${i + 1}: ${q.question.substring(0, 50)}... (${q.type}, ${q.skill})`);
        });

        return uniqueQuestions;
    }

    removeDuplicateQuestions(questions) {
        const seen = new Set();
        return questions.filter(question => {
            const key = question.question.substring(0, 50); // Use first 50 chars as key
            if (seen.has(key)) {
                console.log(`🚫 Duplicate question detected: ${key}...`);
                return false;
            }
            seen.add(key);
            return true;
        });
    }

    async generateSkillQuestions(skill, difficulty, count) {
        const questions = [];
        const templates = this.questionTemplates[skill];
        
        if (!templates) {
            // Generate generic questions for unknown skills
            return this.generateGenericQuestions(skill, difficulty, count);
        }

        const questionTypes = ['conceptual', 'coding', 'practical'];
        const typeWeights = {
            easy: { conceptual: 0.6, coding: 0.2, practical: 0.2 },
            medium: { conceptual: 0.4, coding: 0.4, practical: 0.2 },
            hard: { conceptual: 0.3, coding: 0.4, practical: 0.3 }
        };

        // Generate more questions than needed to ensure uniqueness
        const extraQuestions = Math.ceil(count * 1.5);
        
        for (let i = 0; i < extraQuestions; i++) {
            const questionType = this.selectWeightedRandom(questionTypes, typeWeights[difficulty]);
            
            let question;
            switch (questionType) {
                case 'conceptual':
                    question = this.generateConceptualQuestion(skill, difficulty);
                    break;
                case 'coding':
                    question = this.generateCodingQuestion(skill, difficulty);
                    break;
                case 'practical':
                    question = this.generatePracticalQuestion(skill, difficulty);
                    break;
            }
            
            if (question) {
                questions.push(question);
            }
        }

        // Remove duplicates and return requested count
        const uniqueQuestions = this.removeDuplicateQuestions(questions);
        return uniqueQuestions.slice(0, count);
    }

    generateConceptualQuestion(skill, difficulty) {
        const templates = this.questionTemplates[skill]?.conceptual || [];
        if (templates.length === 0) {
            return this.generateFallbackQuestion(skill, difficulty);
        }
        
        const template = templates[Math.floor(Math.random() * templates.length)];
        const questionId = `${skill}_${difficulty}_${Date.now()}_${Math.random()}`;
        
        if (template.concepts) {
            const concept = template.concepts[Math.floor(Math.random() * template.concepts.length)];
            const question = template.template.replace('{concept1}', concept.concept1).replace('{concept2}', concept.concept2);
            
            // Add some randomness to make questions more unique
            const questionVariation = Math.random() < 0.5 ? 
                `${question}` : 
                `In ${skill}, ${question.toLowerCase()}`;
            
            console.log(`🧠 Generated conceptual question: ${questionVariation.substring(0, 30)}...`);
            
            return {
                id: questionId,
                question: questionVariation,
                type: 'conceptual',
                skill: skill,
                difficulty: difficulty,
                options: this.generateConceptualOptions(skill, concept),
                correct: 0,
                explanation: `Understanding the difference between ${concept.concept1} and ${concept.concept2} is crucial for ${skill} development.`
            };
        }

        if (template.actions) {
            const action = template.actions[Math.floor(Math.random() * template.actions.length)];
            const question = template.template.replace('{action}', action.action);
            
            console.log(`🧠 Generated method question: ${question.substring(0, 30)}...`);
            
            return {
                id: questionId,
                question: question,
                type: 'conceptual',
                skill: skill,
                difficulty: difficulty,
                options: this.generateMethodOptions(action.answer),
                correct: 0,
                explanation: `${action.answer} is the correct method to ${action.action}.`
            };
        }

        return this.generateFallbackQuestion(skill, difficulty);
    }

    generateCodingQuestion(skill, difficulty) {
        const codeSnippets = this.codeSnippets[skill]?.[difficulty] || [];
        
        if (codeSnippets.length > 0) {
            const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            
            return {
                question: `What will the following ${skill} code output?\n\n\`\`\`${skill.toLowerCase()}\n${snippet.code}\n\`\`\``,
                type: 'coding',
                skill: skill,
                difficulty: difficulty,
                options: this.generateCodeOutputOptions(snippet.output),
                correct: 0,
                explanation: snippet.explanation
            };
        }

        return this.generateFallbackQuestion(skill, difficulty);
    }

    generatePracticalQuestion(skill, difficulty) {
        const scenarios = this.practicalScenarios[skill] || [];
        
        if (scenarios.length > 0) {
            const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            
            return {
                question: scenario.scenario,
                type: 'practical',
                skill: skill,
                difficulty: difficulty,
                options: scenario.options,
                correct: scenario.correct,
                explanation: scenario.explanation
            };
        }

        return this.generateFallbackQuestion(skill, difficulty);
    }

    generateGenericQuestions(skill, difficulty, count) {
        const genericQuestions = [
            {
                question: `What is a common best practice when working with ${skill}?`,
                options: [
                    "Write clean, readable code",
                    "Use as many features as possible",
                    "Avoid documentation",
                    "Never use external libraries"
                ],
                correct: 0,
                explanation: "Clean, readable code is always a best practice regardless of the technology."
            },
            {
                question: `Which of the following is most important when learning ${skill}?`,
                options: [
                    "Understanding the fundamentals",
                    "Memorizing all syntax",
                    "Using the latest features only",
                    "Avoiding practice projects"
                ],
                correct: 0,
                explanation: "Understanding fundamentals provides a solid foundation for any technology."
            }
        ];

        return genericQuestions.slice(0, count);
    }

    generateConceptualOptions(skill, concept) {
        const correctAnswers = [
            `${concept.concept1} and ${concept.concept2} serve different purposes and have distinct characteristics`,
            `They have different behaviors and use cases in ${skill}`,
            `${concept.concept1} and ${concept.concept2} are fundamentally different concepts`,
            `They work differently and are used in different scenarios`
        ];
        
        const wrongAnswers = [
            `${concept.concept1} and ${concept.concept2} are exactly the same`,
            `${concept.concept1} is deprecated in modern ${skill}`,
            `${concept.concept2} is not a valid ${skill} concept`,
            `They are interchangeable in all cases`,
            `${concept.concept1} is just an alias for ${concept.concept2}`,
            `Both are outdated and should not be used`
        ];
        
        // Pick one correct answer and 3 wrong answers
        const correctAnswer = correctAnswers[Math.floor(Math.random() * correctAnswers.length)];
        const selectedWrongAnswers = this.shuffleArray(wrongAnswers).slice(0, 3);
        
        const options = [correctAnswer, ...selectedWrongAnswers];
        return this.shuffleArray(options);
    }

    generateMethodOptions(correctAnswer) {
        const options = [correctAnswer];
        
        // Add some plausible wrong answers
        const wrongAnswers = [
            correctAnswer.replace('()', 'Method()'),
            correctAnswer.replace('()', 'Function()'),
            correctAnswer.replace(/[A-Z]/g, char => char.toLowerCase())
        ];
        
        options.push(...wrongAnswers.slice(0, 3));
        return this.shuffleArray(options);
    }

    generateCodeOutputOptions(correctOutput) {
        const options = [correctOutput];
        
        // Generate plausible wrong answers
        const wrongAnswers = [
            'undefined',
            'null',
            'Error',
            'ReferenceError',
            'false',
            'true',
            '0',
            '1'
        ];
        
        // Add 3 random wrong answers that aren't the correct answer
        const filteredWrong = wrongAnswers.filter(ans => ans !== correctOutput);
        options.push(...filteredWrong.slice(0, 3));
        
        return this.shuffleArray(options);
    }

    generateFallbackQuestion(skill, difficulty) {
        return {
            question: `What is an important concept to understand when working with ${skill}?`,
            type: 'conceptual',
            skill: skill,
            difficulty: difficulty,
            options: [
                "Understanding the documentation and best practices",
                "Memorizing every single function",
                "Avoiding any external resources",
                "Never asking for help"
            ],
            correct: 0,
            explanation: "Understanding documentation and best practices is crucial for any technology."
        };
    }

    async fetchAPIQuestions(skills, difficulty) {
        const apiQuestions = [];
        
        try {
            // Try to fetch from Open Trivia Database for general programming questions
            const response = await fetch('https://opentdb.com/api.php?amount=5&category=18&type=multiple');
            if (response.ok) {
                const data = await response.json();
                
                data.results.forEach(question => {
                    apiQuestions.push({
                        question: this.decodeHTML(question.question),
                        type: 'api',
                        skill: 'General Programming',
                        difficulty: difficulty,
                        options: this.shuffleArray([
                            this.decodeHTML(question.correct_answer),
                            ...question.incorrect_answers.map(ans => this.decodeHTML(ans))
                        ]),
                        correct: 0, // We'll need to track the correct answer after shuffling
                        explanation: "This question was sourced from an external API for variety."
                    });
                });
            }
        } catch (error) {
            console.log('📡 Could not fetch API questions:', error);
        }

        return apiQuestions;
    }

    decodeHTML(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    selectWeightedRandom(items, weights) {
        const random = Math.random();
        let weightSum = 0;
        
        for (const item of items) {
            weightSum += weights[item];
            if (random <= weightSum) {
                return item;
            }
        }
        
        return items[items.length - 1];
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the question generator
const questionGenerator = new QuestionGenerator();

// ===========================================
// ENHANCED ASSESSMENT FUNCTIONS
// ===========================================

async function startAssessment() {
    if (assessmentState.selectedSkills.length === 0) {
        showNotification('Please select at least one skill to assess', 'warning');
        return;
    }
    
    try {
        showNotification('🚀 Generating your personalized assessment...', 'info');
        
        // Clear any existing questions
        assessmentState.questions = [];
        assessmentState.currentQuestion = 0;
        assessmentState.answers = [];
        assessmentState.startTime = new Date();
        
        console.log('🔄 Starting fresh assessment session...');
        console.log('📋 Selected skills:', assessmentState.selectedSkills);
        console.log('⚙️ Difficulty level:', assessmentState.difficulty);
        
        // Generate dynamic questions
        const questions = await questionGenerator.generateQuestions(
            assessmentState.selectedSkills, 
            assessmentState.difficulty, 
            15
        );
        
        assessmentState.questions = questions;
        
        console.log('✅ Generated questions:', questions);
        console.log('🎯 Total unique questions:', questions.length);
        
        // Update total questions display
        const totalQuestionsElement = document.getElementById('total-questions');
        if (totalQuestionsElement) {
            totalQuestionsElement.textContent = questions.length;
        }
        
        // Show assessment interface
        document.getElementById('assessment-intro').style.display = 'none';
        document.getElementById('assessment-quiz').style.display = 'block';
        
        // Start timer
        startTimer();
        
        // Display first question
        displayQuestion(0);
        
        // Update progress
        updateProgress();
        
        showNotification('🎯 Assessment started! Good luck!', 'success');
        
    } catch (error) {
        console.error('Error starting assessment:', error);
        showNotification('Error starting assessment. Please try again.', 'error');
    }
}

function displayQuestion(index) {
    const question = assessmentState.questions[index];
    
    if (!question) {
        console.error('No question found at index:', index);
        return;
    }
    
    console.log('📝 Displaying question:', index + 1, 'of', assessmentState.questions.length);
    console.log('📋 Question ID:', question.id);
    console.log('📋 Question text:', question.question.substring(0, 50) + '...');
    
    // Add question type indicator
    const typeIndicator = question.type === 'coding' ? '💻' : 
                         question.type === 'practical' ? '🛠️' : '🧠';
    
    // Update question number
    const questionNumElement = document.getElementById('question-num');
    if (questionNumElement) {
        questionNumElement.textContent = index + 1;
    }
    
    // Update question text with type indicator
    const questionTextElement = document.getElementById('question-text');
    if (questionTextElement) {
        questionTextElement.innerHTML = `
            <div class="question-meta" style="font-size: 0.9rem; color: #666; margin-bottom: 10px;">
                <span class="question-type">${typeIndicator} ${question.type.charAt(0).toUpperCase() + question.type.slice(1)}</span>
                <span class="question-skill" style="margin-left: 10px;">${question.skill}</span>
                <span class="question-difficulty" style="margin-left: 10px; text-transform: capitalize;">${question.difficulty}</span>
            </div>
            ${question.question}
        `;
    }
    
    // Update question options (shuffle them for variety)
    const questionOptionsElement = document.getElementById('question-options');
    if (questionOptionsElement) {
        // Create a copy of options with their original indices
        const optionsWithIndices = question.options.map((option, i) => ({ option, originalIndex: i }));
        
        // Shuffle the options
        const shuffledOptions = questionGenerator.shuffleArray(optionsWithIndices);
        
        questionOptionsElement.innerHTML = shuffledOptions.map((item, i) => `
            <label class="option-label">
                <input type="radio" name="question-${index}" value="${item.originalIndex}">
                <span class="option-text">${item.option}</span>
            </label>
        `).join('');
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = index === 0;
    }
    
    if (nextBtn) {
        nextBtn.textContent = index === assessmentState.questions.length - 1 ? 'Submit Assessment' : 'Next';
        nextBtn.innerHTML = index === assessmentState.questions.length - 1 ? 
            '<i class="fas fa-check"></i> Submit Assessment' : 
            'Next <i class="fas fa-arrow-right"></i>';
    }
    
    // Restore previous answer if exists (only when going back)
    const previousAnswer = assessmentState.answers[index];
    if (previousAnswer !== undefined && previousAnswer !== null) {
        setTimeout(() => {
            const radioButton = document.querySelector(`input[name="question-${index}"][value="${previousAnswer}"]`);
            if (radioButton) {
                radioButton.checked = true;
                console.log(`🔄 Restored answer for question ${index + 1}: option ${previousAnswer}`);
            }
        }, 100);
    }
}

function nextQuestion() {
    // Save current answer
    const selectedOption = document.querySelector(`input[name="question-${assessmentState.currentQuestion}"]:checked`);
    if (selectedOption) {
        assessmentState.answers[assessmentState.currentQuestion] = parseInt(selectedOption.value);
        console.log(`💾 Saved answer for question ${assessmentState.currentQuestion + 1}: option ${selectedOption.value}`);
    } else {
        console.log(`⚠️ No answer selected for question ${assessmentState.currentQuestion + 1}`);
    }
    
    // Move to next question or submit
    if (assessmentState.currentQuestion < assessmentState.questions.length - 1) {
        assessmentState.currentQuestion++;
        console.log(`➡️ Moving to question ${assessmentState.currentQuestion + 1}`);
        displayQuestion(assessmentState.currentQuestion);
        updateProgress();
    } else {
        submitAssessment();
    }
}

function previousQuestion() {
    if (assessmentState.currentQuestion > 0) {
        assessmentState.currentQuestion--;
        displayQuestion(assessmentState.currentQuestion);
        updateProgress();
    }
}

function updateProgress() {
    const progress = ((assessmentState.currentQuestion + 1) / assessmentState.questions.length) * 100;
    const progressBar = document.getElementById('quiz-progress');
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    if (currentQuestionElement) {
        currentQuestionElement.textContent = assessmentState.currentQuestion + 1;
    }
    
    if (totalQuestionsElement) {
        totalQuestionsElement.textContent = assessmentState.questions.length;
    }
    
    console.log(`📊 Progress: ${assessmentState.currentQuestion + 1}/${assessmentState.questions.length} (${progress.toFixed(1)}%)`);
}

function startTimer() {
    assessmentState.timerInterval = setInterval(() => {
        assessmentState.timeRemaining--;
        
        if (assessmentState.timeRemaining <= 0) {
            clearInterval(assessmentState.timerInterval);
            submitAssessment();
        }
        
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(assessmentState.timeRemaining / 60);
    const seconds = assessmentState.timeRemaining % 60;
    const timerDisplay = document.getElementById('timer');
    
    if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning color when time is running low
        if (assessmentState.timeRemaining < 300) { // 5 minutes
            timerDisplay.style.color = '#ef4444';
        }
    }
}

function submitAssessment() {
    clearInterval(assessmentState.timerInterval);
    
    // Calculate results
    const results = calculateResults();
    assessmentState.results = results;
    
    // Show results
    showResults(results);
    
    showNotification('🎉 Assessment completed! Review your results below.', 'success');
}

function calculateResults() {
    let totalScore = 0;
    let correctAnswers = 0;
    const skillScores = {};
    
    assessmentState.questions.forEach((question, index) => {
        const userAnswer = assessmentState.answers[index];
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) {
            correctAnswers++;
            totalScore++;
        }
        
        // Calculate skill-specific scores
        if (!skillScores[question.skill]) {
            skillScores[question.skill] = { correct: 0, total: 0 };
        }
        skillScores[question.skill].total++;
        if (isCorrect) skillScores[question.skill].correct++;
    });
    
    const overallScore = Math.round((correctAnswers / assessmentState.questions.length) * 100);
    const endTime = new Date();
    const timeTaken = Math.round((endTime - assessmentState.startTime) / 1000);
    
    return {
        overallScore,
        correctAnswers,
        totalQuestions: assessmentState.questions.length,
        skillScores,
        timeTaken,
        difficulty: assessmentState.difficulty,
        timestamp: endTime
    };
}

function showResults(results) {
    document.getElementById('assessment-quiz').style.display = 'none';
    document.getElementById('assessment-results').style.display = 'block';
    
    // Display overall results
    const overallScoreElement = document.getElementById('overall-score');
    if (overallScoreElement) {
        overallScoreElement.textContent = results.overallScore;
    }
    
    // Display skill breakdown
    const skillScores = document.getElementById('skill-scores');
    if (skillScores) {
        skillScores.innerHTML = Object.entries(results.skillScores).map(([skill, scores]) => {
            const percentage = Math.round((scores.correct / scores.total) * 100);
            return `
                <div class="skill-score-item">
                    <div class="skill-name">${skill}</div>
                    <div class="skill-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="skill-percentage">${percentage}%</span>
                    </div>
                    <div class="skill-details">${scores.correct}/${scores.total} correct</div>
                </div>
            `;
        }).join('');
    }
    
    // Generate recommendations
    generateRecommendations(results);
    
    // Add summary info
    const summaryInfo = `
        <div class="assessment-summary" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <h4>Assessment Summary</h4>
            <div style="display: flex; gap: 20px; margin-top: 10px;">
                <div><strong>Questions Answered:</strong> ${results.correctAnswers}/${results.totalQuestions}</div>
                <div><strong>Time Taken:</strong> ${Math.floor(results.timeTaken / 60)}:${(results.timeTaken % 60).toString().padStart(2, '0')}</div>
                <div><strong>Difficulty:</strong> ${results.difficulty}</div>
            </div>
        </div>
    `;
    
    if (skillScores) {
        skillScores.insertAdjacentHTML('afterbegin', summaryInfo);
    }
}

function generateRecommendations(results) {
    const recommendations = [];
    
    // Overall performance recommendation
    if (results.overallScore >= 85) {
        recommendations.push({
            icon: 'fas fa-star',
            title: 'Excellent Performance!',
            description: 'You demonstrated strong knowledge across all areas. Consider advanced topics or specialization.'
        });
    } else if (results.overallScore >= 70) {
        recommendations.push({
            icon: 'fas fa-chart-line',
            title: 'Good Foundation',
            description: 'Solid understanding with room for growth. Focus on practice and real-world application.'
        });
    } else {
        recommendations.push({
            icon: 'fas fa-book',
            title: 'Keep Learning',
            description: 'Great start! Focus on fundamentals and consistent practice to build your skills.'
        });
    }
    
    // Skill-specific recommendations
    Object.entries(results.skillScores).forEach(([skill, scores]) => {
        const percentage = (scores.correct / scores.total) * 100;
        
        if (percentage < 60) {
            recommendations.push({
                icon: 'fas fa-lightbulb',
                title: `Improve ${skill}`,
                description: `Focus on strengthening your ${skill} fundamentals. Consider taking a comprehensive course or tutorial.`
            });
        } else if (percentage >= 90) {
            recommendations.push({
                icon: 'fas fa-medal',
                title: `${skill} Expert`,
                description: `Excellent ${skill} skills! Consider mentoring others or exploring advanced topics.`
            });
        }
    });
    
    const recommendationsContainer = document.getElementById('recommendations');
    if (recommendationsContainer) {
        recommendationsContainer.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="rec-icon">
                    <i class="${rec.icon}"></i>
                </div>
                <div class="rec-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            </div>
        `).join('');
    }
}

function retakeAssessment() {
    // Reset state
    assessmentState.questions = [];
    assessmentState.currentQuestion = 0;
    assessmentState.answers = [];
    assessmentState.results = null;
    assessmentState.timeRemaining = 30 * 60;
    
    // Show intro screen
    document.getElementById('assessment-results').style.display = 'none';
    document.getElementById('assessment-intro').style.display = 'block';
    
    showNotification('🔄 Ready to take a new assessment!', 'info');
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

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
        max-width: 350px;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Additional functions for HTML buttons
function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'My TalentVault Assessment Results',
            text: `I scored ${assessmentState.results.overallScore}% on my skill assessment! 🎉`,
            url: window.location.href
        });
    } else {
        // Fallback: Copy to clipboard
        const shareText = `I scored ${assessmentState.results.overallScore}% on my TalentVault skill assessment! Check out TalentVault for AI-powered skill evaluation.`;
        navigator.clipboard.writeText(shareText);
        showNotification('Results copied to clipboard!', 'success');
    }
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Export functions for global access
window.startAssessment = startAssessment;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.submitAssessment = submitAssessment;
window.retakeAssessment = retakeAssessment;
window.shareResults = shareResults;
window.goToDashboard = goToDashboard; 