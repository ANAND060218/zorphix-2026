import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import CurrencyBackground from './CurrencyBackground';
import CoinBackground from './CoinBackground';
import UniqueCarousel from './UniqueCarousel';
import { FaArrowRight, FaCode, FaChartLine, FaGlobe, FaTwitter, FaGithub, FaLinkedin, FaBuilding, FaBrain, FaBalanceScale } from 'react-icons/fa';
import zorphixLogo from '../assets/zorphix-logo.png';
import zorphixName from '../assets/zorphix.png';

const About = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const timeline = [
        { year: "2024", title: "Genesis", desc: "Inception of Zorphix." },
        { year: "2025", title: "Fork", desc: "State-level expansion." },
        { year: "2026", title: "Mainnet", desc: "Global interconnectivity." }
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


                {/* CSBS BENTO GRID */}
                <section className="px-6 md:px-12 lg:px-20 mb-20 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[500px]">

                        {/* Box 1: Focus */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="md:col-span-2 md:row-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col justify-between hover:border-[#97b85d]/30 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-32 bg-[#97b85d] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-10 transition-opacity"></div>
                            <div>
                                <FaBuilding className="text-4xl text-white mb-6" />
                                <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Industry Integrated</h3>
                                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                    Computer Science & Business Systems is the first stream in engineering designed to meet the future demands of the rapidly changing tech industry in the era of Business 4.0. Designed by Tata Consultancy Services in an MoU with educational institutions, CSBS is the degree program of the future. The curriculum aims to ensure that the students graduating from the program not only skill up in computer science but also develop an equal appreciation of humanities and management sciences.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[#97b85d] text-xs font-mono uppercase tracking-widest mt-6">
                                <span className="w-2 h-2 bg-[#97b85d] rounded-full animate-pulse"></span>
                                Future Ready
                            </div>
                        </motion.div>

                        {/* Box 2: TCS Partnership */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-2 bg-gradient-to-br from-[#111] to-black border border-white/10 rounded-2xl p-8 flex flex-col justify-center items-start hover:border-[#e33e33]/30 transition-colors relative overflow-hidden group"
                        >
                            <div className="absolute right-4 top-4 opacity-20 text-6xl font-black text-gray-800 pointer-events-none group-hover:scale-110 transition-transform">TCS</div>
                            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Developed In MoU With</h4>
                            <h3 className="text-3xl font-black text-white italic">Tata Consultancy Services</h3>
                        </motion.div>

                        {/* Box 3: Curriculum */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-center hover:bg-white/5 transition-colors"
                        >
                            <FaCode className="text-3xl text-[#97b85d] mb-4" />
                            <h4 className="font-bold text-lg mb-1">Tech Skills</h4>
                            <p className="text-xs text-gray-500">Core CS competency & skilling up.</p>
                        </motion.div>

                        {/* Box 4: Humanities */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="md:col-span-1 bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col justify-center hover:bg-white/5 transition-colors"
                        >
                            <FaBalanceScale className="text-3xl text-[#e33e33] mb-4" />
                            <h4 className="font-bold text-lg mb-1">Humanities</h4>
                            <p className="text-xs text-gray-500">Appreciation of management sciences.</p>
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
                        {/* Timeline */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8">
                            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Evolutionary Path</h3>
                            <div className="space-y-6">
                                {timeline.map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-[#97b85d] transition-colors"></div>
                                            {i !== timeline.length - 1 && <div className="w-px h-full bg-white/10 my-1"></div>}
                                        </div>
                                        <div>
                                            <span className="text-xs font-mono text-[#97b85d]">{item.year}</span>
                                            <h4 className="text-lg font-bold text-white group-hover:translate-x-1 transition-transform">{item.title}</h4>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA & Socials */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-[#e33e33] rounded-2xl p-8 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                <h3 className="text-2xl font-black uppercase mb-4 relative z-10">Join The Future</h3>
                                <Link to="/events" className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded hover:scale-105 transition-transform relative z-10">
                                    Register Now
                                </Link>
                            </div>

                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex items-center justify-between">
                                <span className="text-sm font-mono text-gray-500">CONNECT WITH US</span>
                                <div className="flex gap-4 text-xl">
                                    <FaGithub className="text-white hover:text-[#97b85d] cursor-pointer transition-colors" />
                                    <FaTwitter className="text-white hover:text-[#e33e33] cursor-pointer transition-colors" />
                                    <FaLinkedin className="text-white hover:text-blue-500 cursor-pointer transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;
