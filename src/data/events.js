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
        desc: 'A two-round UI engineering challenge where teams redesign a given interface to improve usability, responsiveness, and visual appeal. The event tests core frontend skills first, followed by real-world UI enhancement using AI.',
        heads: 'S. Aishwarya, Mohanapriya D, Shanjay, Vishal S',
        rounds: [
            'Round 1 – Core UI Fundamentals (No AI)',
            'Round 2 – Advanced UI Enhancement (AI Allowed)'
        ],
        rules: [
            'Team size: 1-2 members',
            'Teams must bring their own laptops.',
            'Only AI tools suggested by organizers are allowed (Round 2 only).',
            'VSCode platform must be used for coding.',
            'Only shortlisted teams from Round 1 advance to Round 2.',
            'Participants must strictly abide by all rules.'
        ],
        price: 'FREE'
    },
    {
        id: 'promptcraft',
        name: 'PromptCraft',
        subtitle: 'Promptopia',
        icon: FaTerminal,
        color: '#97b85d',
        teamSize: '1-2',
        desc: 'A two-round prompt engineering challenge that tests how well participants convert visual understanding into precise AI prompts. Teams attempt to recreate a given reference image using AI image-generation tools within limited attempts.',
        heads: 'Ashanthika Raja, Jyotsna S, Stefin Jude, Ramalingam',
        rounds: [
            'Round 1 – Open Prompt Recreation (No Restrictions)',
            'Round 2 – Constrained Prompt Engineering (With Restrictions)'
        ],
        rules: [
            'Team size: 1-2 members',
            'Only AI image-generation tools allowed; no manual editing.',
            'Maximum 3 prompt attempts per round.',
            'Submit final image and exact prompts used.',
            'Sharing prompts with other teams is prohibited.',
            'Plagiarism leads to immediate disqualification.',
            'Bring your own laptops, internet, and AI accounts.',
            'Judges\' decision is final.'
        ],
        price: 'FREE'
    },
    {
        id: 'algopulse',
        name: 'AlgoPulse',
        subtitle: 'Algo Rhythm',
        icon: FaLaptopCode,
        color: '#ffa500',
        teamSize: '1-2',
        desc: 'A high-energy algorithmic coding competition where participants solve programming problems while loud background music plays continuously. Includes Advantage and Hindrance tasks to test focus, adaptability, and performance under pressure.',
        heads: 'Kiruthika M, Amirthavarshini H, Pavadharani, Pradeep',
        rounds: [
            'Round 1 – Algorithmic Screening (Basic to Intermediate)',
            'Round 2 – Advanced Algorithm Challenge'
        ],
        rules: [
            'Team size: 1-2 members',
            'Bringing laptops is recommended but not mandatory.',
            'Participants must have a valid HackerRank account.',
            'AI tools are strictly prohibited.',
            'Screen sharing and camera must remain ON.',
            'Any malpractice leads to immediate disqualification.',
            'Judges\' decisions are final.'
        ],
        price: 'FREE'
    },
    {
        id: 'reverse-coding',
        name: 'Reverse Coding',
        subtitle: 'CodeBack',
        icon: FaUndo,
        color: '#e33e33',
        teamSize: '1-2',
        desc: 'In Reverse Coding, the problem statement remains hidden. Participants rely only on output patterns, sample inputs, or program behavior to uncover the logic and build the solution. A true test of analytical thinking and pattern recognition.',
        heads: 'Subha Shree, Kaladevi, Mahathi, Rahul Elango, Deepak',
        rounds: [
            'Round 1 – Logic Deduction (30 mins)',
            'Round 2 – Advanced Reverse Coding (30 mins)'
        ],
        rules: [
            'Team size: 1-2 members',
            'Complete problem statement will NOT be provided.',
            'Any programming language may be used.',
            'Shortlisting for Round 2 based on Round 1 performance.',
            'Programs must generate the exact expected output.',
            'Malpractice leads to immediate disqualification.',
            'Participants can bring laptops; systems provided if needed.'
        ],
        price: 'FREE'
    },
    {
        id: 'sip-to-survive',
        name: 'Sip to Survive',
        subtitle: 'Mark Is Testing',
        icon: FaCoffee,
        color: '#97b85d',
        teamSize: '2-3',
        desc: 'A fast-paced technical endurance challenge where teams solve continuous coding, debugging, and logic-based tasks while handling intentional distractions through interval-based beverage consumption.',
        heads: 'Maneesh, Anand, Meghaaa, Shreenidhi',
        rounds: [
            'Continuous coding, debugging, and logic-based tasks',
            'Beverage consumption at regular intervals'
        ],
        rules: [
            'Team size: 2-3 members',
            'Teams must bring their own laptops.',
            'Only AI tools suggested by organizers are allowed.',
            'Tasks vary in difficulty with corresponding points.',
            'Special privileges provided to avoid beverages or speed up tasks.',
            'Team with most points wins.',
            'Cash prizes and gift baskets for winners.'
        ],
        price: 'FREE'
    },
    {
        id: 'codecrypt',
        name: 'CodeCrypt',
        subtitle: 'Snippet Clues',
        icon: FaPuzzlePiece,
        color: '#ffa500',
        teamSize: '1-2',
        desc: 'A technical puzzle-based coding event where participants analyze code snippets to uncover hidden clues. Instead of writing programs, teams must understand, interpret, and decode given code under time pressure.',
        heads: 'Diya Akshita, Sangeetha B, Pawan Eswaran, Aarya',
        rounds: [
            'Round 1 – Entry Level',
            'Round 2 – Intermediate',
            'Round 3 – Advanced'
        ],
        rules: [
            'Team size: 1-2 members',
            'AI tools strictly prohibited.',
            'No internet access during the event.',
            'No collaboration with other teams.',
            'Teams must use only provided code snippets.',
            'Bring your own laptops and chargers.',
            'Rule violations result in disqualification.'
        ],
        price: 'FREE'
    },
    {
        id: 'linklogic',
        name: 'LinkLogic',
        subtitle: 'Connections',
        icon: FaProjectDiagram,
        color: '#e33e33',
        teamSize: '2',
        desc: 'A multi-round technical linking challenge designed to test analytical thinking, pattern recognition, and speed. Teams race against the clock to identify hidden relationships between technical terms, concepts, and code elements.',
        heads: 'Shreyas Manivannan, Muthaiah Pandi RP, Joel Niruban Isaac, Bhavana',
        rounds: [
            'Round 1 – Basic Connections (20 mins)',
            'Round 2 – Intermediate Concept Mapping (20 mins)',
            'Round 3 – Abstract Cross-Domain Logic (30 mins)'
        ],
        rules: [
            'Team size: Exactly 2 members',
            'No AI tools or internet usage allowed.',
            'Incorrect answers incur time/scoring penalties.',
            'Only teams clearing current round advance.',
            'Hints (Round 3) incur penalties.',
            'Bring your own laptops and chargers.',
            'Judges\' decisions are final.'
        ],
        price: 'FREE'
    },
    {
        id: 'pitchfest',
        name: 'Pitchfest',
        subtitle: 'Business Pitch',
        icon: FaLightbulb,
        color: '#97b85d',
        teamSize: '1-4',
        desc: 'On-the-spot problem statements will be given to the players, who must create a business model with a proper revenue model and strategy, and pitch the business model to the judge.',
        heads: 'Puvaneshwari K, Sivadarshan, Pragadeesh, Sam Francis',
        rounds: [
            'Round 1 – Easy Level',
            'Round 2 – Moderate Level',
            'Round 3 – Hard Level'
        ],
        rules: [
            'Team size: 1-4 members',
            'Model Development Time: 20 minutes',
            'Pitch Time: 3 minutes + 2 minutes Q&A',
            'No PPT allowed; only charts/sketches/templates provided.',
            'No mobile phones or laptops during competition.',
            'No AI or external resources allowed.',
            'No discussion with other teams.'
        ],
        price: 'FREE'
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
        heads: 'Gokul D',
        rounds: [
            'Round 1 – Abstract Submission',
            'Round 2 – Final Presentation'
        ],
        rules: [
            'Teams must submit abstract before deadline.',
            'Presentation time limit: 7 minutes + 3 minutes Q&A.',
            'Judges\' decision is final.'
        ],
        price: '₹120'
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
        heads: 'Priyanka L Sharma, P T Manisha, Gayathri R',
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
            'Cybersecurity & Fraud Detection in FinTech',
            'AI in Finance',
            'Blockchain, Crypto & Digital Assets',
            'FinTech Regulations & Ethics',
            'Careers & Startup Opportunities in FinTech'
        ],
        price: '₹50'
    }
];
