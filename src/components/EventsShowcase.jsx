import React, { useState, useEffect } from 'react';
import {
    FaBolt,
    FaLaptop,
    FaPalette,
    FaPaperclip,
    FaTools
} from 'react-icons/fa';

const EventsShowcase = () => {
    const categories = [
        {
            id: 'tech',
            name: 'Tech Events',
            count: '7+',
            icon: FaBolt,
            color: '#e33e33',
            gradient: 'from-[#e33e33] to-[#ff6b6b]',
            description: 'Competitive coding, hackathons, and cutting-edge tech challenges'
        },
        {
            id: 'nonTech',
            name: 'Workshops',
            count: '2',
            icon: FaLaptop,
            color: '#97b85d',
            gradient: 'from-[#97b85d] to-[#b8d96f]',
            description: 'Business competitions, creative challenges, and strategic thinking'
        },
        {
            id: 'paperpresentation',
            name: 'Paper Presentations',
            count: '1',
            icon: FaPaperclip,
            color: '#ffa500',
            gradient: 'from-[#ffa500] to-[#ffcc00]',
            description: 'Hands-on learning sessions with industry experts'
        }
    ];

    return (
        <div className="relative min-h-screen text-white py-20 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e33e33] rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#97b85d] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#ffa500] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `
                    linear-gradient(to right, #e33e33 1px, transparent 1px),
                    linear-gradient(to bottom, #97b85d 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
            }}></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-[#e33e33] via-[#97b85d] to-[#ffa500] bg-clip-text text-transparent animate-gradient">
                        WHAT WE OFFER
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
                        Experience the future of technology and innovation at Zorphix '26
                    </p>

                    {/* Glowing Divider */}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-[#e33e33]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#97b85d] animate-pulse"></div>
                        <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-[#e33e33]"></div>
                    </div>
                </div>

                {/* Stats Cards - Massive 3D Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <div
                                key={category.id}
                                className="group relative"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {/* Card */}
                                <div className="relative bg-black/60 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-8 transform transition-all duration-500 group-hover:animate-[shake_0.5s_ease-in-out]">
                                    {/* Corner Borders - Top Left */}
                                    <div
                                        className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            borderTop: `3px solid ${category.color}`,
                                            borderLeft: `3px solid ${category.color}`,
                                            borderTopLeftRadius: '1rem'
                                        }}
                                    ></div>

                                    {/* Corner Borders - Top Right */}
                                    <div
                                        className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            borderTop: `3px solid ${category.color}`,
                                            borderRight: `3px solid ${category.color}`,
                                            borderTopRightRadius: '1rem'
                                        }}
                                    ></div>

                                    {/* Corner Borders - Bottom Left */}
                                    <div
                                        className="absolute bottom-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            borderBottom: `3px solid ${category.color}`,
                                            borderLeft: `3px solid ${category.color}`,
                                            borderBottomLeftRadius: '1rem'
                                        }}
                                    ></div>

                                    {/* Corner Borders - Bottom Right */}
                                    <div
                                        className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                            borderBottom: `3px solid ${category.color}`,
                                            borderRight: `3px solid ${category.color}`,
                                            borderBottomRightRadius: '1rem'
                                        }}
                                    ></div>

                                    {/* Icon and Asset Badge */}
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <Icon className="w-16 h-16" style={{ color: category.color }} />
                                        <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                            ASSET CLASS: {category.id.toUpperCase()}
                                        </div>
                                    </div>

                                    {/* Count */}
                                    <div className={`text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent relative z-10`}>
                                        {category.count}
                                    </div>

                                    {/* Name */}
                                    <div className="text-xl md:text-2xl font-bold text-white mb-3 relative z-10">
                                        {category.name}
                                    </div>

                                    {/* Description */}
                                    <div className="text-gray-400 text-sm leading-relaxed relative z-10 mb-4">
                                        {category.description}
                                    </div>

                                    {/* Market Data Footer */}
                                    <div className="flex items-center gap-4 text-[10px] font-mono text-gray-600 border-t border-white/5 pt-3 mt-auto">
                                        <span>ROI: <span className="text-[#97b85d]">High</span></span>
                                        <span>RISK: <span className="text-[#97b85d]">Low</span></span>
                                        <span className="ml-auto opacity-50">TRD-VOL-24H</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <button className="relative px-12 py-4 bg-transparent border-2 border-white/20 text-white font-bold uppercase tracking-widest hover:border-[#e33e33] transition-all duration-300 group overflow-hidden rounded-lg">
                        <a href="/events" className="relative z-10">Register Now</a>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#e33e33] to-[#97b85d] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventsShowcase;
