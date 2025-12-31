import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaPalette, FaTools, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTrophy } from 'react-icons/fa';
import Background from './Background';

const EventsPage = () => {
    const [activeTab, setActiveTab] = useState('technical');

    const categories = [
        { id: 'technical', label: 'TECHNICAL', icon: FaBolt, color: '#e33e33' },
        { id: 'non-technical', label: 'NON-TECHNICAL', icon: FaPalette, color: '#97b85d' },
        { id: 'workshops', label: 'WORKSHOPS', icon: FaTools, color: '#ffa500' },
    ];

    const events = {
        technical: [
            { id: 1, title: 'CODE WARS', date: 'March 15', venue: 'Main Lab', team: '2-3', prize: '₹15,000', desc: 'The ultimate competitive coding battle. Solve complex algorithms and climb the leaderboard.' },
            { id: 2, title: 'CYBER HEIST', date: 'March 16', venue: 'Security Lab', team: '4', prize: '₹10,000', desc: 'A CTF challenge where you hack into secure systems to retrieve the flags.' },
            { id: 3, title: 'AI NEXUS', date: 'March 15', venue: 'Seminar Hall', team: '2', prize: '₹12,000', desc: 'Build and showcase innovative AI models to solve real-world problems.' },
            { id: 4, title: 'WEB WIZARDS', date: 'March 16', venue: 'Browsing Centre', team: '2-3', prize: '₹8,000', desc: 'Design and deploy a stunning web application within a set timeframe.' },
            { id: 5, title: 'ROBO RUMBLE', date: 'March 15', venue: 'Open Ground', team: '4', prize: '₹20,000', desc: 'Heavy metal mayhem. Build robots to destroy your opponents in the arena.' },
            { id: 6, title: 'CIRCUITRIX', date: 'March 16', venue: 'Hardware Lab', team: '2', prize: '₹7,000', desc: 'Debug complex circuits and design efficient hardware solutions.' },
        ],
        'non-technical': [
            { id: 7, title: 'LENS LEGENDS', date: 'March 15', venue: 'Campus wide', team: '1', prize: '₹5,000', desc: 'Capture the essence of the symposium through your lens. Photography contest.' },
            { id: 8, title: 'MEME MASTERS', date: 'Online', venue: 'Discord', team: '1', prize: '₹3,000', desc: 'Create the most hilarious and relatable tech memes.' },
            { id: 9, title: 'GAMING ARENA', date: 'March 15-16', venue: 'Gaming Zone', team: '5', prize: '₹15,000', desc: 'Valorant and BGMI tournaments. Dominate the server.' },
            { id: 10, title: 'TREASURE HUNT', date: 'March 16', venue: 'Campus wide', team: '3', prize: '₹6,000', desc: 'Solve riddles and follow clues to find the hidden treasure.' },
            { id: 11, title: 'QUIZ BOWL', date: 'March 15', venue: 'Auditorium', team: '2', prize: '₹4,000', desc: 'Test your general knowledge and tech trivia skills.' },
        ],
        workshops: [
            { id: 12, title: 'ETHICAL HACKING', date: 'March 15', venue: 'Lab 1', team: 'Individual', prize: 'Certificate', desc: 'Learn the fundamentals of cybersecurity and penetration testing.' },
            { id: 13, title: 'APP DEV', date: 'March 16', venue: 'Lab 2', team: 'Individual', prize: 'Certificate', desc: 'Master Flutter and build cross-platform mobile applications.' },
            { id: 14, title: 'BLOCKCHAIN', date: 'March 15', venue: 'Lab 3', team: 'Individual', prize: 'Certificate', desc: 'Understand the decentralized web and build your first DApp.' },
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono relative overflow-x-hidden">
            <Background />

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
                        Explore our lineup of competitions and workshops designed to challenge your skills and ignite your passion.
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-4 mb-16 pb-4 px-4 custom-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`flex-shrink-0 relative px-6 py-3 md:px-8 md:py-4 clip-path-polygon transition-all duration-300 group overflow-hidden ${activeTab === cat.id
                                ? 'text-black font-bold'
                                : 'text-gray-400 hover:text-white bg-black/50 border border-white/10'
                                }`}
                            style={{
                                backgroundColor: activeTab === cat.id ? cat.color : 'transparent',
                                borderColor: activeTab === cat.id ? cat.color : '',
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2 tracking-widest text-xs md:text-sm whitespace-nowrap">
                                <cat.icon className="text-lg" /> {cat.label}
                            </span>
                            {activeTab !== cat.id && (
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Events Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {events[activeTab].map((event) => (
                            <motion.div
                                key={event.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="group relative"
                            >
                                {/* Card Background - Ultra Realistic Credit Card Style */}
                                <div className="relative w-full aspect-[1.58/1] bg-gradient-to-br from-[#2a2a2a] via-[#111] to-[#000] rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col transition-all duration-300 transform group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]">

                                    {/* Noise Texture */}
                                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                                    {/* Glossy Sheen */}
                                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 transform translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

                                    {/* World Map / Pattern Overlay */}
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/87/World_map_blank_gmt.svg')] bg-cover bg-center mix-blend-overlay pointer-events-none"></div>

                                    {/* Card Content */}
                                    <div className="p-4 md:p-6 flex-1 flex flex-col justify-between relative z-10 h-full">
                                        <div>
                                            {/* Top Row: Bank Name & Contactless */}
                                            <div className="flex justify-between items-start mb-2 md:mb-6">
                                                <div className="flex items-center gap-2">
                                                    <FaBolt className="text-[#e33e33]" />
                                                    <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-300 uppercase font-mono">
                                                        ZORPHIX
                                                    </span>
                                                </div>
                                                {/* Contactless Symbol */}
                                                <svg className="w-6 h-6 md:w-8 md:h-8 text-white/80 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                                            </div>

                                            {/* Middle: Chip & Number */}
                                            <div className="flex items-center gap-4 md:gap-6 mb-2 md:mb-4">
                                                <div className="w-10 h-7 md:w-12 md:h-9 bg-gradient-to-br from-[#ffd700] to-[#b8860b] rounded-md border border-[#ffd700]/50 relative overflow-hidden shadow-md">
                                                    <div className="absolute inset-0 border border-black/20 rounded-md"></div>
                                                    <div className="w-full h-[1px] bg-black/30 absolute top-1/2 -translate-y-1/2"></div>
                                                    <div className="h-full w-[1px] bg-black/30 absolute left-1/2 -translate-x-1/2"></div>
                                                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-black/30 rounded-sm"></div>
                                                </div>
                                                <div className="text-xl md:text-2xl font-mono text-white/50 tracking-widest">
                                                    ••••
                                                </div>
                                            </div>

                                            {/* Event Title as Card Number */}
                                            <h3 className="text-lg md:text-2xl font-mono text-white tracking-[0.15em] uppercase drop-shadow-md truncate font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.9)' }}>
                                                {event.title}
                                            </h3>

                                            <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                                                <span className="text-[8px] md:text-[10px] font-mono text-white/60">4242</span>
                                                <span className="text-[8px] md:text-[10px] font-mono text-white/60">7569</span>
                                                <span className="text-[8px] md:text-[10px] font-mono text-white/60">0000</span>
                                                <span className="text-[8px] md:text-[10px] font-mono text-white/60">{2026 + event.id}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end mt-2 md:mt-4">
                                            <div>
                                                <div className="flex gap-2 md:gap-4 text-[8px] md:text-[9px] text-gray-400 uppercase font-mono mb-1">
                                                    <div>
                                                        <span className="block text-[5px] md:text-[6px]">Valid Thru</span>
                                                        <span className="text-white">{event.date}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[5px] md:text-[6px]">Prize Limit</span>
                                                        <span className="text-[#e33e33] font-bold tracking-widest">₹{event.prize.replace('₹', '')}</span>
                                                    </div>
                                                </div>
                                                <p className="font-mono text-xs md:text-sm tracking-widest text-[#97b85d] uppercase shadow-black drop-shadow-sm">
                                                    {event.venue}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-white font-bold italic tracking-wider text-base md:text-xl opacity-80">RuptPay</div>
                                                <div className="text-[5px] md:text-[6px] text-gray-500 uppercase">Platinum</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Below Card */}
                                <div className="mt-4 flex gap-3">
                                    <button className="flex-1 py-3 bg-[#1a1a1a] rounded-lg border border-[#e33e33] text-[#e33e33] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#e33e33] hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(227,62,51,0.2)] hover:shadow-[0_0_20px_rgba(227,62,51,0.6)]">
                                        Know More
                                    </button>
                                    <button className="flex-1 py-3 bg-[#1a1a1a] rounded-lg border border-[#97b85d] text-[#97b85d] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#97b85d] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(151,184,93,0.2)] hover:shadow-[0_0_20px_rgba(151,184,93,0.6)]">
                                        Register
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div >

            {/* Scrolling decorative text */}
            < div className="fixed -right-20 top-1/2 -translate-y-1/2 rotate-90 opacity-10 pointer-events-none hidden lg:block" >
                <span className="text-9xl font-bold text-transparent stroke-text-white tracking-widest">
                    SYMPOSIUM '26
                </span>
            </div >

            <style jsx>{`
                .clip-path-polygon {
                    clip-path: polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%);
                }
                .stroke-text-white {
                    -webkit-text-stroke: 2px rgba(255,255,255,0.2);
                }
                /* Glitch effect keys would go here or in global css */
                
                .custom-scrollbar::-webkit-scrollbar {
                    height: 2px;
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
        </div >
    );
};

export default EventsPage;
