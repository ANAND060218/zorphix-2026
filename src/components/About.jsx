import React from 'react';
import { Link } from 'react-router-dom';
import Background from './Background';
import zorphixLogo from '../assets/zorphix-logo.png';
import zorphixName from '../assets/zorphix.png';
import UniqueCarousel from './UniqueCarousel';

const About = () => {
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
        <div className="relative min-h-screen bg-black text-white overflow-hidden font-mono">
            <Background />

            {/* Vignette Effect - keeping consistent with Hero */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"></div>



            {/* Main Content */}
            <div className="relative z-40 max-w-7xl mx-auto px-6 py-16">

                {/* Header Section */}
                <div className="text-center mt-16 sm:mt-0 md:mt-20">
                    <div className="inline-block relative group mb-6">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg opacity-20 blur-2xl group-hover:opacity-40 transition duration-500"></div>
                        <h1 className="relative text-5xl md:text-7xl font-bold tracking-wider flex flex-col md:flex-row items-center justify-center gap-4">
                            <span className="text-white">ABOUT </span>
                            <img src={zorphixName} alt="ZORPHIX" className="h-16 md:h-32 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(227,62,51,0.5)]" />
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        A cutting-edge technical symposium where innovation meets execution.
                        <span className="text-[#97b85d]"> Symposium '26 </span>
                        brings together the brightest minds in technology.
                    </p>
                </div>

                {/* Unique Carousel Section */}
                <div className="mb-4 md:mb-20">
                    <UniqueCarousel />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-20">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-4 md:p-6 text-center hover:border-white/30 transition-all duration-300">
                                <div
                                    className="text-3xl md:text-5xl font-bold mb-2 font-mono"
                                    style={{ color: stat.color }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-xs md:text-sm tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mission Section */}
                <div className="mb-12 md:mb-20">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-2xl opacity-10 blur-xl group-hover:opacity-20 transition duration-500"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-2 h-12 bg-gradient-to-b from-[#e33e33] to-[#97b85d] rounded-full"></div>
                                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider">MISSION STATEMENT</h2>
                            </div>
                            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
                                To create an immersive platform where technology enthusiasts, developers, and innovators
                                converge to share knowledge, showcase cutting-edge projects, and collaborate on solutions
                                that shape the future of computing.
                            </p>
                            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                                Through hands-on workshops, competitive events, and expert-led sessions, we aim to
                                <span className="text-[#e33e33]"> inspire innovation</span>,
                                <span className="text-[#97b85d]"> foster collaboration</span>, and
                                <span className="text-[#e33e33]"> empower the next generation</span> of tech leaders.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-12 md:mb-20">
                    <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider mb-6 md:mb-10 text-center">
                        CORE <span className="text-[#97b85d]">TEAM</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                className="relative group perspective-1000"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
                                <div
                                    className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-4 md:p-6 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                                >
                                    {/* Status Indicator */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-2 h-2 bg-[#97b85d] rounded-full animate-pulse-fast shadow-[0_0_10px_rgba(151,184,93,0.5)]"></div>
                                        <span className="text-[#97b85d] text-[10px] md:text-xs tracking-widest">{member.status}</span>
                                    </div>

                                    {/* Avatar Placeholder */}
                                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-full flex items-center justify-center">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center">
                                            <span className="text-xl md:text-2xl font-bold text-white">{member.name.charAt(0)}</span>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-white font-bold text-sm mb-1 tracking-wider text-xs md:text-sm">{member.name}</div>
                                        <div className="text-gray-400 text-[10px] md:text-xs tracking-widest">{member.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What We Offer Section */}
                <div className="mb-12 md:mb-20">
                    <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider mb-6 md:mb-10 text-center">
                        WHAT WE <span className="text-[#e33e33]">OFFER</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                                <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-6 md:p-8 hover:border-white/30 transition-all duration-300 h-full">
                                    <div className="text-4xl md:text-5xl mb-4 filter grayscale hover:grayscale-0 transition-all duration-300">{offer.icon}</div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-3 tracking-wider">{offer.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-xs md:text-sm">{offer.description}</p>
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
