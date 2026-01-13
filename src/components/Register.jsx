import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FaGoogle, FaUserTie, FaUniversity, FaBuilding, FaPhone, FaCheckCircle, FaChartLine, FaBriefcase, FaWallet, FaHandshake, FaTicketAlt, FaDownload } from 'react-icons/fa';
import * as htmlToImage from 'html-to-image';


const Register = () => {
    // Defined properly at the top or outside to be accessible
    const eventOptions = [
        // Technical Events (from EventsPage.jsx)
        { name: 'Pixel Reforge', type: 'tech', price: 0 },
        { name: 'PromptCraft', type: 'tech', price: 0 },
        { name: 'AlgoPulse', type: 'tech', price: 0 },
        { name: 'CodeBack', type: 'tech', price: 0 },
        { name: 'Sip to Survive', type: 'tech', price: 0 },
        { name: 'CodeCrypt', type: 'tech', price: 0 },
        { name: 'LinkLogic', type: 'tech', price: 0 },
        { name: 'Paper Presentation', type: 'tech', price: 149 },

        // Keeping existing Non-Tech and Workshops for now
        { name: 'Lens Legends', type: 'non-tech', price: 0 },
        { name: 'Meme Masters', type: 'non-tech', price: 0 },
        { name: 'Gaming Arena', type: 'non-tech', price: 0 },
        { name: 'Treasure Hunt', type: 'non-tech', price: 0 },
        { name: 'Quiz Bowl', type: 'non-tech', price: 0 },
        { name: 'FinTech Workshop', type: 'workshop', price: 50 },
        { name: 'WealthX Workshop', type: 'workshop', price: 50 }
    ];

    const location = useLocation();

    // Sync with localStorage on mount (in case of navigation without full reload)
    useEffect(() => {
        try {
            const storedEvents = JSON.parse(localStorage.getItem('selectedEvents') || '[]');
            if (storedEvents.length > 0) {
                // Normalize stored names
                const normalizedEvents = storedEvents.map(storedName => {
                    const match = eventOptions.find(opt => opt.name.toLowerCase() === storedName.toLowerCase() || opt.name.toUpperCase() === storedName.toUpperCase());
                    return match ? match.name : null;
                }).filter(Boolean);

                const uniqueEvents = Array.from(new Set(normalizedEvents));

                if (uniqueEvents.length > 0) {
                    setFormData(prev => {
                        // Merge with existing selected events in state, avoiding duplicates
                        const merged = [...new Set([...prev.events, ...uniqueEvents])];
                        return { ...prev, events: merged };
                    });
                }
            }
        } catch (e) {
            console.error("Error syncing events:", e);
        }
    }, [location]); // Re-run if location changes

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(() => {
        const initial = {
            college: '',
            department: '',
            year: '1',
            phone: '',
            events: []
        };

        try {
            const storedEvents = JSON.parse(localStorage.getItem('selectedEvents') || '[]');
            if (storedEvents.length > 0) {
                // Map stored uppercase/mixed case to exact eventOptions names
                const normalizedEvents = storedEvents.map(storedName => {
                    // Need to access eventOptions. Since it's defined in component scope (which is inside render), 
                    // we can accessing it if it's hoisted or defined before. 
                    // To be safe, we should assume eventOptions is available or redefine the lookup.
                    // Actually, eventOptions is defined at top of component.
                    const match = eventOptions.find(opt => opt.name.toLowerCase() === storedName.toLowerCase() || opt.name.toUpperCase() === storedName.toUpperCase());
                    return match ? match.name : null;
                }).filter(Boolean);

                // Deduplicate
                const uniqueEvents = Array.from(new Set(normalizedEvents));
                if (uniqueEvents.length > 0) {
                    return { ...initial, events: uniqueEvents };
                }
            }
        } catch (e) {
            console.error(e);
        }
        return initial;
    });

    // Removed the useEffect that was setting form data from localStorage

    const [submitted, setSubmitted] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [alreadyRegistered, setAlreadyRegistered] = useState([]);

    const ticketRef = useRef(null);

    const handleDownloadTicket = async () => {
        if (!ticketRef.current) return;
        try {
            // Hide action buttons temporarily
            const actionsEl = ticketRef.current.querySelector('.ticket-actions');
            if (actionsEl) actionsEl.style.display = 'none';

            const dataUrl = await htmlToImage.toPng(ticketRef.current, {
                quality: 1,
                pixelRatio: 2,
                backgroundColor: '#111111'
            });

            // Restore actions
            if (actionsEl) actionsEl.style.display = '';

            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `Zorphix26_Ticket_${user?.uid || 'user'}.png`;
            link.click();
        } catch (err) {
            console.error("Failed to save ticket:", err);
            alert("Could not save ticket image.");
        }
    };

    // Sync with localStorage on mount (in case of navigation without full reload)
    useEffect(() => {
        try {
            const storedEvents = JSON.parse(localStorage.getItem('selectedEvents') || '[]');
            if (storedEvents.length > 0) {
                // Normalize stored names
                const normalizedEvents = storedEvents.map(storedName => {
                    const match = eventOptions.find(opt => opt.name.toLowerCase() === storedName.toLowerCase() || opt.name.toUpperCase() === storedName.toUpperCase());
                    return match ? match.name : null;
                }).filter(Boolean);

                const uniqueEvents = Array.from(new Set(normalizedEvents));

                if (uniqueEvents.length > 0) {
                    setFormData(prev => {
                        // Merge with existing selected events in state, avoiding duplicates
                        const merged = [...new Set([...prev.events, ...uniqueEvents])];
                        return { ...prev, events: merged };
                    });
                }
            }
        } catch (e) {
            console.error("Error syncing events:", e);
        }
    }, [location]); // Re-run if location changes

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const docRef = doc(db, 'registrations', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSubmitted(true);
                    const data = docSnap.data();
                    if (data.events && Array.isArray(data.events)) {
                        setAlreadyRegistered(data.events);
                    }
                    // Pre-fill form data
                    setFormData(prev => ({
                        ...prev,
                        college: data.college || '',
                        department: data.department || '',
                        year: data.year || '1',
                        phone: data.phone || ''
                    }));
                    setSubmitted(true);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            alert(`Sign-In Failed: ${error.message}`);
        }
    };

    const handleSignOut = () => {
        signOut(auth);
        setSubmitted(false);
        setShowTicket(false);
        setAlreadyRegistered([]);
        setFormData({
            college: '',
            department: '',
            year: '1',
            phone: '',
            events: []
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEventChange = (e) => {
        const { value, checked } = e.target;
        const { events } = formData;

        let newEvents;
        if (checked) {
            newEvents = [...events, value];
        } else {
            newEvents = events.filter((e) => e !== value);
        }
        setFormData({ ...formData, events: newEvents });

        // Sync with localStorage
        // Save exact names to match EventsPage format (Mixed Case)
        localStorage.setItem('selectedEvents', JSON.stringify(newEvents));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            // Merge already registered events with new events
            const allEvents = [...new Set([...alreadyRegistered, ...formData.events])];

            await setDoc(doc(db, 'registrations', user.uid), {
                ...formData,
                events: allEvents, // Save the merged list
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                registeredAt: serverTimestamp(),
                portfolioValue: 'PENDING VALUATION'
            });
            // Update local state to reflect the new total
            setAlreadyRegistered(allEvents);
            setFormData(prev => ({ ...prev, events: [] })); // Clear selected events as they are now registered
            localStorage.removeItem('selectedEvents'); // Clear local storage selection
            setSubmitted(true);
            setShowTicket(true);
        } catch (error) {
            console.error("Error saving registration:", error);
            alert("Transaction Failed. Retry.");
        }
    };

    // eventOptions removed (moved to top)

    const paymentSummary = (() => {
        const paid = alreadyRegistered.reduce((sum, name) => sum + (eventOptions.find(e => e.name === name)?.price || 0), 0);
        // Calculate cost of currently selected events that are NOT already registered
        const toPay = formData.events.reduce((sum, name) => {
            if (alreadyRegistered.includes(name)) return sum;
            return sum + (eventOptions.find(e => e.name === name)?.price || 0);
        }, 0);

        const uniqueSelectedCount = new Set([...alreadyRegistered, ...formData.events]).size;

        return {
            paid,
            toPay,
            total: paid + toPay,
            count: uniqueSelectedCount
        };
    })();

    if (loading) {
        return (
            <div className="min-h-screen text-white font-serif relative overflow-hidden flex flex-col items-center justify-center selection:bg-[#e33e33] selection:text-black">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1a2e26,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#1f1a0e,transparent_50%)]"></div>

                <div className="relative z-10 flex flex-col items-center justify-center text-[#e33e33]">
                    <FaChartLine className="text-3xl md:text-5xl mb-6 md:mb-8 animate-bounce drop-shadow-[0_0_10px_rgba(227,62,51,0.5)]" />

                    <div className="bg-black/50 border border-[#e33e33]/30 backdrop-blur-md px-8 py-4 rounded-lg shadow-[0_0_30px_rgba(227,62,51,0.1)]">
                        <div className="text-sm md:text-xl tracking-[0.3em] uppercase text-white font-bold">
                            Loading Registration
                        </div>
                        <div className="h-1 w-full bg-[#333] mt-3 rounded-full overflow-hidden">
                            <div className="h-full bg-[#e33e33] animate-progress w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white font-serif relative overflow-hidden selection:bg-[#e33e33] selection:text-black">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1a2e26,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#1f1a0e,transparent_50%)]"></div>

            {/* Floating Currency Symbols */}

            <div className="relative z-10 container mx-auto px-2 pt-32 pb-12 flex flex-col items-center justify-center min-h-screen">

                <AnimatePresence mode='wait'>
                    {!user ? (
                        /* ================== UNAUTHENTICATED VIEW ================== */
                        <motion.div
                            key="login"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            className="w-full max-w-lg"
                        >
                            <div className="bg-[#111] border border-[#e33e33]/50 rounded-lg p-12 text-center relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                                {/* Red Shine */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#e33e33]/20 to-transparent rounded-bl-full"></div>

                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#e33e33] to-[#991b1b] rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-[#e33e33]/20">
                                    <FaBuilding className="text-3xl text-black" />
                                </div>

                                <h1 className="text-4xl font-serif text-white mb-2 tracking-wide">
                                    EVENT REGISTRATION
                                </h1>
                                <p className="text-[#e33e33] text-sm tracking-[0.2em] uppercase mb-12">
                                    Official Zorphix Portal
                                </p>

                                <div className="space-y-6">
                                    <div className="border border-[#333] p-4 rounded text-xs text-gray-400 font-mono text-left bg-[#080808]">
                                        <p className="mb-2">READY TO REGISTER?</p>
                                        <p className="mb-2">SIGN IN TO CONTINUE...</p>
                                        <p className="text-[#e33e33]">WAITING FOR LOGIN</p>
                                    </div>

                                    <button
                                        onClick={handleGoogleSignIn}
                                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group relative overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            <FaGoogle /> Sign In with Google
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e33e33]/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                                    </button>
                                </div>

                                <p className="mt-8 text-[10px] text-gray-600 tracking-widest">
                                    SECURE REGISTRATION SYSTEM
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        /* ================== AUTHENTICATED / FORM VIEW ================== */
                        <div className="w-full flex flex-col items-center gap-4 relative">
                            {submitted && !showTicket && (
                                <div className="w-full max-w-5xl flex justify-end px-2">
                                    <button
                                        onClick={() => setShowTicket(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-[#1a1a1a] to-[#222] border border-[#97b85d]/30 text-[#97b85d] font-mono text-xs uppercase tracking-widest hover:bg-[#97b85d] hover:text-[#e33e33] transition-all shadow-lg hover:shadow-[#97b85d]/20 flex items-center gap-2 rounded-full backdrop-blur-md"
                                    >
                                        <FaTicketAlt /> Show My Ticket
                                    </button>
                                </div>
                            )}

                            <AnimatePresence mode='wait'>
                                {!showTicket ? (
                                    <motion.div
                                        key="form"
                                        initial={{ scale: 0.95, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.95, opacity: 0 }}
                                        className="w-full max-w-5xl"
                                    >
                                        <div className="relative rounded-2xl overflow-hidden">
                                            {/* Animated gradient background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#0a0a0a] animate-gradient"></div>
                                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

                                            {/* Glassmorphism border */}
                                            <div className="absolute inset-0 rounded-2xl border border-white/10 backdrop-blur-xl"></div>

                                            <div className="relative">
                                                {/* Header with 3D effect */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: -20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="relative p-8 border-b border-white/5 bg-gradient-to-r from-[#0f0f0f]/80 via-[#111]/60 to-[#0f0f0f]/80 backdrop-blur-md"
                                                >
                                                    {/* Glow effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#e33e33]/5 via-transparent to-[#97b85d]/5 blur-2xl"></div>

                                                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                        <div className="flex items-center gap-5">
                                                            {/* 3D Profile card */}
                                                            <motion.div
                                                                whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5 }}
                                                                style={{ transformStyle: 'preserve-3d' }}
                                                                className="relative group"
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-br from-[#e33e33]/20 to-[#97b85d]/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                                                                <img
                                                                    src={user.photoURL}
                                                                    alt="Profile"
                                                                    crossOrigin="anonymous"
                                                                    className="relative w-20 h-20 rounded-full border-2 border-[#e33e33]/50 shadow-[0_0_30px_rgba(227,62,51,0.3)] ring-4 ring-white/5"
                                                                />
                                                                {/* Verified badge */}
                                                                <div className="absolute -bottom-1 -right-1 bg-[#e33e33] rounded-full p-1.5 border-2 border-[#111] shadow-lg">
                                                                    <FaCheckCircle className="text-white text-xs" />
                                                                </div>
                                                            </motion.div>

                                                            <div className="space-y-1">
                                                                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
                                                                    {user.displayName}
                                                                </h2>
                                                                <p className="text-gray-500 font-mono text-xs tracking-[0.2em] flex items-center gap-2">
                                                                    <span className="inline-block w-2 h-2 bg-[#97b85d] rounded-full animate-pulse"></span>
                                                                    ID: {user.uid.slice(0, 8).toUpperCase()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            {/* Status badge */}
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.2, type: "spring" }}
                                                                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#97b85d]/10 to-[#97b85d]/5 border border-[#97b85d]/30 backdrop-blur-sm"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <span className="relative flex h-2 w-2">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97b85d] opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#97b85d]"></span>
                                                                    </span>
                                                                    <span className="text-[#97b85d] font-mono text-xs font-bold tracking-wider">VERIFIED</span>
                                                                </div>
                                                            </motion.div>

                                                            {/* Sign out button */}
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={handleSignOut}
                                                                className="group relative px-5 py-2.5 bg-gradient-to-r from-[#e33e33]/10 to-[#e33e33]/5 border border-[#e33e33]/30 text-[#e33e33] text-xs uppercase tracking-widest rounded-lg overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(227,62,51,0.3)]"
                                                            >
                                                                <span className="relative z-10 font-bold">Sign Out</span>
                                                                <div className="absolute inset-0 bg-gradient-to-r from-[#e33e33]/0 via-[#e33e33]/10 to-[#e33e33]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </motion.div>

                                                {/* Form Content */}
                                                <div className="px-3 py-6 md:p-12 bg-[#080808]">
                                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-12">

                                                        {/* Left Column - Personal Details */}
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className="md:col-span-7 space-y-8"
                                                        >
                                                            <div className="flex items-center gap-3 mb-6">
                                                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#e33e33]/20 to-[#e33e33]/5 border border-[#e33e33]/20">
                                                                    <FaUserTie className="text-[#e33e33] text-lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-sm text-white font-bold uppercase tracking-wider">Participant Details</h3>
                                                                    <p className="text-[10px] text-gray-500">Complete your registration profile</p>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-8">
                                                                {/* College Name */}
                                                                <div className="relative group">
                                                                    <label className="text-[10px] text-[#e33e33] uppercase tracking-widest mb-2 block font-bold">College Name</label>
                                                                    <div className="relative">
                                                                        <FaUniversity className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 group-focus-within:text-[#e33e33] transition-all z-10" />
                                                                        <input
                                                                            type="text"
                                                                            name="college"
                                                                            value={formData.college}
                                                                            onChange={handleChange}
                                                                            required
                                                                            className="w-full bg-[#0a0a0a]/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-[#e33e33]/50 focus:shadow-[0_0_10px_rgba(227,62,51,0.05)] transition-all font-mono backdrop-blur-sm"
                                                                            placeholder="Enter College Name"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Department & Year Grid */}
                                                                <div className="grid grid-cols-2 gap-6">
                                                                    <div className="relative group">
                                                                        <label className="text-[10px] text-[#e33e33] uppercase tracking-widest mb-2 block font-bold">Department</label>
                                                                        <div className="relative">
                                                                            <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 group-focus-within:text-[#e33e33] transition-all z-10" />
                                                                            <input
                                                                                type="text"
                                                                                name="department"
                                                                                value={formData.department}
                                                                                onChange={handleChange}
                                                                                required
                                                                                className="w-full bg-[#0a0a0a]/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-[#e33e33]/50 focus:shadow-[0_0_10px_rgba(227,62,51,0.05)] transition-all font-mono backdrop-blur-sm"
                                                                                placeholder="Department"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div className="relative group">
                                                                        <label className="text-[10px] text-[#e33e33] uppercase tracking-widest mb-2 block font-bold">Year of Study</label>
                                                                        <div className="relative">
                                                                            <FaChartLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 group-focus-within:text-[#e33e33] transition-all z-10" />
                                                                            <select
                                                                                name="year"
                                                                                value={formData.year}
                                                                                onChange={handleChange}
                                                                                className="w-full bg-[#0a0a0a]/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#e33e33]/50 focus:shadow-[0_0_10px_rgba(227,62,51,0.05)] transition-all font-mono backdrop-blur-sm appearance-none cursor-pointer"
                                                                            >
                                                                                <option value="1" className="bg-black">1st Year</option>
                                                                                <option value="2" className="bg-black">2nd Year</option>
                                                                                <option value="3" className="bg-black">3rd Year</option>
                                                                                <option value="4" className="bg-black">4th Year</option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Phone Number */}
                                                                <div className="relative group">
                                                                    <label className="text-[10px] text-[#e33e33] uppercase tracking-widest mb-2 block font-bold">Phone Number</label>
                                                                    <div className="relative">
                                                                        <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 group-focus-within:text-[#e33e33] transition-all z-10" />
                                                                        <input
                                                                            type="tel"
                                                                            name="phone"
                                                                            value={formData.phone}
                                                                            onChange={handleChange}
                                                                            required
                                                                            className="w-full bg-[#0a0a0a]/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-[#e33e33]/50 focus:shadow-[0_0_10px_rgba(227,62,51,0.05)] transition-all font-mono backdrop-blur-sm"
                                                                            placeholder="Contact Number"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Payment Summary */}
                                                            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#111]/80 border border-white/5 backdrop-blur-sm">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#97b85d]/20 to-[#97b85d]/5 border border-[#97b85d]/20">
                                                                        <FaWallet className="text-[#97b85d] text-lg" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-sm text-white font-bold uppercase tracking-wider">Payment Summary</h3>
                                                                        <p className="text-[10px] text-gray-500">Your registration breakdown</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="flex justify-between items-center text-xs">
                                                                        <span className="text-gray-500 uppercase tracking-wider">Total Events</span>
                                                                        <span className="text-white font-mono font-bold">{paymentSummary.count} EVENTS</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs">
                                                                        <span className="text-gray-500 uppercase tracking-wider">Total Value</span>
                                                                        <span className="text-gray-300 font-mono">₹{paymentSummary.total}</span>
                                                                    </div>
                                                                    <div className="flex justify-between items-center text-xs">
                                                                        <span className="text-gray-500 uppercase tracking-wider">Already Paid</span>
                                                                        <span className="text-green-500 font-mono">- ₹{paymentSummary.paid}</span>
                                                                    </div>
                                                                    <div className="my-2 border-t border-dashed border-white/10"></div>
                                                                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-[#e33e33]/10 to-[#e33e33]/5 border border-[#e33e33]/30">
                                                                        <span className="text-[#e33e33] uppercase tracking-wider font-bold text-sm">Amount to Pay</span>
                                                                        <span className="text-[#e33e33] font-mono font-bold text-2xl">₹{paymentSummary.toPay}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>

                                                        {/* Right Column - Event Selection */}
                                                        <motion.div
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.1 }}
                                                            className="md:col-span-5 relative"
                                                        >
                                                            {/* Glassmorphism container */}
                                                            <div className="relative py-6 px-2 rounded-2xl bg-gradient-to-br from-[#1a1a1a]/80 to-[#111]/80 border border-white/5 backdrop-blur-sm">
                                                                {/* Header glow */}
                                                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#97b85d]/50 to-transparent"></div>

                                                                <div className="flex items-center gap-3 mb-6">
                                                                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#97b85d]/20 to-[#97b85d]/5 border border-[#97b85d]/20">
                                                                        <FaWallet className="text-[#97b85d] text-lg" />
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="text-sm text-white font-bold uppercase tracking-wider">Select Events</h3>
                                                                        <p className="text-[10px] text-gray-500">Choose your competition tracks</p>
                                                                    </div>
                                                                </div>

                                                                {/* Event grid */}
                                                                <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                                                    {eventOptions.map((event, index) => {
                                                                        const isRegistered = alreadyRegistered.includes(event.name);
                                                                        const isSelected = formData.events.includes(event.name);

                                                                        return (
                                                                            <motion.label
                                                                                key={event.name}
                                                                                initial={{ opacity: 0, y: 10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                transition={{ delay: index * 0.05 }}
                                                                                whileHover={!isRegistered ? { scale: 1.02, y: -2 } : {}}
                                                                                whileTap={!isRegistered ? { scale: 0.98 } : {}}
                                                                                className={`group relative block p-4 rounded-xl transition-all duration-300 ${isRegistered
                                                                                    ? 'bg-gray-900/30 border border-gray-800/50 cursor-not-allowed opacity-40'
                                                                                    : isSelected
                                                                                        ? 'bg-gradient-to-br from-[#97b85d]/20 to-[#97b85d]/5 border border-[#97b85d]/40 shadow-[0_0_20px_rgba(151,184,93,0.1)] cursor-pointer'
                                                                                        : 'bg-[#0a0a0a]/50 border border-white/5 hover:border-[#97b85d]/20 cursor-pointer hover:shadow-lg'
                                                                                    }`}
                                                                            >
                                                                                {/* Selection glow effect */}
                                                                                {isSelected && !isRegistered && (
                                                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#97b85d]/0 via-[#97b85d]/10 to-[#97b85d]/0 animate-pulse"></div>
                                                                                )}

                                                                                <div className="relative flex items-center justify-between gap-3">
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                            <h4 className={`text-sm font-mono font-bold uppercase tracking-wide ${isRegistered
                                                                                                ? 'text-gray-600 line-through'
                                                                                                : isSelected
                                                                                                    ? 'text-white'
                                                                                                    : 'text-gray-400 group-hover:text-white'
                                                                                                } transition-colors`}>
                                                                                                {event.name}
                                                                                            </h4>
                                                                                            {isRegistered && (
                                                                                                <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-[9px] text-gray-500 uppercase tracking-wider">
                                                                                                    Registered
                                                                                                </span>
                                                                                            )}
                                                                                        </div>

                                                                                        {/* Price badge */}
                                                                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${isRegistered
                                                                                            ? 'bg-gray-800/50 border border-gray-700/50'
                                                                                            : isSelected
                                                                                                ? 'bg-[#e33e33]/10 border border-[#e33e33]/30'
                                                                                                : 'bg-[#0a0a0a] border border-white/5'
                                                                                            }`}>
                                                                                            <FaWallet className={`text-[10px] ${isRegistered ? 'text-gray-600' : 'text-[#e33e33]'
                                                                                                }`} />
                                                                                            <span className={`text-xs font-bold font-mono ${isRegistered ? 'text-gray-600' : 'text-[#e33e33]'
                                                                                                }`}>
                                                                                                ₹{event.price}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Checkbox indicator */}
                                                                                    <motion.div
                                                                                        animate={{
                                                                                            scale: isSelected || isRegistered ? [1, 1.2, 1] : 1,
                                                                                        }}
                                                                                        transition={{ duration: 0.3 }}
                                                                                        className={`relative flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all ${isRegistered
                                                                                            ? 'border-gray-700 bg-gray-800'
                                                                                            : isSelected
                                                                                                ? 'border-[#97b85d] bg-[#97b85d] shadow-[0_0_10px_rgba(151,184,93,0.5)]'
                                                                                                : 'border-gray-700 group-hover:border-[#97b85d]/50'
                                                                                            }`}
                                                                                    >
                                                                                        {(isSelected || isRegistered) && (
                                                                                            <motion.div
                                                                                                initial={{ scale: 0, rotate: -180 }}
                                                                                                animate={{ scale: 1, rotate: 0 }}
                                                                                                transition={{ type: "spring", stiffness: 200 }}
                                                                                            >
                                                                                                <FaCheckCircle className={`${isRegistered ? 'text-gray-500' : 'text-black'
                                                                                                    } text-sm`} />
                                                                                            </motion.div>
                                                                                        )}
                                                                                    </motion.div>

                                                                                    <input
                                                                                        type="checkbox"
                                                                                        value={event.name}
                                                                                        checked={isSelected || isRegistered}
                                                                                        onChange={handleEventChange}
                                                                                        disabled={isRegistered}
                                                                                        className="hidden"
                                                                                    />
                                                                                </div>
                                                                            </motion.label>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </motion.div>

                                                        {/* Premium Submit Button - Full Width Across Grid */}
                                                        <motion.button
                                                            type="submit"
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.3 }}
                                                            whileHover={{ scale: 1.005, y: -4 }}
                                                            whileTap={{ scale: 0.995 }}
                                                            className="group relative w-full md:col-span-12 mt-10 py-5 rounded-2xl overflow-hidden font-bold uppercase tracking-wider text-white shadow-[0_30px_80px_rgba(227,62,51,0.6)] hover:shadow-[0_35px_90px_rgba(227,62,51,0.7)] transition-all"
                                                        >
                                                            {/* Animated gradient background */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-[#e33e33] via-[#97b85d] to-[#e33e33] bg-[length:200%_100%] animate-gradient"></div>

                                                            {/* Shine effect */}
                                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out"></div>

                                                            {/* Content */}
                                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                                <FaWallet className="text-xl" />
                                                                <span className="text-lg">Pay & Register</span>
                                                            </div>

                                                            {/* Glow effect */}
                                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity blur-2xl bg-gradient-to-r from-[#e33e33] to-[#97b85d]"></div>
                                                        </motion.button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    /* ================== SUCCESS VIEW ================== */
                                    /* ================== SUCCESS VIEW: DIGITAL TICKET ================== */
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        className="w-full max-w-4xl"
                                    >
                                        <div ref={ticketRef} className="flex flex-col md:flex-row bg-[#111] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(227,62,51,0.15)] border border-[#333]">
                                            {/* Left Side: Ticket Details */}
                                            <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                                                {/* Background Texture */}
                                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                                <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full pointer-events-none" style={{ background: 'linear-gradient(to bottom right, rgba(227,62,51,0.1), transparent)' }}></div>

                                                <div className="relative z-10 flex flex-col h-full justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-8">
                                                            <div>
                                                                <p className="text-[#e33e33] text-xs font-mono uppercase tracking-[0.3em] mb-2">Symposium Pass</p>
                                                                <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide">ZORPHIX '26</h1>
                                                            </div>
                                                            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                                                                <FaUserTie className="text-white/50" />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-8 mb-8">
                                                            <div>
                                                                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Attendee</p>
                                                                <p className="text-white font-mono text-lg">{user.displayName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Pass ID</p>
                                                                <p className="text-[#97b85d] font-mono text-lg">#{user.uid.slice(0, 6).toUpperCase()}</p>
                                                            </div>
                                                        </div>

                                                        <div className="mb-8">
                                                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Registered Events</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {alreadyRegistered.map(event => (
                                                                    <span key={event} className="px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded text-[10px] md:text-xs text-gray-300 font-mono uppercase tracking-wider">
                                                                        {event}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-end border-t border-[#333] pt-6">
                                                        <div>
                                                            <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Date</p>
                                                            <p className="text-gray-400 font-mono text-xs">March 15-16, 2026</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Total Paid</p>
                                                            <p className="text-white font-mono text-xl">₹{paymentSummary.paid}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Side: QR Code Panel (Perforated Look) */}
                                            <div className="md:w-80 bg-white relative flex flex-col items-center justify-center p-8 border-l-4 border-dashed border-[#111]">
                                                {/* Perforation Circles (Visual Hack) */}
                                                <div className="absolute top-[-10px] left-[-12px] w-6 h-6 bg-[#111] rounded-full"></div>
                                                <div className="absolute bottom-[-10px] left-[-12px] w-6 h-6 bg-[#111] rounded-full"></div>

                                                <div className="text-center mb-6">
                                                    <p className="text-black font-bold uppercase tracking-[0.2em] text-xs mb-1">Scan for Entry</p>
                                                    <p className="text-gray-400 text-[9px] uppercase tracking-widest">Admit One</p>
                                                </div>

                                                <div className="p-4 bg-white border-2 border-black rounded-lg mb-6 shadow-xl">
                                                    <img
                                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.uid}`}
                                                        alt="Entry QR Code"
                                                        crossOrigin="anonymous"
                                                        className="w-32 h-32 md:w-40 md:h-40"
                                                    />
                                                </div>

                                                <p className="text-[10px] text-gray-400 font-mono text-center mb-8 break-all px-4">
                                                    {user.uid}
                                                </p>

                                                <div className="ticket-actions w-full">
                                                    <button
                                                        onClick={handleDownloadTicket}
                                                        className="w-full py-3 mb-3 bg-[#e33e33] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#c62828] transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <FaDownload /> Download Ticket
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setShowTicket(false);
                                                            // Do not clear events; let useEffect sync persist
                                                        }}
                                                        className="w-full py-3 bg-[#111] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#333] transition-colors border border-[#333]"
                                                    >
                                                        Register More Events
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                    }
                </AnimatePresence >
            </div >

            <style>{`
                @keyframes float-up {
                    0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .currency-symbol {
                    position: absolute;
                    font-family: 'Times New Roman', serif;
                    font-weight: bold;
                    pointer-events: none;
                    text-shadow: 0 0 5px currentColor;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.2);
                }
                .animate-gradient {
                    animation: gradient 8s ease infinite;
                }
            `}</style>
        </div >
    );
};

export default Register;
