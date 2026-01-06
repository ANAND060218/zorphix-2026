import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCode,
    FaTerminal,
    FaLaptopCode,
    FaUndo,
    FaCoffee,
    FaPuzzlePiece,
    FaProjectDiagram,
    FaBolt
} from 'react-icons/fa';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import EventModal from './EventModal';

const EventsPage = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedEventsList, setSelectedEventsList] = useState(() => {
        try {
            const stored = localStorage.getItem('selectedEvents');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [registeredEventsList, setRegisteredEventsList] = useState([]);

    useEffect(() => {
        // Listen for auth state changes to sync with DB if registered
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, 'registrations', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.events && Array.isArray(data.events)) {
                            // Database has Mixed Case (e.g. "Pixel Reforge"), mapped to title for local logic
                            const dbEvents = data.events;

                            // Update state
                            setRegisteredEventsList(dbEvents);

                            // Merge DB events with existing local selection to ensure nothing is lost
                            setSelectedEventsList(prev => {
                                const newSet = new Set([...prev, ...dbEvents]);
                                const newList = Array.from(newSet);
                                localStorage.setItem('selectedEvents', JSON.stringify(newList));
                                return newList;
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error syncing events from DB:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleAddeEvent = (event) => {
        // Prevent removing/toggling if already registered
        if (registeredEventsList.includes(event.name)) return;

        let updatedList;
        if (selectedEventsList.includes(event.name)) {
            // Remove
            updatedList = selectedEventsList.filter(title => title !== event.name);
        } else {
            // Add
            updatedList = [...selectedEventsList, event.name];
        }
        setSelectedEventsList(updatedList);
        localStorage.setItem('selectedEvents', JSON.stringify(updatedList));
    };

    const technicalEvents = [
        {
            id: 'pixel-reforge',
            name: 'Pixel Reforge',
            subtitle: 'UI Revamp',
            icon: FaCode, // Changed to Code/Palette related
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
        }
    ];

    return (
        <div className="min-h-screen text-white font-mono relative overflow-x-hidden">

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

            <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter sm:tracking-widest mb-4 glitch-text" data-text="EVENTS">
                        EVENTS
                    </h1>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#e33e33] via-[#97b85d] to-[#e33e33]"></div>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                        Explore our lineup of cutting-edge technical challenges designed to test your skills at Zorphix '26
                    </p>
                </motion.div>

                {/* Events Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {technicalEvents.map((event, index) => (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group relative"
                            >
                                {/* Card Background - Massive Realistic Metal Card */}
                                <div className={`relative w-full aspect-[1.58/1] bg-gradient-to-br from-[#1c1c1c] via-[#0d0d0d] to-[#000] rounded-2xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-500 transform group-hover:scale-[1.05] group-hover:-translate-y-2 ${registeredEventsList.includes(event.name)
                                    ? 'border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] grayscale-[0.3]'
                                    : selectedEventsList.includes(event.name)
                                        ? 'border-2 border-[#97b85d] shadow-[0_0_30px_rgba(151,184,93,0.3)]'
                                        : 'border border-white/5 group-hover:shadow-[0_20px_50px_rgba(227,62,51,0.15)]'
                                    }`}>

                                    {/* Registered Watermark */}
                                    {registeredEventsList.includes(event.name) && (
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none rotate-[-30deg]">
                                            <span className="text-6xl md:text-8xl font-black text-blue-500/10 tracking-widest border-4 border-blue-500/10 px-8 py-2 rounded-xl">
                                                REGISTERED
                                            </span>
                                        </div>
                                    )}

                                    {/* Brushed Metal Texture */}
                                    <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>

                                    {/* Holographic Sheen */}
                                    <div className="absolute -inset-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[25deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out pointer-events-none blur-sm"></div>

                                    {/* Card Content */}
                                    <div className="p-5 md:p-7 flex-1 flex flex-col justify-between relative z-10 h-full">

                                        {/* Top Header */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner border border-white/10 ${registeredEventsList.includes(event.name)
                                                    ? 'bg-gradient-to-br from-blue-600 to-blue-900'
                                                    : selectedEventsList.includes(event.name)
                                                        ? 'bg-gradient-to-br from-[#97b85d] to-[#4a5c2d]'
                                                        : 'bg-gradient-to-br from-[#e33e33] to-[#800000]'
                                                    }`}>
                                                    <event.icon className="text-white text-xs" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold tracking-[0.25em] text-gray-300 uppercase font-mono text-shadow-sm leading-none">ZORPHIX BANK</span>
                                                    <span className={`text-[6px] tracking-[0.2em] uppercase font-mono mt-1 ${registeredEventsList.includes(event.name)
                                                        ? 'text-blue-400'
                                                        : selectedEventsList.includes(event.name)
                                                            ? 'text-[#97b85d]'
                                                            : 'text-[#e33e33]'
                                                        }`}>
                                                        {registeredEventsList.includes(event.name) ? 'REGISTERED MEMBER' : 'WORLD ELITE'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-mono text-white/40 tracking-widest border border-white/20 px-1 rounded">DEBIT</span>
                                                {/* Contactless Icon */}
                                                <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3" />
                                                    <path d="M4.93 4.93c-1.2 1.2-1.93 2.76-1.93 4.57s.73 3.37 1.93 4.57l1.41-1.41c-.82-.82-1.34-1.95-1.34-3.16s.52-2.34 1.34-3.16L4.93 4.93zM8.46 8.46c-.43.43-.69.99-.69 1.62s.26 1.19.69 1.62l1.41-1.41c-.06-.06-.1-.13-.1-.21s.04-.15.1-.21L8.46 8.46zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 1.79 4 4-1.79 4-4 4z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Chip & Event Title */}
                                        <div className="mt-2">
                                            <div className="flex justify-between items-end mb-4">
                                                <div className="w-12 h-9 bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#C49303] rounded-md border border-[#FDB931] shadow-md relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40"></div>
                                                    <div className="absolute top-0 left-1/2 h-full w-[1px] bg-black/40"></div>
                                                    <div className="absolute top-1/2 left-1/2 w-4 h-3 border border-black/40 rounded-[2px] -translate-x-1/2 -translate-y-1/2"></div>
                                                </div>
                                                <div className="text-[8px] text-white/30 font-mono tracking-widest">
                                                    AUTHORIZED SIGNATURE
                                                </div>
                                            </div>

                                            <h3 className="text-xl md:text-2xl lg:text-3xl font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400 tracking-[0.15em] uppercase truncate drop-shadow-[2px_4px_6px_rgba(0,0,0,0.8)] filter shadow-inner font-bold" style={{ textShadow: '-1px -1px 0 rgba(255,255,255,0.1), 2px 2px 4px rgba(0,0,0,0.8)' }}>
                                                {event.name}
                                            </h3>

                                            <div className="flex gap-4 mt-2 mb-4">
                                                <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">4520</span>
                                                <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">****</span>
                                                <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">****</span>
                                                <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">8892</span>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <span className="block text-[5px] md:text-[6px] text-gray-400 uppercase tracking-widest mb-0.5">MEMBER SINCE</span>
                                                    <span className="text-xs md:text-sm text-white font-mono tracking-wider">2024</span>
                                                </div>
                                                <div>
                                                    <span className="block text-[5px] md:text-[6px] text-gray-400 uppercase tracking-widest mb-0.5">VALID THRU</span>
                                                    <span className="text-xs md:text-sm text-white font-mono tracking-wider">03/26</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Footer */}
                                        <div className="flex justify-between items-end border-t border-white/5 pt-2 mt-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-4 bg-white/10 rounded-sm flex items-center justify-center border border-white/5">
                                                    <span className="text-[6px] text-white/50 font-bold">VIP</span>
                                                </div>
                                                <div className="text-[10px] md:text-xs text-gray-300 font-mono uppercase tracking-wider">{event.subtitle}</div>
                                            </div>

                                            <div className="text-right flex items-center gap-3">
                                                <div className="text-white/30 font-bold italic text-lg md:text-xl tracking-tighter">VISA</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Actions Below Card */}
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        className="flex-1 py-3 bg-[#1a1a1a] rounded-lg border border-[#e33e33] text-[#e33e33] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#e33e33] hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(227,62,51,0.2)] hover:shadow-[0_0_20px_rgba(227,62,51,0.6)]"
                                    >
                                        Know More
                                    </button>
                                    <button
                                        onClick={() => handleAddeEvent(event)}
                                        disabled={registeredEventsList.includes(event.name)}
                                        className={`flex-1 py-3 rounded-lg border font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 ${registeredEventsList.includes(event.name)
                                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600 text-gray-400 shadow-none cursor-not-allowed opacity-80'
                                            : selectedEventsList.includes(event.name)
                                                ? 'bg-[#97b85d] text-black border-[#97b85d] shadow-[0_0_10px_rgba(151,184,93,0.2)]'
                                                : 'bg-[#1a1a1a] border-[#97b85d] text-[#97b85d] hover:bg-[#97b85d] hover:text-black shadow-[0_0_10px_rgba(151,184,93,0.2)] hover:shadow-[0_0_20px_rgba(151,184,93,0.6)]'
                                            }`}>
                                        {registeredEventsList.includes(event.name)
                                            ? 'REGISTERED'
                                            : selectedEventsList.includes(event.name) ? 'ADDED' : 'ADD'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Scrolling decorative text */}
            <div className="fixed -right-20 top-1/2 -translate-y-1/2 rotate-90 opacity-10 pointer-events-none hidden lg:block">
                <span className="text-9xl font-bold text-transparent stroke-text-white tracking-widest">
                    SYMPOSIUM '26
                </span>
            </div>

            <style jsx>{`
                .stroke-text-white {
                    -webkit-text-stroke: 2px rgba(255,255,255,0.2);
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e33e33;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #97b85d;
                }
            `}</style>

            <EventModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
            />
        </div>
    );
};

export default EventsPage;
