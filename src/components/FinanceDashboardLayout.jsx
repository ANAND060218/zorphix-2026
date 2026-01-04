import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FinanceDashboardLayout = ({ children }) => {
    // Fake market data for the bottom ticker
    const tickerItems = [
        "BTC/USD 48,291 ▲", "ETH/USD 3,102 ▲", "ZPX/USD 2.45 ▲",
        "SOL/USD 145 ▼", "BNB/USD 412 ▲", "ADA/USD 1.20 ▼",
        "XRP/USD 0.85 ▲", "DOT/USD 24.50 ▲", "DOGE/USD 0.15 ▼"
    ];

    return (
        <div className="relative min-h-screen bg-[#0a0a0a]">
            {/* Left Ruler / Tick Marks */}
            <div className="fixed left-0 top-16 bottom-16 w-8 border-r border-white/5 bg-black/50 backdrop-blur-sm z-40 hidden md:flex flex-col justify-between py-4 items-center">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={`w-full h-[1px] ${i % 5 === 0 ? 'bg-white/30 w-4' : 'bg-white/10 w-2'}`}></div>
                ))}
                <div className="vertical-text text-[10px] text-gray-500 font-mono tracking-widest mt-auto mb-4 rotate-180" style={{ writingMode: 'vertical-rl' }}>
                    TERMINAL V.2.0.4
                </div>
            </div>

            {/* Right Ruler / Tick Marks */}
            <div className="fixed right-0 top-16 bottom-16 w-8 border-l border-white/5 bg-black/50 backdrop-blur-sm z-40 hidden md:flex flex-col justify-between py-4 items-center">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={`w-full h-[1px] ${i % 5 === 0 ? 'bg-white/30 w-4' : 'bg-white/10 w-2'}`}></div>
                ))}
            </div>

            {/* Content Area */}
            <div className="md:px-8">
                {children}
            </div>
        </div>
    );
};

export default FinanceDashboardLayout;
