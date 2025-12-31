import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import zorphixLogo from '../assets/zorphix-logo.png';
import zorphixName from '../assets/zorphix.png';

const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const containerRef = useRef(null);

    const [targetDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 45);
        return date.getTime();
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) clearInterval(interval);
            else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const stockTickerItems = [
        { symbol: "CSBS", value: "+24.5%", up: true },
        { symbol: "TECH", value: "+12.8%", up: true },
        { symbol: "INNO", value: "+8.4%", up: true },
        { symbol: "CODE", value: "-2.1%", up: false },
        { symbol: "DATA", value: "+15.3%", up: true },
        { symbol: "ALGO", value: "+32.7%", up: true },
        { symbol: "NETW", value: "-0.5%", up: false },
        { symbol: "SYMP", value: "+100%", up: true },
        { symbol: "FUTR", value: "+45.2%", up: true },
        { symbol: "AI", value: "+67.9%", up: true },
    ];

    // Generate a long string for the tunnel walls
    const tickerString = stockTickerItems.map(item => `${item.symbol} ${item.value}`).join(' • ').repeat(10);

    return (
        <div
            className="relative min-h-screen bg-black text-white overflow-hidden font-mono perspective-1000 pt-20 md:pt-16"
            ref={containerRef}
        >
            {/* Ambient Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[800px] md:h-[800px] bg-[#e33e33]/20 rounded-full mix-blend-screen blur-[100px] animate-blob filter"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] md:w-[800px] md:h-[800px] bg-[#97b85d]/20 rounded-full mix-blend-screen blur-[100px] animate-blob animation-delay-2000 filter"></div>
                <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] md:w-[800px] md:h-[800px] bg-[#e33e33]/10 rounded-full mix-blend-screen blur-[100px] animate-blob animation-delay-4000 filter"></div>

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
            </div>

            {/* Vignette Effect */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"></div>



            {/* Main Content - Holographic HUD */}
            <div className="relative z-40 flex flex-col items-center justify-center min-h-screen pointer-events-none">

                {/* Floating Header */}
                <div className="mb-8 md:mb-12 mt-4 md:mt-0 relative group pointer-events-auto flex flex-col items-center px-4">
                    <div className="absolute -inset-10 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition duration-500"></div>

                    {/* Logo and Name Container */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 animate-float">

                        {/* Logo Image with Glitch Effect */}
                        <div className="relative w-16 sm:w-20 md:w-32 lg:w-40">
                            <div className="relative">
                                <img src={zorphixLogo} alt="Logo" className="w-full h-auto relative z-10 drop-shadow-[0_0_25px_rgba(227,62,51,0.3)]" />
                                <img src={zorphixLogo} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-90" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, -2px)' }} />
                                <img src={zorphixLogo} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-180" style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)', transform: 'translate(2px, 2px)', animationDelay: '0.1s' }} />
                            </div>
                        </div>

                        {/* Name Image with Glitch Effect */}
                        <div className="relative w-40 sm:w-48 md:w-64 lg:w-80">
                            <div className="relative">
                                <img src={zorphixName} alt="ZORPHIX" className="w-full h-auto relative z-10 drop-shadow-[0_0_25px_rgba(151,184,93,0.3)]" />
                                <img src={zorphixName} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-90" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, -2px)' }} />
                                <img src={zorphixName} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-180" style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)', transform: 'translate(2px, 2px)', animationDelay: '0.1s' }} />
                            </div>
                        </div>

                    </div>

                    <p className="text-center text-xs sm:text-sm md:text-lg lg:text-xl text-gray-400 mt-4 md:mt-8 uppercase font-light px-4 leading-relaxed">Department of Computer Science and Business Systems</p>
                </div>

                {/* 3D Holographic Access Card */}
                <div className="relative w-[280px] h-[180px] sm:w-[340px] sm:h-[200px] md:w-[450px] md:h-[270px] lg:w-[500px] lg:h-[300px] perspective-1000 pointer-events-auto md:my-8 mx-4">
                    <div
                        className="w-full h-full relative transform-style-3d transition-transform duration-100 ease-out shadow-[0_0_50px_rgba(227,62,51,0.3)]"
                    >
                        {/* Card Front */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden backface-hidden flex flex-col p-4 sm:p-6 md:p-8">
                            {/* Holographic Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
                            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 animate-scanline opacity-30"></div>

                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Chip */}
                                    <div className="w-10 h-8 md:w-14 md:h-10 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-md border border-yellow-700 flex items-center justify-center overflow-hidden shadow-inner">
                                        <div className="w-full h-[1px] bg-black/30 my-[3px]"></div>
                                        <div className="absolute w-[1px] h-full bg-black/30 mx-[3px]"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white/80 text-[10px] md:text-xs tracking-[0.2em] font-bold">ACCESS PASS</span>
                                        <span className="text-[#e33e33] text-xs md:text-sm font-bold tracking-widest">VIP TIER</span>
                                    </div>
                                </div>
                                <img src={zorphixLogo} alt="Logo" className="w-8 h-8 md:w-12 md:h-12 opacity-80" />
                            </div>

                            {/* Card Body - Countdown */}
                            <div className="flex-1 flex items-center justify-center my-2">
                                <div className="flex gap-4 md:gap-6 text-center">
                                    <div>
                                        <div className="text-2xl md:text-4xl font-bold text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</div>
                                        <div className="text-[8px] md:text-[10px] text-[#97b85d] tracking-widest mt-1">DAYS</div>
                                    </div>
                                    <div className="text-2xl md:text-4xl font-bold text-white/30">:</div>
                                    <div>
                                        <div className="text-2xl md:text-4xl font-bold text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                                        <div className="text-[8px] md:text-[10px] text-[#97b85d] tracking-widest mt-1">HRS</div>
                                    </div>
                                    <div className="text-2xl md:text-4xl font-bold text-white/30">:</div>
                                    <div>
                                        <div className="text-2xl md:text-4xl font-bold text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                        <div className="text-[8px] md:text-[10px] text-[#97b85d] tracking-widest mt-1">MIN</div>
                                    </div>
                                    <div className="text-2xl md:text-4xl font-bold text-white/30">:</div>
                                    <div>
                                        <div className="text-2xl md:text-4xl font-bold text-white font-mono">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                        <div className="text-[8px] md:text-[10px] text-[#97b85d] tracking-widest mt-1">SEC</div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="flex justify-between items-end mt-auto">
                                <div className="font-mono text-white/60 text-xs md:text-sm tracking-widest">
                                    **** **** **** 2026
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] md:text-[10px] text-gray-400">HOLDER</div>
                                    <div className="text-white text-xs md:text-sm font-bold tracking-wider">SYMPOSIUM ATTENDEE</div>
                                </div>
                            </div>
                        </div>

                        {/* Card Back (Reflection/Depth) */}
                        <div
                            className="absolute inset-0 bg-[#111] rounded-2xl backface-hidden transform rotate-y-180 border border-white/10 flex items-center justify-center"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            <div className="w-full h-10 bg-black absolute top-6"></div>
                            <div className="text-white/20 font-mono text-sm transform scale-x-[-1]">AUTHORIZED PERSONNEL ONLY</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-8 pointer-events-auto px-4">
                    <button className="relative px-6 py-2.5 md:px-8 md:py-3 bg-transparent border border-[#e33e33] text-[#e33e33] font-bold uppercase tracking-widest hover:bg-[#e33e33] hover:text-white transition-all duration-300 group overflow-hidden text-sm md:text-base">
                        <span className="relative z-10">Initialize</span>
                        <div className="absolute inset-0 bg-[#e33e33] transform -translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                    <button className="relative px-6 py-2.5 md:px-8 md:py-3 bg-transparent border border-[#97b85d] text-[#97b85d] font-bold uppercase tracking-widest hover:bg-[#97b85d] hover:text-black transition-all duration-300 group overflow-hidden text-sm md:text-base">
                        <span className="relative z-10">Analyze Data</span>
                        <div className="absolute inset-0 bg-[#97b85d] transform translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>

            {/* Top Scrolling Ticker */}
            <div className="absolute top-16 w-full bg-black/80 border-b border-white/10 backdrop-blur-md py-2 z-50">
                <div className="flex animate-ticker whitespace-nowrap text-s font-mono">
                    <span className="mx-4 text-[#e33e33]">WARNING: MARKET VOLATILITY DETECTED</span>
                    {stockTickerItems.map((item, i) => (
                        <span key={i} className="mx-4">
                            <span className="text-gray-400">{item.symbol}</span>
                            <span className={`ml-2 ${item.up ? 'text-[#97b85d]' : 'text-[#e33e33]'}`}>
                                {item.value} {item.up ? '▲' : '▼'}
                            </span>
                        </span>
                    ))}
                    {stockTickerItems.map((item, i) => (
                        <span key={`dup-${i}`} className="mx-4">
                            <span className="text-gray-400">{item.symbol}</span>
                            <span className={`ml-2 ${item.up ? 'text-[#97b85d]' : 'text-[#e33e33]'}`}>
                                {item.value} {item.up ? '▲' : '▼'}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
