import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import zorphixLogo from '../assets/zorphix-logo.png';
import zorphixName from '../assets/zorphix.png';


const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const containerRef = useRef(null);

    const [targetDate] = useState(() => {
        // February 5, 2026 at 00:00:00
        return new Date('2026-02-05T00:00:00').getTime();
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



    const [logoParticles, setLogoParticles] = useState([]);

    useEffect(() => {
        const newParticles = [...Array(10)].map(() => ({
            duration: 15 + Math.random() * 20,
            delay: -(Math.random() * 20),
            size: 30 + Math.random() * 50,
            left: Math.random() * 100,
            opacity: 0.1 + Math.random() * 0.2
        }));
        setLogoParticles(newParticles);
    }, []);


    return (
        <div
            className="relative min-h-screen text-white overflow-hidden font-mono perspective-1000 pt-20 md:pt-16"
            ref={containerRef}
        >


            {/* Floating Logo Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
                {logoParticles.map((particle, i) => (
                    <img
                        key={i}
                        src={zorphixLogo}
                        alt=""
                        className="absolute object-contain"
                        style={{
                            left: `${particle.left}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animation: `float-up ${particle.duration}s linear infinite`,
                            animationDelay: `${particle.delay}s`,
                            opacity: particle.opacity,
                            filter: 'brightness(150%) drop-shadow(0 0 2px rgba(227,62,51,0.3))'
                        }}
                    />
                ))}
            </div>

            {/* Vignette Effect */}
            <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]"></div>



            {/* Main Content - Holographic HUD */}
            <div className="relative z-40 flex flex-col items-center justify-center min-h-screen pointer-events-none pt-20 pb-32 md:py-0">

                {/* Floating Header */}
                <div className="mb-8 md:mb-12 mt-4 md:mt-0 relative group pointer-events-auto flex flex-col items-center px-4">
                    <div className="absolute -inset-10 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition duration-500"></div>

                    {/* Logo and Name Container */}
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 animate-float">



                        {/* Name Image with Glitch Effect */}
                        <div className="relative w-56 sm:w-64 md:w-64 lg:w-96">
                            <div className="relative">
                                <img src={zorphixName} alt="ZORPHIX" className="w-full h-auto relative z-10 drop-shadow-[0_0_25px_rgba(151,184,93,0.3)]" />
                                <img src={zorphixName} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-90" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px, -2px)' }} />
                                <img src={zorphixName} alt="" className="absolute top-0 left-0 w-full h-full opacity-50 animate-glitch mix-blend-screen filter hue-rotate-180" style={{ clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)', transform: 'translate(2px, 2px)', animationDelay: '0.1s' }} />
                            </div>
                        </div>

                    </div>

                    <p className="text-center text-sm md:text-lg lg:text-xl text-gray-400 mt-6 md:mt-8 uppercase font-light px-4 leading-relaxed tracking-wider">Department of Computer Science and Business Systems</p>
                </div>

                {/* 3D Holographic Access Card */}
                <div className="relative w-[340px] h-[210px] sm:w-[380px] sm:h-[230px] md:w-[450px] md:h-[270px] lg:w-[500px] lg:h-[300px] perspective-1000 pointer-events-auto md:my-8 mx-4">
                    <div
                        className="w-full h-full relative transform-style-3d transition-transform duration-100 ease-out shadow-[0_0_50px_rgba(227,62,51,0.3)]"
                    >
                        {/* Card Front */}
                        <div className="absolute inset-0 bg-[#0a0f0d]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden backface-hidden flex flex-col p-5 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            {/* Holographic Overlay & Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>

                            {/* Animated Sparkline Background */}
                            <svg className="absolute bottom-0 left-0 w-full h-32 opacity-20 pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <path d="M0 15 Q10 10 20 18 T40 12 T60 16 T80 8 T100 14" fill="none" stroke="#e33e33" strokeWidth="0.5" className="animate-pulse" />
                                <path d="M0 18 Q15 12 30 16 T60 10 T90 15 T100 12" fill="none" stroke="#97b85d" strokeWidth="0.5" className="animate-pulse" style={{ animationDelay: '1s' }} />
                                <defs>
                                    <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="transparent" />
                                        <stop offset="100%" stopColor="rgba(151,184,93,0.1)" />
                                    </linearGradient>
                                </defs>
                                <path d="M0 18 L100 18 L100 20 L0 20 Z" fill="url(#grid-fade)" />
                            </svg>

                            {/* Card Header: Market Status */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    {/* Live Indicator */}
                                    <div className="flex items-center gap-2 px-2 py-1 bg-black/40 rounded border border-white/10 backdrop-blur-sm">
                                        <div className="w-2 h-2 rounded-full bg-[#e33e33] animate-ping"></div>
                                        <div className="w-2 h-2 rounded-full bg-[#e33e33] absolute"></div>
                                        <span className="text-[8px] md:text-[10px] font-mono text-[#e33e33] font-bold tracking-widest">PRE-MARKET</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[8px] md:text-[10px] text-gray-500 font-mono">SESSION ID</div>
                                    <div className="text-white/80 text-[10px] md:text-xs font-mono tracking-widest">ZP-26-TRD-X</div>
                                </div>
                            </div>

                            {/* Main Content: Countdown Ticker */}
                            <div className="flex-1 flex flex-col items-center justify-center my-2 relative z-10">
                                <span className="text-[10px] md:text-xs text-[#97b85d] tracking-[0.3em] uppercase mb-2 font-bold animate-pulse">Market Opens In</span>
                                <div className="flex gap-2 md:gap-4 text-center">
                                    <TickerUnit value={timeLeft.days} label="DAYS" />
                                    <div className="text-2xl md:text-4xl font-bold text-white/20 self-start mt-1">:</div>
                                    <TickerUnit value={timeLeft.hours} label="HRS" />
                                    <div className="text-2xl md:text-4xl font-bold text-white/20 self-start mt-1">:</div>
                                    <TickerUnit value={timeLeft.minutes} label="MIN" />
                                    <div className="text-2xl md:text-4xl font-bold text-white/20 self-start mt-1">:</div>
                                    <TickerUnit value={timeLeft.seconds} label="SEC" highlight />
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
                <div className="mt-8 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-8 pointer-events-auto px-4 w-full sm:w-auto">
                    <button className="relative px-8 py-3 md:px-8 md:py-3 bg-transparent border border-[#e33e33] text-[#e33e33] font-bold uppercase tracking-widest hover:bg-[#e33e33] hover:text-white transition-all duration-300 group overflow-hidden text-base md:text-base w-full sm:w-auto">
                        <a href="/about" className="relative z-10">Learn More</a>
                        <div className="absolute inset-0 bg-[#e33e33] transform -translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                    <button className="relative px-8 py-3 md:px-8 md:py-3 bg-transparent border border-[#97b85d] text-[#97b85d] font-bold uppercase tracking-widest hover:bg-[#97b85d] hover:text-black transition-all duration-300 group overflow-hidden text-base md:text-base w-full sm:w-auto">
                        <a href="/events" className="relative z-10">Register</a>
                        <div className="absolute inset-0 bg-[#97b85d] transform translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>


        </div>
    );
};

export default Hero;

const TickerUnit = ({ value, label, highlight = false }) => (
    <div className="flex flex-col items-center group">
        <div className={`text-3xl md:text-5xl font-bold font-mono transition-colors duration-300 ${highlight ? 'text-[#e33e33]' : 'text-white group-hover:text-[#97b85d]'}`}>
            {String(value).padStart(2, '0')}
        </div>
        <div className="text-[8px] md:text-[10px] text-gray-500 tracking-widest mt-1 uppercase">{label}</div>
    </div>
);
