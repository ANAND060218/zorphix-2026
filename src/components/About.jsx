import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import zorphixLogo from '../assets/zorphix-logo.png';

const About = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;
        setMousePos({ x, y });
    };

    const teamMembers = [
        { role: "Chief Architect", name: "SYSTEM_ADMIN", status: "ACTIVE" },
        { role: "Lead Developer", name: "CODE_MASTER", status: "ACTIVE" },
        { role: "Security Chief", name: "FIREWALL_01", status: "ACTIVE" },
        { role: "Data Analyst", name: "ANALYTICS_CORE", status: "ACTIVE" },
    ];

    const stats = [
        { label: "EVENTS", value: "25+", color: "#97b85d" },
        { label: "WORKSHOPS", value: "15+", color: "#e33e33" },
        { label: "SPONSORS", value: "30+", color: "#97b85d" },
    ];

    return (
        <div
            className="relative min-h-screen bg-black text-white overflow-hidden font-mono"
            onMouseMove={handleMouseMove}
            ref={containerRef}
        >
            {/* Dynamic Market Graph Background */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
                {/* Moving Line Graph */}
                <svg className="absolute w-full h-64 md:h-96 top-1/3" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <path
                        d="M0,100 Q100,50 200,100 T400,100 T600,100 T800,100 T1000,100"
                        fill="none"
                        stroke="#e33e33"
                        strokeWidth="3"
                        className="animate-pulse-graph drop-shadow-[0_0_10px_rgba(227,62,51,0.5)]"
                    />
                    <path
                        d="M0,100 Q150,150 300,100 T600,100 T900,100"
                        fill="none"
                        stroke="#97b85d"
                        strokeWidth="3"
                        className="animate-pulse-graph animation-delay-2000 drop-shadow-[0_0_10px_rgba(151,184,93,0.5)]"
                        style={{ opacity: 0.5 }}
                    />
                </svg>

                {/* Vertical Bar Graph */}
                <div className="absolute inset-0 flex items-end justify-between px-2 pb-20">
                    {[...Array(40)].map((_, i) => (
                        <div
                            key={`bar-${i}`}
                            className="w-1 md:w-4 bg-gradient-to-t from-[#e33e33]/20 to-[#97b85d]/20 rounded-t-lg animate-graph-bar backdrop-blur-sm border-t border-white/10"
                            style={{
                                height: `${Math.random() * 50 + 10}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${Math.random() * 3 + 2}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Matrix Code Rain */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={`code-${i}`}
                        className="absolute text-[#97b85d] font-mono text-xs animate-code-rain whitespace-nowrap"
                        style={{
                            left: `${(i * 100) / 30}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 5 + 5}s`
                        }}
                    >
                        {Array.from({ length: 20 }, () => String.fromCharCode(Math.floor(Math.random() * 94) + 33)).join('')}
                    </div>
                ))}
            </div>

            {/* Grid Floor with Perspective */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[50vh] opacity-20 pointer-events-none transform-style-3d"
                style={{
                    transform: `rotateX(60deg) translateZ(-200px) translateY(${mousePos.y * 20}px)`,
                    backgroundImage: `
                        linear-gradient(to right, #e33e33 1px, transparent 1px),
                        linear-gradient(to bottom, #97b85d 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black"></div>
            </div>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[size:100%_4px]"></div>
            <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-[#e33e33]/10 to-transparent h-[10%] w-full animate-scanline"></div>

            {/* Vignette Effect */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"></div>



            {/* Main Content */}
            <div className="relative z-40 max-w-7xl mx-auto px-6 py-16">

                {/* Header Section */}
                <div className="text-center mb-20">
                    <div className="inline-block relative group mb-6">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg opacity-20 blur-2xl group-hover:opacity-40 transition duration-500"></div>
                        <h1 className="relative text-5xl md:text-7xl font-bold tracking-wider">
                            <span className="text-white">ABOUT </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e33e33] to-[#97b85d]">ZORPHIX</span>
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        A cutting-edge technical symposium where innovation meets execution.
                        <span className="text-[#97b85d]"> Symposium '26 </span>
                        brings together the brightest minds in technology.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-6 text-center hover:border-white/30 transition-all duration-300">
                                <div
                                    className="text-4xl md:text-5xl font-bold mb-2 font-mono"
                                    style={{ color: stat.color }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mission Section */}
                <div className="mb-20">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition duration-500"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-2 h-12 bg-gradient-to-b from-[#e33e33] to-[#97b85d] rounded-full"></div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider">MISSION STATEMENT</h2>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed mb-4">
                                To create an immersive platform where technology enthusiasts, developers, and innovators
                                converge to share knowledge, showcase cutting-edge projects, and collaborate on solutions
                                that shape the future of computing.
                            </p>
                            <p className="text-gray-400 leading-relaxed">
                                Through hands-on workshops, competitive events, and expert-led sessions, we aim to
                                <span className="text-[#e33e33]"> inspire innovation</span>,
                                <span className="text-[#97b85d]"> foster collaboration</span>, and
                                <span className="text-[#e33e33]"> empower the next generation</span> of tech leaders.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider mb-10 text-center">
                        CORE <span className="text-[#97b85d]">TEAM</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="relative group perspective-1000"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                                <div
                                    className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-6 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                                    style={{
                                        transform: `rotateX(${mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)`
                                    }}
                                >
                                    {/* Status Indicator */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 bg-[#97b85d] rounded-full animate-pulse-fast shadow-[0_0_10px_rgba(151,184,93,0.5)]"></div>
                                        <span className="text-[#97b85d] text-xs tracking-widest">{member.status}</span>
                                    </div>

                                    {/* Avatar Placeholder */}
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-full flex items-center justify-center">
                                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-white font-bold text-sm mb-1 tracking-wider">{member.name}</div>
                                        <div className="text-gray-400 text-xs tracking-widest">{member.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What We Offer Section */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider mb-10 text-center">
                        WHAT WE <span className="text-[#e33e33]">OFFER</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "WORKSHOPS",
                                description: "Hands-on technical sessions led by industry experts covering the latest technologies and frameworks.",
                                icon: "⚡"
                            },
                            {
                                title: "COMPETITIONS",
                                description: "Challenging hackathons and coding contests designed to test your skills and creativity.",
                                icon: "🏆"
                            },
                            {
                                title: "NETWORKING",
                                description: "Connect with like-minded individuals, mentors, and potential collaborators from across the tech community.",
                                icon: "🌐"
                            }
                        ].map((offer, index) => (
                            <div
                                key={index}
                                className="relative group"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                                <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-8 hover:border-white/30 transition-all duration-300 h-full">
                                    <div className="text-5xl mb-4 filter grayscale hover:grayscale-0 transition-all duration-300">{offer.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-3 tracking-wider">{offer.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm">{offer.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="relative inline-block group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg opacity-30 blur-xl group-hover:opacity-50 transition duration-500"></div>
                        <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-8">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wider">
                                READY TO <span className="text-[#97b85d]">JOIN US?</span>
                            </h3>
                            <p className="text-gray-400 mb-6 max-w-2xl">
                                Be part of the most anticipated technical symposium of 2026.
                                Register now and secure your access pass.
                            </p>
                            <div className="flex gap-6 justify-center flex-wrap">
                                <div className="group/button">
                                    <Link
                                        to="/"
                                        className="relative px-8 py-3 bg-transparent border border-[#e33e33] text-[#e33e33] group-hover:text-white font-bold uppercase tracking-widest group-hover/button:!text-black transition-all duration-300 overflow-hidden inline-block"
                                    >
                                        <span className="relative z-20">Back to Home</span>
                                        <div className="absolute inset-0 bg-[#e33e33] transform -translate-x-full skew-x-12 group-hover/button:translate-x-0 transition-transform duration-300"></div>
                                    </Link>
                                </div>
                                <div className="group/button">
                                    <button className="relative px-8 py-3 bg-transparent border border-[#97b85d] text-[#97b85d] group-hover:text-white font-bold uppercase tracking-widest group-hover/button:!text-black transition-all duration-300 overflow-hidden">
                                        <span className="relative z-20">Register Now</span>
                                        <div className="absolute inset-0 bg-[#97b85d] transform translate-x-full skew-x-12 group-hover/button:translate-x-0 transition-transform duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Footer */}
            <footer className="relative z-40 border-t border-white/10 bg-black/40 backdrop-blur-md py-8 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-gray-400 text-sm tracking-wider">
                        © 2026 ZORPHIX SYMPOSIUM. ALL RIGHTS RESERVED.
                    </p>
                    <p className="text-gray-600 text-xs mt-2">
                        SYSTEM STATUS: <span className="text-[#97b85d]">OPERATIONAL</span>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default About;
