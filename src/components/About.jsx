import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import CurrencyBackground from './CurrencyBackground';
import CoinBackground from './CoinBackground';
import UniqueCarousel from './UniqueCarousel';
import { FaArrowRight, FaCode, FaChartLine, FaGlobe, FaGithub, FaLinkedin, FaBuilding, FaBrain, FaBalanceScale, FaPhone } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import zorphixLogo from '../assets/zorphix-logo.png';
import zorphixName from '../assets/zorphix.png';

const About = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const coreMembers = [
        {
            name: "Ja Dhaneesh Bala",
            role: "President",
            phone: "+91 824 875 0936"
        },
        {
            name: "Subiksha K",
            role: "Secretary",
            phone: "+91 97861 04200"
        },
        {
            name: "Magizhan J",
            role: "Event Organizer",
            phone: "+91 82700 50727"
        },
        {
            name: "Vithuna S",
            role: "Event Organizer",
            phone: "+91 87543 00205"
        }
    ];

    const team = [
        { name: "SYSTEM_ADMIN", role: "Architecture" },
        { name: "CODE_MASTER", role: "Development" },
        { name: "FIREWALL_01", role: "Security" },
        { name: "ANALYTICS", role: "Data Ops" },
    ];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#050505] text-white font-sans selection:bg-[#e33e33] selection:text-black overflow-x-hidden">

            {/* Backgrounds */}
            <CurrencyBackground />
            <CoinBackground />

            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="relative z-10 pt-20 pb-12">

                {/* COMPACT HERO */}
                <section className="mt-20 px-6 md:px-12 lg:px-20 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center flex flex-col items-center"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <img src={zorphixLogo} alt="Zorphix Logo" className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(227,62,51,0.5)]" />
                            <div className="w-px h-12 bg-white/20"></div>
                            <img src={zorphixName} alt="Zorphix Name" className="h-12 md:h-16 w-auto object-contain brightness-125 drop-shadow-[0_0_15px_rgba(227,62,51,0.3)]" />
                        </div>

                        <span className="text-[#97b85d] font-mono text-xs tracking-widest uppercase mb-4 block">/// Department of</span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2">
                            Computer Science & <br /> Business Systems
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base font-mono max-w-2xl mx-auto">
                            The degree program of the future.
                        </p>
                    </motion.div>
                </section>


                {/* ZORPHIX HIGHLIGHTS BENTO GRID */}
                <section className="px-6 md:px-12 lg:px-20 mb-20 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[500px]">

                        {/* Box 1: About ZORPHIX */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="md:col-span-2 md:row-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-[#97b85d]/30 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-[#97b85d] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity"></div>
                            <div>
                                <FaGlobe className="text-4xl text-white mb-6" />
                                <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">National Level Symposium</h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                    ZORPHIX is the flagship national-level technical symposium organized by the Department of Computer Science & Business Systems. Bringing together the brightest minds from across the country, ZORPHIX offers a platform for innovation, competition, and collaboration. From cutting-edge technical events to insightful workshops, our symposium is designed to challenge, inspire, and elevate future tech leaders. Join us in this celebration of technology, creativity, and excellence.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[#97b85d] text-xs font-mono uppercase tracking-widest mt-6">
                                <span className="w-2 h-2 bg-[#97b85d] rounded-full animate-pulse"></span>
                                Where Innovation Meets Excellence
                            </div>
                        </motion.div>

                        {/* Box 2: Participants */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-2 bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-2xl p-8 flex flex-col justify-center items-start hover:border-[#e33e33]/30 transition-colors relative overflow-hidden group"
                        >
                            <div className="absolute right-4 top-4 opacity-20 text-6xl font-black text-gray-800 pointer-events-none group-hover:scale-110 transition-transform">5000+</div>
                            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Growing Community</h4>
                            <h3 className="text-3xl font-black text-white">5000+ Participants</h3>
                            <p className="text-sm text-gray-400 mt-2">in past events from colleges across the nation</p>
                        </motion.div>

                        {/* Box 3: Sponsorships */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-center hover:bg-white/5 transition-colors"
                        >
                            <FaChartLine className="text-3xl text-[#97b85d] mb-4" />
                            <h4 className="font-bold text-lg mb-1">10+ Sponsorships</h4>
                            <p className="text-xs text-gray-500">Trusted partners over the years.</p>
                        </motion.div>

                        {/* Box 4: Events */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="md:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-center hover:bg-white/5 transition-colors"
                        >
                            <FaBrain className="text-3xl text-[#e33e33] mb-4" />
                            <h4 className="font-bold text-lg mb-1">11+ Events</h4>
                            <p className="text-xs text-gray-500">Exciting events & workshops conducted.</p>
                        </motion.div>

                    </div>
                </section>


                {/* CAROUSEL SECTION */}
                <section className="mb-20 overflow-hidden">
                    <div className="px-6 md:px-12 lg:px-20 mb-8 flex items-center justify-between">
                        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                            <span className="w-8 h-1 bg-[#97b85d]"></span>
                            Event Highlights
                        </h2>
                        <span className="text-xs font-mono text-gray-600 hidden md:block">/// ZORPHIX ARCHIVES</span>
                    </div>

                    <div className="relative">
                        {/* Ambient Glow behind carousel */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-[#97b85d]/5 blur-[100px] pointer-events-none"></div>
                        <UniqueCarousel />
                    </div>
                </section>


                {/* TIMELINE & TEAM (Compact Strip) */}
                <section className="px-6 md:px-12 lg:px-20 pb-20">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Core Members */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
                            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Core Team Members</h3>
                            <div className="space-y-4">
                                {coreMembers.map((member, i) => (
                                    <div key={i} className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-[#97b85d]/30">
                                        <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#97b85d] transition-colors">{member.name}</h4>
                                        <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-3">{member.role}</p>
                                        <div className="space-y-2">
                                            <a
                                                href={`tel:${member.phone}`}
                                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#e33e33] transition-colors group/link"
                                            >
                                                <FaPhone className="text-xs group-hover/link:scale-110 transition-transform" />
                                                <span className="font-mono">{member.phone}</span>
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA & Socials */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-[#e33e33] rounded-2xl p-8 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                                {/* Grain texture */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                                {/* Geometric pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 left-0 w-full h-full" style={{
                                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px),
                                                         repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)`
                                    }}></div>
                                </div>

                                {/* Animated gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 group-hover:from-black/10 group-hover:to-black/10 transition-all duration-500"></div>

                                <h3 className="text-2xl font-black uppercase mb-4 relative z-10">Join The Future</h3>
                                <Link to="/events" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded hover:scale-105 transition-transform relative z-10">
                                    Register Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;
