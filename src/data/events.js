import {
    FaCode,
    FaTerminal,
    FaLaptopCode,
    FaUndo,
    FaCoffee,
    FaPuzzlePiece,
    FaProjectDiagram,
    FaLink,
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
        desc: 'A two-stage UI engineering challenge that evaluates participants’ frontend fundamentals first, followed by real-world UI enhancement skills using AI as an accelerator.',
        heads: 'S. Aishwarya, Mohanapriya D',
        rounds: [
            'Round 1 – Core UI Fundamentals (No AI)',
            'Round 2 – Advanced UI Enhancement (AI Allowed)'
        ],
        rules: [
            'Only shortlisted teams from Round 1 may participate',
            'Time limit: 45 minutes',
            'AI tools are allowed (ChatGPT, Copilot, design generators, etc.)',
            'Teams must enhance the same UI from Round 1',
            'Mandatory benchmark enhancements must be met'
        ],
        price: 'FREE'
    },
    {
        id: 'promptcraft',
        name: 'PromptCraft',
        subtitle: 'Promptopia',
        icon: FaTerminal,
        color: '#97b85d',
        desc: 'A two-round prompt engineering challenge that tests how effectively teams can translate visual understanding into precise prompts.',
        heads: 'Ashanthika Raja, Jyotsna S',
        rounds: [
            'Round 1 – Open Prompt Recreation (No Prompt Restrictions)',
            'Round 2 – Constrained Prompt Engineering (With Restrictions)'
        ],
        rules: [
            'Teams must bring their own laptops and internet access.',
            'AI accounts and tools must be personally owned by participants.',
            'Sharing prompts or outputs with other teams is prohibited.',
            'Any form of plagiarism or copying prompts from other teams is prohibited.',
            'Judges’ decision is final and binding.'
        ],
        price: 'FREE'
    },
    {
        id: 'algopulse',
        name: 'AlgoPulse',
        subtitle: 'Algo Rhythm',
        icon: FaLaptopCode,
        color: '#ffa500',
        desc: 'A competitive algorithmic coding event designed to test logical thinking, problem-solving ability, and implementation skills under strict proctoring, with zero AI assistance.',
        heads: 'Kiruthika M, Amirthavarshini H',
        rounds: [
            'Round 1 – Algorithmic Screening',
            'Round 2 – Advanced Algorithm Challenge'
        ],
        rules: [
            'Participants are recommended/preferred to bring their own laptops and chargers.',
            'Computers will also be provided for participants if required.',
            'Stable internet connectivity is mandatory.',
            'One team member must be prepared to explain the solution if asked.',
            'Judges’ decisions are final and binding.',
            'Any form of misconduct leads to immediate disqualification.'
        ],
        price: 'FREE'
    },
    {
        id: 'codeback',
        name: 'CodeBack',
        subtitle: 'Reverse Coding',
        icon: FaUndo,
        color: '#e33e33',
        desc: 'A reverse-engineering coding challenge that tests participants’ ability to deduce hidden logic from outputs, reconstruct algorithms, and implement correct and efficient solutions.',
        heads: 'Gayathri R, Subha Shree B',
        rounds: [
            'Round 1 – Logic Deduction & Reconstruction',
            'Round 2 – Advanced Reverse Engineering'
        ],
        rules: [
            'Participants are recommended/preferred to bring their own laptops and chargers.',
            'Computers will also be provided for participants if required.',
            'Participants must have an HackerRank account.',
            'Judges’ decisions are final and binding.',
            'Fair play is expected; teams should work independently.'
        ],
        price: 'FREE'
    },
    {
        id: 'sip-to-survive',
        name: 'Sip to Survive',
        subtitle: 'Mark Is Testing',
        icon: FaCoffee,
        color: '#97b85d',
        desc: 'A fast-paced technical endurance challenge where teams solve continuous coding, debugging, and logic-based tasks while handling intentional distractions through timed beverage consumption.',
        heads: 'Maneesh, Anand',
        rounds: [
            'Fast-paced technical endurance challenge',
            'Continuous coding, debugging, and logic-based tasks'
        ],
        rules: [
            'Teams must bring their own laptops and chargers.',
            'Only tools explicitly allowed by organizers may be used.',
            'Judges’ and organizers’ decisions are final and binding.',
            'Any rule violation results in immediate disqualification.'
        ],
        price: 'FREE'
    },
    {
        id: 'codecrypt',
        name: 'CodeCrypt',
        subtitle: 'Snippet Clues',
        icon: FaPuzzlePiece,
        color: '#ffa500',
        desc: 'A multi-round technical puzzle challenge where teams analyze code snippets to uncover hidden clues. Each round progressively increases in difficulty.',
        heads: 'Manisha, Diya Akshita, Sangeetha B',
        rounds: [
            'Round 1 – Entry Level',
            'Round 2 – Intermediate',
            'Round 3 – Advanced'
        ],
        rules: [
            'No AI tools allowed',
            'No internet allowed',
            'No collaboration with other teams',
            'Teams must use only the provided code',
            'Laptops and chargers required',
            'Judges’ decisions are final'
        ],
        price: 'FREE'
    },
    {
        id: 'linklogic',
        name: 'LinkLogic',
        subtitle: 'Connections',
        icon: FaProjectDiagram,
        color: '#e33e33',
        desc: 'A multi-round technical reasoning challenge where participants identify hidden relationships between technical terms, concepts, or code elements.',
        heads: 'Muthaiah Pandi RP, Shreyas Manivannan, Joel Niruban Isaac',
        rounds: [
            'Round 1 – Basic Technical Connections',
            'Round 2 – Intermediate Concept Mapping'
        ],
        rules: [
            'Only teams clearing Round 1 advance.',
            'Sets may include algorithms, data structures, APIs, error messages, or outputs.',
            'Teams must explain how each element is connected, not just state the final answer.',
            'Partial explanations may earn partial credit.',
            'Time-based scoring applies.'
        ],
        price: 'FREE'
    }
];

export const paperPresentation = [
    {
        id: 'paper-presentation',
        name: 'Paper Presentation',
        subtitle: 'Innovation',
        icon: FaCode,
        color: '#ffa500',
        desc: 'A platform to showcase innovative ideas and technical research. Participants present their papers on trending technologies.',
        heads: 'To be announced',
        rounds: [
            'Round 1 – Abstract Submission',
            'Round 2 – Final Presentation'
        ],
        rules: [
            'Teams must submit abstract before deadline.',
            'Presentation time limit: 7 minutes + 3 minutes Q&A.',
            'Judges’ decision is final.'
        ],
        price: '₹149'
    }
];

export const workshops = [
    {
        id: 'fintech-workshop',
        name: 'FinTech Workshop',
        subtitle: 'Finance Meets Technology',
        icon: FaCode,
        color: '#e33e33',
        desc: 'Explore the systems that power digital payments, AI-driven finance, and secure transactions. An engaging, beginner-friendly workshop designed to give you real-world FinTech exposure.',
        heads: 'Expert Speaker',
        rounds: ['Interactive Workshop (2 Hours)'],
        rules: [
            'Duration: 2 Hours',
            'Mode: Interactive & activity-driven',
            'Team-based activities included',
            'Laptop recommended'
        ],
        highlights: [
            'FinTech Fundamentals',
            'Digital Payments & UPI Architecture',
            'Cybersecurity & Fraud Detection',
            'AI in Finance',
            'Blockchain & Crypto Basics',
            'Career Opportunities in FinTech'
        ],
        price: '₹1'
    },
    {
        id: 'wealthx-workshop',
        name: 'WealthX Workshop',
        subtitle: 'Personal Finance & Career',
        icon: FaTerminal,
        color: '#97b85d',
        desc: 'A practical, beginner-friendly learning experience designed to help individuals build strong personal finance foundations, gain career clarity, and understand how businesses and startups work.',
        heads: 'Expert Speaker',
        rounds: ['Interactive Workshop (3 Hours)'],
        rules: [
            'Duration: 3 Hours',
            'Mode: Interactive & Activity-Driven',
            'Team-based participation',
            'Notebook recommended'
        ],
        highlights: [
            'Personal Finance Fundamentals',
            'Investing Basics & Wealth-Building',
            'Career Planning & Skill Development',
            'Business & Startup Fundamentals',
            'Idea Validation & Business Models',
            'Branding & Digital Presence'
        ],
        price: '₹1'
    }
];
