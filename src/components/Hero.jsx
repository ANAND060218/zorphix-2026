import React, { useState, useEffect, useRef } from 'react';
import zorphixLogo from '../assets/zorphix-logo.png';
import zorphixName from '../assets/zorphix.png';

const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;
        setMousePos({ x, y });
    };

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
            className="relative min-h-screen bg-black text-white overflow-hidden font-mono perspective-1000"
            onMouseMove={handleMouseMove}
            ref={containerRef}
        >
            {/* 3D Tunnel Background */}
            <div
                className="absolute inset-0 transform-style-3d transition-transform duration-100 ease-out"
                style={{ transform: `rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)` }}
            >
                {/* Tunnel Walls */}
                <div className="absolute inset-0 flex items-center justify-center transform-style-3d animate-tunnel opacity-30">
                    {/* Top Wall */}
                    <div className="absolute w-[200vw] h-[200vh] bg-[linear-gradient(to_bottom,transparent_0%,#e33e33_50%,transparent_100%)] opacity-10 transform rotateX(90deg) translateZ(500px)"></div>
                    {/* Bottom Wall */}
                    <div className="absolute w-[200vw] h-[200vh] bg-[linear-gradient(to_bottom,transparent_0%,#97b85d_50%,transparent_100%)] opacity-10 transform rotateX(-90deg) translateZ(500px)"></div>
                    {/* Left Wall */}
                    <div className="absolute w-[200vw] h-[200vh] bg-[linear-gradient(to_right,transparent_0%,#e33e33_50%,transparent_100%)] opacity-10 transform rotateY(-90deg) translateZ(500px)"></div>
                    {/* Right Wall */}
                    <div className="absolute w-[200vw] h-[200vh] bg-[linear-gradient(to_right,transparent_0%,#97b85d_50%,transparent_100%)] opacity-10 transform rotateY(90deg) translateZ(500px)"></div>
                </div>

                {/* Floating Particles/Data Points */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: Math.random() * 0.5 + 0.2
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[size:100%_4px]"></div>
            <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-[#e33e33]/10 to-transparent h-[10%] w-full animate-scanline"></div>

            {/* Main Content - Holographic HUD */}
            <div className="relative z-40 flex flex-col items-center justify-center min-h-screen pointer-events-none">

                {/* Floating Header */}
                <div className="mb-12 relative group pointer-events-auto flex flex-col items-center">
                    <div className="absolute -inset-10 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition duration-500"></div>

                    {/* Logo and Name Container */}
                    <div className="relative z-10 flex items-center justify-center gap-6 md:gap-10 animate-float">

                        {/* Logo Image with Glitch Effect */}
                        <div className="relative w-24 md:w-40">
                            <div className="relative">
                                <img src={zorphixLogo} alt="Logo" className="w-full h-auto relative z-10 drop-shadow-[0_0_25px_rgba(227,62,51,0.3)]" />
                                <img src={zorphixLogo} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-90" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, -2px)' }} />
                                <img src={zorphixLogo} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-180" style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)', transform: 'translate(2px, 2px)', animationDelay: '0.1s' }} />
                            </div>
                        </div>

                        {/* Name Image with Glitch Effect */}
                        <div className="relative w-48 md:w-80">
                            <div className="relative">
                                <img src={zorphixName} alt="ZORPHIX" className="w-full h-auto relative z-10 drop-shadow-[0_0_25px_rgba(151,184,93,0.3)]" />
                                <img src={zorphixName} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-90" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, -2px)' }} />
                                <img src={zorphixName} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-180" style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)', transform: 'translate(2px, 2px)', animationDelay: '0.1s' }} />
                            </div>
                        </div>

                    </div>

                    <p className="text-center text-xl md:text-2xl tracking-[1em] text-gray-400 mt-8 uppercase font-light">Symposium '26</p>
                </div>

                {/* Circular Holographic Countdown */}
                <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center pointer-events-auto">
                    {/* Rotating Rings */}
                    <div className="absolute inset-0 border border-[#e33e33]/30 rounded-full animate-spin-slow border-t-transparent border-l-transparent"></div>
                    <div className="absolute inset-4 border border-[#97b85d]/30 rounded-full animate-spin-slow border-b-transparent border-r-transparent" style={{ animationDirection: 'reverse', animationDuration: '10s' }}></div>
                    <div className="absolute inset-0 rounded-full border border-white/5 shadow-[0_0_50px_rgba(227,62,51,0.2)]"></div>

                    {/* Center Data */}
                    <div className="flex flex-col items-center justify-center z-10 bg-black/50 backdrop-blur-sm rounded-full w-full h-full border border-white/10">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-center">
                            <div className="flex flex-col">
                                <span className="text-4xl font-bold text-white">{timeLeft.days}</span>
                                <span className="text-[10px] text-[#e33e33] tracking-widest">DAYS</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-bold text-white">{timeLeft.hours}</span>
                                <span className="text-[10px] text-[#97b85d] tracking-widest">HRS</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-bold text-white">{timeLeft.minutes}</span>
                                <span className="text-[10px] text-[#e33e33] tracking-widest">MIN</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-4xl font-bold text-white">{timeLeft.seconds}</span>
                                <span className="text-[10px] text-[#97b85d] tracking-widest">SEC</span>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-500 animate-pulse">SYSTEM STATUS: ONLINE</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-16 flex gap-8 pointer-events-auto">
                    <button className="relative px-8 py-3 bg-transparent border border-[#e33e33] text-[#e33e33] font-bold uppercase tracking-widest hover:bg-[#e33e33] hover:text-white transition-all duration-300 group overflow-hidden">
                        <span className="relative z-10">Initialize</span>
                        <div className="absolute inset-0 bg-[#e33e33] transform -translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                    <button className="relative px-8 py-3 bg-transparent border border-[#97b85d] text-[#97b85d] font-bold uppercase tracking-widest hover:bg-[#97b85d] hover:text-black transition-all duration-300 group overflow-hidden">
                        <span className="relative z-10">Analyze Data</span>
                        <div className="absolute inset-0 bg-[#97b85d] transform translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>

            {/* Bottom Scrolling Ticker */}
            <div className="absolute bottom-0 w-full bg-black/80 border-t border-white/10 backdrop-blur-md py-2 z-50">
                <div className="flex animate-ticker whitespace-nowrap text-xs font-mono">
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
