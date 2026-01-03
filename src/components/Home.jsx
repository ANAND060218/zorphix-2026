import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import zorphixLogo from '../assets/zorphix-logo.png';
import Hero from './Hero';
import EventsShowcase from './EventsShowcase';
import Sponsors from './Sponsors';

const Home = () => {
    // Session Storage Check
    const [showShutter, setShowShutter] = useState(() => {
        try {
            const hasSeen = sessionStorage.getItem('hasSeenShutter');
            return !hasSeen;
        } catch {
            return true;
        }
    });

    const [lockStatus, setLockStatus] = useState("VERIFYING...");
    const [isAccessGranted, setIsAccessGranted] = useState(false);

    useEffect(() => {
        if (showShutter) {
            // Sequence:
            // 0s: Start (Verifying)
            // 1.5s: Access Granted (Green Light)
            // 2.5s: Doors Open

            const statusTimer = setTimeout(() => {
                setLockStatus("ACCESS GRANTED");
                setIsAccessGranted(true);
            }, 1000); // Wait 1s before showing success

            const dismissTimer = setTimeout(() => {
                setShowShutter(false);
                try {
                    sessionStorage.setItem('hasSeenShutter', 'true');
                } catch { }
            }, 2500); // 1.5s reading time + door opening time

            return () => {
                clearTimeout(statusTimer);
                clearTimeout(dismissTimer);
            };
        }
    }, [showShutter]);

    // Generate static particle data for consistent hydration
    const leftParticles = useMemo(() => [...Array(20)].map(() => ({
        symbol: ['$', '€', '▼', '₿', '¥'][Math.floor(Math.random() * 5)],
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
        size: 20 + Math.random() * 40
    })), []);

    const rightParticles = useMemo(() => [...Array(20)].map(() => ({
        symbol: ['$', '£', '▲', '₿', '₹'][Math.floor(Math.random() * 5)],
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
        size: 20 + Math.random() * 40
    })), []);

    return (
        <div className="relative min-h-screen">
            <AnimatePresence>
                {showShutter && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none font-sans overflow-hidden">

                        {/* LEFT VAULT DOOR (RED/BEAR) */}
                        <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#050505] border-r border-[#331111] flex flex-col justify-center items-center overflow-hidden z-20"
                            initial={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }} // Delay for reading text
                        >
                            {/* Floating Currency Background (Red Tint) - INCREASED VISIBILITY */}
                            <div className="absolute inset-0 opacity-60">
                                {leftParticles.map((p, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute text-[#ff3333] font-serif font-bold select-none"
                                        initial={{ y: "110vh", opacity: 0 }}
                                        animate={{ y: "-10vh", opacity: [0.2, 1, 1, 0.2] }}
                                        transition={{
                                            duration: p.duration,
                                            repeat: Infinity,
                                            delay: p.delay,
                                            ease: "linear"
                                        }}
                                        style={{
                                            left: `${p.left}%`,
                                            fontSize: `${p.size}px`,
                                            textShadow: '0 0 15px rgba(255, 50, 50, 0.8)'
                                        }}
                                    >
                                        {p.symbol}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Clearer Overlay (Reduced Darkness, Removed Blur) */}
                            <div className="absolute inset-0 bg-[#000000]/10" />

                            {/* Watermark */}
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[#220505] font-black text-[15rem] opacity-60 rotate-90 select-none z-10 tracking-widest">
                                BEAR
                            </div>

                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#ff3333] to-transparent opacity-50 shadow-[0_0_20px_#ff0000]" />
                        </motion.div>

                        {/* RIGHT VAULT DOOR (GREEN/BULL) */}
                        <motion.div
                            className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#050505] border-l border-[#113311] flex flex-col justify-center items-center overflow-hidden z-20"
                            initial={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                        >
                            {/* Floating Currency Background (Green Tint) - INCREASED VISIBILITY */}
                            <div className="absolute inset-0 opacity-60">
                                {rightParticles.map((p, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute text-[#33ff33] font-serif font-bold select-none"
                                        initial={{ y: "110vh", opacity: 0 }}
                                        animate={{ y: "-10vh", opacity: [0.2, 1, 1, 0.2] }}
                                        transition={{
                                            duration: p.duration,
                                            repeat: Infinity,
                                            delay: p.delay,
                                            ease: "linear"
                                        }}
                                        style={{
                                            left: `${p.left}%`,
                                            fontSize: `${p.size}px`,
                                            textShadow: '0 0 15px rgba(50, 255, 50, 0.8)'
                                        }}
                                    >
                                        {p.symbol}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Clearer Overlay (Reduced Darkness, Removed Blur) */}
                            <div className="absolute inset-0 bg-[#000000]/10" />

                            {/* Watermark */}
                            <div className="absolute left-10 top-1/2 -translate-y-1/2 text-[#052205] font-black text-[15rem] opacity-60 -rotate-90 select-none z-10 tracking-widest">
                                BULL
                            </div>

                            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#33ff33] to-transparent opacity-50 shadow-[0_0_20px_#00ff00]" />
                        </motion.div>

                        {/* CENTRAL LOADING LOCK - PREMIUM UI */}
                        <motion.div
                            className="absolute z-50 flex flex-col items-center justify-center gap-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Outer Rotating Ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-gray-800"
                                    style={{ borderTopColor: isAccessGranted ? '#33ff33' : '#e33e33', borderRightColor: 'transparent', borderWidth: '2px' }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute inset-2 rounded-full border border-gray-800"
                                    style={{ borderBottomColor: isAccessGranted ? '#33ff33' : '#e33e33', borderLeftColor: 'transparent', borderWidth: '1px' }}
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Central Logo Glow */}
                                <div className="absolute inset-0 bg-black/80 rounded-full blur-xl" />
                                <img src={zorphixLogo} alt="Lock" className="w-24 h-24 object-contain relative z-10" />
                            </div>

                            {/* Loading Status Text */}
                            <motion.div
                                className="font-mono text-sm tracking-[0.3em] font-bold mt-4"
                                animate={{
                                    color: isAccessGranted ? "#33ff33" : "#e33e33",
                                    textShadow: isAccessGranted ? "0 0 20px #33ff33" : "0 0 10px #e33e33"
                                }}
                            >
                                {lockStatus}
                            </motion.div>
                        </motion.div>

                    </div>
                )}
            </AnimatePresence>

            <Hero />
            <EventsShowcase />
            <Sponsors />
        </div>
    );
};

export default Home;
