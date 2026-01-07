import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CurrencyBackground from './CurrencyBackground';
import CoinBackground from './CoinBackground';
import zorphixName from '../assets/zorphix.png';

const About = () => {
    const [tickerTime, setTickerTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTickerTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const teamMembers = [
        { role: "Chief Architect", name: "SYSTEM_ADMIN", id: "0XA1", status: "ONLINE", clearance: "Level 5" },
        { role: "Lead Developer", name: "CODE_MASTER", id: "0XB2", status: "BUSY", clearance: "Level 4" },
        { role: "Security Ops", name: "FIREWALL_01", id: "0XC3", status: "ACTIVE", clearance: "Level 5" },
        { role: "Data Analyst", name: "ANALYTICS", id: "0XD4", status: "PROCESSING", clearance: "Level 4" },
    ];

    const stats = [
        { label: "Total Events", value: "25+", change: "▲ 12.5%", trend: "up" },
        { label: "Workshops", value: "15+", change: "▲ 5.2%", trend: "up" },
        { label: "Participants", value: "5000+", change: "▲ 24.8%", trend: "up" },
        { label: "Sponsors", value: "30+", change: "▲ 8.1%", trend: "up" },
    ];

    const offerings = [
        { title: "Technical Workshops", type: "Education", size: "Hands-on Sesh", desc: "Learn from industry experts." },
        { title: "Technical Events", type: "Competition", size: "Showcase", desc: "Battle of the brains." },
        { title: "Networking", type: "Community", size: "Unlimited", desc: "Connect with peers and mentors." },
    ];

    return (
        <div className="relative min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-[#97b85d] selection:text-black">

            {/* Background Layers */}
            <CurrencyBackground />
            <CoinBackground />

            {/* Subtle Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

            {/* TOP TICKER BAR - Simplified */}
            <div className="sticky top-0 z-50 bg-black/80 border-b border-white/5 backdrop-blur-md flex justify-between items-center px-6 py-3 text-xs tracking-wider text-gray-400">
                <div className="flex gap-6">
                    <span className="text-[#97b85d] font-semibold">ZORPHIX SYSTEM: STABLE</span>
                    <span className="hidden md:inline">VOLUME: 24.5M</span>
                </div>
                <div>
                    {tickerTime.toLocaleTimeString()} // SYMPOSIUM '26
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative z-10 flex flex-col gap-20">

                {/* HERO SECTION - Spacious & Clean */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1 space-y-6 p-8 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-[#97b85d] rounded-full animate-pulse"></div>
                            <span className="text-[#97b85d] text-sm font-medium tracking-widest">STATUS: PRE-REGISTRATION</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none text-white flex flex-col items-start gap-2">
                            ABOUT <br />
                            <img
                                src={zorphixName}
                                alt="ZORPHIX"
                                className="h-16 md:h-24 w-auto object-contain opacity-90 filter brightness-110 mt-2"
                            />
                        </h1>
                        <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                            A cutting-edge technical symposium where innovation meets execution. We are building the infrastructure for the next generation of tech leaders.
                        </p>
                    </div>
                    {/* Hero Graphic / Decorative Market Cap */}
                    <div className="hidden md:block w-72 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="text-sm text-gray-400 mb-2">MARKET CAP</div>
                        <div className="text-4xl font-bold text-white mb-2">$ZPX 2.4B</div>
                        <div className="text-[#97b85d] text-sm flex items-center gap-2">
                            <span>▲ 4.2% (24h)</span>
                            <span className="px-2 py-0.5 bg-[#97b85d]/20 rounded text-[10px] font-bold">BULLISH</span>
                        </div>
                        <div className="h-16 mt-6 flex items-end gap-1 opacity-50">
                            {[...Array(12)].map((_, j) => (
                                <div key={j} className="w-full bg-[#97b85d]" style={{ height: `${20 + (j * 37) % 80}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* STATS - Spacious Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-black/60 backdrop-blur-md border border-white/10 data-card p-6 rounded-xl hover:border-[#97b85d]/50 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
                                <span className="text-xs font-bold text-[#97b85d] bg-[#97b85d]/10 px-2 py-1 rounded">{stat.change}</span>
                            </div>
                            <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                            {/* Simple trend line */}
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#97b85d] w-2/3 group-hover:w-full transition-all duration-500 ease-out"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* MISSION & VISION - Readable */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-4 p-8 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl h-full">
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <div className="w-12 h-1 bg-[#e33e33] mb-6"></div>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            To construct a trading environment for ideas. We provide the infrastructure for developers to deploy reckless innovation.
                        </p>
                    </div>
                    <div className="md:col-span-8 bg-zinc-900/30 border border-white/5 rounded-2xl p-8 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-3 h-3 rounded-full bg-[#e33e33]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#fdb931]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#97b85d]"></div>
                            <span className="text-xs text-gray-500 uppercase tracking-widest ml-2">Executive Summary</span>
                        </div>
                        <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
                            "Zorphix Symposium is not merely an event; it is a catalyst. A localized singularity where the vector sum of ambition and capability approaches infinity."
                        </p>
                    </div>
                </div>

                {/* OFFERINGS - Clean List */}
                <div>
                    <div className="flex items-center justify-between mb-8 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
                        <h2 className="text-3xl font-bold">Offerings Portfolio</h2>
                        <a href="/events" className="text-[#97b85d] hover:text-white transition-colors text-sm font-bold tracking-widest">VIEW ALL ASSETS →</a>
                    </div>
                    <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm">
                        <div className="grid grid-cols-12 bg-white/5 p-4 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10">
                            <div className="col-span-4">Asset Name</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-2">Duration</div>
                            <div className="col-span-4">Description</div>
                        </div>
                        {offerings.map((offer, i) => (
                            <div key={i} className="grid grid-cols-12 p-6 border-b border-white/5 hover:bg-white/5 transition-colors items-center group">
                                <div className="col-span-4 text-lg font-bold text-white group-hover:text-[#97b85d] transition-colors">{offer.title}</div>
                                <div className="col-span-2 text-sm text-gray-400 bg-white/5 self-start inline-block px-2 py-1 rounded w-max">{offer.type}</div>
                                <div className="col-span-2 text-sm text-gray-400">{offer.size}</div>
                                <div className="col-span-4 text-sm text-gray-500">{offer.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TEAM - Clean Cards */}
                <div>
                    <h2 className="text-3xl font-bold mb-12 text-center">Core Operatives</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, i) => (
                            <div key={i} className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-[#97b85d] transition-colors group relative overflow-hidden">
                                <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 rounded ${member.status === 'ONLINE' || member.status === 'ACTIVE' ? 'bg-[#97b85d]/20 text-[#97b85d]' : 'bg-[#e33e33]/20 text-[#e33e33]'}`}>
                                    {member.status}
                                </div>

                                <div className="w-20 h-20 bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-full p-[2px] mb-6">
                                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold">{member.name[0]}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-[#97b85d] text-sm uppercase tracking-wider mb-4">{member.role}</p>

                                <div className="pt-4 border-t border-white/10 text-xs text-gray-500 flex justify-between">
                                    <span>ID: {member.id}</span>
                                    <span>CLR: {member.clearance}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA - Spacious */}
                <div className="text-center py-20 border-t border-white/10 bg-black/60 backdrop-blur-md rounded-2xl p-8 mt-12 border border-white/10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Invest in <span className="text-[#97b85d]">Your Future?</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                        Join the most innovative technical symposium of 2026. Secure your spot on the register.
                    </p>
                    <div className="flex gap-6 justify-center">
                        <Link to="/" className="px-8 py-4 bg-[#97b85d] text-black font-bold rounded hover:bg-white transition-colors text-lg">
                            Initialize Registration
                        </Link>
                        <Link to="/" className="px-8 py-4 border border-white/20 text-white font-bold rounded hover:bg-white/10 transition-colors text-lg">
                            Go To Home
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
