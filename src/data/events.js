import {
    FaCode,
    FaTerminal,
    FaLaptopCode,
    FaUndo,
    FaCoffee,
    FaPuzzlePiece,
    FaProjectDiagram,
    FaLightbulb,
    FaWrench,
    FaScroll
} from 'react-icons/fa';

export const technicalEvents = [
    {
        id: 'pixel-reforge',
        name: 'Pixel Reforge',
        subtitle: 'UI Revamp',
        icon: FaCode,
        color: '#e33e33',
        teamSize: '1-2',
        desc: 'Pixel Reforge is a two-round UI engineering challenge where teams redesign a given interface to improve usability, responsiveness, and visual appeal. The event tests core frontend skills first, followed by real-world UI enhancement using AI.',
        heads: 'S. Aishwarya (73056 03846), Mohanapriya D (86789 18941)',
        rounds: [
            'Round 1 – Core UI Fundamentals (No AI): Design and build a webpage using HTML, CSS, JavaScript, React. Focus on clean layout, responsive design, typography. Power Cards may be used strategically.',
            'Round 2 – Advanced UI Enhancement (AI Allowed): Fix bugs in a pre-built project, improve responsiveness, add features. AI tools allowed but must explain every change.'
        ],
        rules: [
            'Team: 1-2 members',
            'Bring your own laptops',
            'Only AI tools suggested by organizers (Round 2 only)',
            'VSCode platform must be used',
            'Strictly abide by all rules'
        ],
        price: 'FREE',
        quote: 'Redesign. Rethink. Reimagine.'
    },
    {
        id: 'promptcraft',
        name: 'PromptCraft',
        subtitle: 'Promptopia',
        icon: FaTerminal,
        color: '#97b85d',
        teamSize: '1-2',
        desc: 'PromptCraft (Promptopia) is a two-round prompt engineering challenge that tests how well participants convert visual understanding into precise AI prompts. Teams attempt to recreate a given reference image using AI image-generation tools within limited attempts. The event highlights creativity, accuracy, and strategic thinking.',
        heads: 'Ashanthika Raja (63836 68658), Jyotsna S (99400 86664)',
        rounds: [
            'Round 1 – Open Prompt Recreation',
            'Round 2 – Constrained Prompt Engineering (With Restrictions)'
        ],
        rules: [
            'Team: 1-2 members',
            'Only AI image-generation tools; no manual editing',
            'Max 3 prompt attempts per round',
            'Submit final image + exact prompts used',
            'Round 2 restrictions must be followed strictly',
            'Judges\' decision is final'
        ],
        price: 'FREE',
        quote: 'Where words command intelligence.'
    },
    {
        id: 'algopulse',
        name: 'AlgoPulse',
        subtitle: 'Algo Rhythm',
        icon: FaLaptopCode,
        color: '#ffa500',
        teamSize: '1-2',
        desc: 'AlgoPulse (Algo Rhythm) is a high-energy algorithmic coding competition where participants solve programming problems while loud background music plays continuously to create distraction. The event also includes Advantage and Hindrance tasks to test focus, adaptability, and performance under pressure.',
        heads: 'Kiruthika M (63829 81249), Amirthavarshini H (98410 75452)',
        rounds: [
            'Round 1 – Algorithmic Screening: Basic to intermediate problems',
            'Round 2 – Advanced Algorithm Challenge: For shortlisted teams only'
        ],
        rules: [
            'Team: 1-2 members',
            'Advantage Task before event; winner gets special advantage',
            'Hindrance Tasks between rounds for distraction',
            'Evaluation based on platform rank/score only',
            'AI tools strictly prohibited',
            'Screen sharing & camera must remain ON'
        ],
        price: 'FREE',
        quote: 'Feel the beat of logic.'
    },
    {
        id: 'reverse-coding',
        name: 'Reverse Coding',
        subtitle: 'CodeBack',
        icon: FaUndo,
        color: '#e33e33',
        teamSize: '1-2',
        desc: 'Think you can crack the code? In Reverse Coding, the problem statement remains hidden. Participants rely only on output patterns, sample inputs, or program behavior to uncover the logic and build the solution. It\'s a true test of analytical thinking, pattern recognition, and real-world problem-solving skills.',
        heads: 'Subha Shree (97877 57657), Kaladevi (63820 30143)',
        rounds: [
            'Round 1 – Logic Deduction (30 mins)',
            'Round 2 – Advanced Reverse Coding (30 mins)'
        ],
        rules: [
            'Team: 1-2 members',
            'Complete problem statement NOT provided',
            'Any programming language allowed',
            'Shortlisting based on Round 1 performance',
            'Programs must generate exact expected output',
            'Malpractice leads to disqualification'
        ],
        price: 'FREE',
        quote: 'Decode the outcome. Rebuild the logic.'
    },
    {
        id: 'sip-to-survive',
        name: 'Sip to Survive',
        subtitle: 'Mark Is Testing',
        icon: FaCoffee,
        color: '#97b85d',
        teamSize: '2-3',
        desc: 'A fast-paced technical endurance challenge where teams solve continuous coding, debugging, and logic-based tasks while handling intentional distractions through interval-based beverage consumption.',
        heads: 'Maneesh (90251 12972), Anand (73583 10946)',
        rounds: [
            'Continuous coding, debugging, and logic-based tasks',
            'Beverage consumption at regular intervals'
        ],
        rules: [
            'Team: 2-3 members',
            'Solve max tasks within given time',
            'Consume beverages (lemon extract, ginger shot, etc.) at intervals',
            'Special privileges to avoid beverages or speed up tasks',
            'Most points wins',
            'Bring your own laptops',
            'Only organizer-suggested AI tools allowed'
        ],
        price: 'FREE',
        quote: 'Test the test. Break the rules.'
    },
    {
        id: 'codecrypt',
        name: 'CodeCrypt',
        subtitle: 'Snippet Clues',
        icon: FaPuzzlePiece,
        color: '#ffa500',
        teamSize: '1-2',
        desc: 'CodeCrypt is a technical puzzle-based coding event where participants analyze code snippets to uncover hidden clues. Instead of writing programs, teams must understand, interpret, and decode given code under time pressure. It challenges how well you can think through code, predict outputs, and identify patterns.',
        heads: 'Diya Akshita (63691 53979), Sangeetha B (89255 30515)',
        rounds: [
            'Multiple rounds with increasing difficulty',
            'Code snippets hide clues to uncover'
        ],
        rules: [
            'Team: 1-2 members',
            'AI tools strictly prohibited',
            'Use only provided code snippets',
            'Submit correct clue within time',
            'Wrong answers add time penalties',
            'Solve all required questions to advance',
            'Rankings based on total time + penalties'
        ],
        price: 'FREE',
        quote: 'Every clue compiles a truth.'
    },
    {
        id: 'linklogic',
        name: 'LinkLogic',
        subtitle: 'Connections',
        icon: FaProjectDiagram,
        color: '#e33e33',
        teamSize: '2',
        desc: 'A multi-round technical linking challenge designed to test analytical thinking, pattern recognition, and speed. Teams race against the clock to identify hidden relationships between technical terms, concepts, and code elements. Progress from basic connections to complex cross-domain logic.',
        heads: 'Shreyas Manivannan (94980 73776), Muthaiah Pandi RP (85318 19732)',
        rounds: [
            'Round 1 (20 mins): Direct relationships between terms & symbols',
            'Round 2 (20 mins): Indirect connections between algorithms, APIs',
            'Round 3 (30 mins): Abstract cross-domain logical links'
        ],
        rules: [
            'Team: Exactly 2 members',
            'No AI tools or internet allowed',
            'Incorrect answers incur penalties',
            'Hints (Round 3) incur penalties',
            'Clear current round to advance',
            'Judges\' decisions are final'
        ],
        price: 'FREE',
        quote: 'Connect the dots. Crack the logic.'
    },
    {
        id: 'pitchfest',
        name: 'Pitchfest',
        subtitle: 'Business Pitch',
        icon: FaLightbulb,
        color: '#97b85d',
        teamSize: '1-4',
        desc: 'On-the-spot problem statements will be given to the players, who must create a business model with a proper revenue model and strategy, and pitch the business model to the judge.',
        heads: 'Puvaneshwari K (97910 33668), Sivadarshan (93615 35161)',
        rounds: [
            'Model Development: 20 minutes',
            'Pitch: 3 minutes + Q&A: 2 minutes'
        ],
        rules: [
            'Team: 1-4 members',
            'No PPT; only charts/sketches/templates provided',
            'No mobile phones or laptops during competition',
            'No AI or external resources',
            'No discussion with other teams',
            'Rankings based on solution accuracy',
            'Time penalties for hints/assistance'
        ],
        price: 'FREE',
        quote: 'Where ideas ignite opportunity.'
    }
];

export const paperPresentation = [
    {
        id: 'paper-presentation',
        name: 'Paper Presentation',
        subtitle: 'Innovation',
        icon: FaScroll,
        color: '#ffa500',
        teamSize: '1-3',
        desc: 'A platform to showcase innovative ideas and technical research. Participants present their papers on trending technologies.',
        heads: 'Gokul D (93455 41273)',
        rounds: [
            'Round 1 – Abstract Submission',
            'Round 2 – Final Presentation'
        ],
        rules: [
            'Team: 1-3 members',
            'Submit abstract before deadline',
            'Presentation: 7 mins + Q&A: 3 mins',
            'Judges\' decision is final'
        ],
        price: '₹120',
        quote: 'Present. Publish. Prevail.'
    }
];

export const workshops = [
    {
        id: 'fintech-workshop',
        name: 'FinTech Workshop',
        subtitle: 'Finance Meets Technology',
        icon: FaWrench,
        color: '#e33e33',
        teamSize: 'Individual',
        desc: 'Explore the systems that power digital payments, AI-driven finance, and secure transactions. An engaging, beginner-friendly workshop designed to give you real-world FinTech exposure.',
        heads: 'Priyanka L Sharma (63854 94091), P T Manisha (95081 47649)',
        rounds: ['Interactive Workshop'],
        rules: [
            'Mode: Interactive & activity-driven',
            'Quiz at the end',
            'Laptop recommended'
        ],
        highlights: [
            'FinTech Fundamentals',
            'Digital Payments & UPI Architecture',
            'FinTech Architecture & Cloud Systems',
            'Cybersecurity & Fraud Detection',
            'AI in Finance',
            'Blockchain, Crypto & Digital Assets',
            'FinTech Regulations & Ethics',
            'Careers & Startup Opportunities'
        ],
        price: '₹50',
        quote: 'Finance meets innovation.'
    },
    {
        id: 'wealthx-workshop',
        name: 'WealthX Workshop',
        subtitle: 'Personal Finance & Investing',
        icon: FaWrench,
        color: '#97b85d',
        teamSize: 'Individual',
        desc: 'WealthX is a beginner-friendly, interactive workshop designed to help students build a strong foundation in personal finance and investing. Learn how wealth is built over time, the importance of financial discipline, and how to make smarter financial choices from an early stage.',
        heads: 'Poonggundraan S (70106 25181), Haroon (93619 92667)',
        rounds: ['Interactive Workshop'],
        rules: [
            'Duration: 2 Hours',
            'Mode: Interactive, activity-driven & discussion-based',
            'Participation: Individual & Team-based',
            'No prior finance or investment knowledge required',
            'Participants must bring a laptop',
            'Arrive on time'
        ],
        highlights: [
            'Personal Finance Fundamentals',
            'Income, Expenses & Budgeting',
            'Savings & Emergency Planning',
            'Basics of Investing & Wealth Creation',
            'Risk vs Reward Understanding',
            'Financial Discipline & Long-Term Thinking',
            'Common Financial Mistakes to Avoid'
        ],
        activities: [
            'Budget Planning Challenge',
            'Real-Life Financial Decision Scenarios',
            'Investment Basics Simulation',
            'WealthX Quiz'
        ],
        price: '₹50',
        quote: 'Build wealth. Build your future.'
    }
];
