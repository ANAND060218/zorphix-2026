import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FaGoogle, FaUserTie, FaUniversity, FaBuilding, FaPhone, FaCheckCircle, FaBriefcase, FaChartLine, FaSignOutAlt, FaWallet, FaCoins, FaDownload } from 'react-icons/fa';
import * as htmlToImage from 'html-to-image';
import CoinBackground from './CoinBackground';
import CurrencyBackground from './CurrencyBackground';
import toast from 'react-hot-toast';
import { technicalEvents, workshops, paperPresentation } from '../data/events';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [registeredEventsList, setRegisteredEventsList] = useState([]);
    const ticketRef = useRef(null);

    // Combine all events for lookup
    const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];

    const [formData, setFormData] = useState({
        college: '',
        department: '',
        year: '1',
        phone: ''
    });


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const docRef = doc(db, 'registrations', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setFormData({
                            college: data.college || '',
                            department: data.department || '',
                            year: data.year || '1',
                            phone: data.phone || ''
                        });
                        if (data.events && Array.isArray(data.events)) {
                            setRegisteredEventsList(data.events);
                        }

                        // Check if critical fields are present to consider profile "complete"
                        // Or check for a specific flag if we decide to use one.
                        // Using field presence for robustness.
                        if (data.profileCompleted || (data.college && data.phone)) {
                            setIsProfileComplete(true);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
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
            toast.error(`Sign-In Failed: ${error.message}`);
        }
    };

    const handleSignOut = async () => {
        await signOut(auth);
        setFormData({ college: '', department: '', year: '1', phone: '' });
        setRegisteredEventsList([]);
        setIsProfileComplete(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            const userRef = doc(db, 'registrations', user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                ...formData,
                profileCompleted: true, // Mark as complete
                updatedAt: serverTimestamp()
            }, { merge: true }); // Merge to avoid overwriting existing events if any

            setIsProfileComplete(true);
            toast.success('Profile Completed Successfully!');
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error('Failed to save profile. Please try again.');
        }
    };

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
            toast.success("Ticket downloaded successfully!");
        } catch (err) {
            console.error("Failed to save ticket:", err);
            toast.error("Could not save ticket image.");
        }
    };

    const calculateTotalPaid = () => {
        return registeredEventsList.reduce((sum, eventName) => {
            const event = allEvents.find(e => e.name === eventName);
            return sum + (event?.price === 'FREE' ? 0 : parseInt(event?.price?.replace('₹', '') || 0));
        }, 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-[#e33e33] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#e33e33] tracking-[0.3em] animate-pulse font-bold text-xl">AUTHENTICATING SYSTEM</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-[#e33e33] selection:text-black pt-20 relative">

            {/* Backgrounds */}
            <CurrencyBackground />
            <CoinBackground />

            {/* Vignette Overlay */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] z-0 pointer-events-none"></div>

            <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[85vh]">
                <AnimatePresence mode='wait'>
                    {!user ? (
                        /* ================== UNAUTHENTICATED VIEW ================== */
                        <motion.div
                            key="login"
                            initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.9, opacity: 0, rotateX: -20 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="w-full max-w-2xl perspective-1000"
                        >
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-12 md:p-20 text-center relative shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden group">
                                {/* Decor - Massive Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#e33e33]/5 via-transparent to-[#97b85d]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="absolute -top-[20%] -right-[20%] w-[50%] h-[50%] bg-[#e33e33] blur-[150px] opacity-[0.15]"></div>

                                {/* Icon */}
                                <div className="relative mb-12 transform group-hover:scale-105 transition-transform duration-500">
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#e33e33] to-[#800000] rounded-[2rem] shadow-[0_20px_50px_rgba(227,62,51,0.3)] flex items-center justify-center relative z-10 border border-white/20">
                                        <FaUserTie className="text-5xl text-white drop-shadow-md" />
                                    </div>
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#e33e33] blur-2xl opacity-40 z-0"></div>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight uppercase" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                    Access Portal
                                </h1>
                                <p className="text-gray-500 font-mono tracking-[0.3em] uppercase mb-16 text-sm">
                                    /// Secure Authentication Required ///
                                </p>

                                <button
                                    onClick={handleGoogleSignIn}
                                    className="relative w-full py-6 bg-white hover:bg-gray-100 text-black font-black text-xl uppercase tracking-widest rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-5px_rgba(255,255,255,0.3)] flex items-center justify-center gap-4 group overflow-hidden"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-gray-200/50 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                                    <FaGoogle className="text-2xl" />
                                    <span>Sign Initiate</span>
                                </button>

                                <div className="mt-12 flex items-center justify-center gap-3 text-xs text-green-500 font-mono opacity-60">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    ENCRYPTED CONNECTION V.2.0.4
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* ================== AUTHENTICATED VIEW ================== */
                        <motion.div
                            key="profile"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full max-w-5xl"
                        >
                            <div className="relative bg-[#0d0d0d] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] backdrop-blur-sm">

                                {/* Header Bar with flowing gradient */}
                                <div className="h-48 bg-gradient-to-r from-[#1a1a1a] via-[#0d0d0d] to-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d0d0d]"></div>

                                    {/* Abstract currency details in header */}
                                    <div className="absolute inset-0 flex items-center justify-between px-10 opacity-10 pointer-events-none">
                                        <FaCoins className="text-9xl text-white transform -rotate-12" />
                                        <FaWallet className="text-9xl text-white transform rotate-12" />
                                    </div>

                                    <div className="absolute top-8 right-8 z-20">
                                        <button
                                            onClick={handleSignOut}
                                            className="group flex items-center gap-3 px-6 py-3 bg-black/40 hover:bg-[#e33e33] text-gray-400 hover:text-white rounded-2xl text-xs font-bold font-mono uppercase tracking-widest border border-white/5 hover:border-[#e33e33] transition-all backdrop-blur-md"
                                        >
                                            <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" /> Disconnect
                                        </button>
                                    </div>
                                </div>

                                <div className="px-8 md:px-16 pb-16 relative z-10">
                                    {/* Avatar & User Info - Compact Version */}
                                    <div className="flex flex-col md:flex-row items-end md:items-center gap-6 -mt-16 mb-8">
                                        <div className="relative group perspective-1000">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                                            <motion.img
                                                whileHover={{ rotateY: 10, rotateX: -10 }}
                                                src={user.photoURL}
                                                alt="Profile"
                                                className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-[#0d0d0d] shadow-2xl object-cover bg-[#1c1c1c] z-10"
                                            />
                                            {isProfileComplete && (
                                                <div className="absolute -bottom-2 -right-2 bg-[#97b85d] text-black w-8 h-8 rounded-lg flex items-center justify-center border-2 border-[#0d0d0d] shadow-xl z-20" title="Profile Verified">
                                                    <FaCheckCircle className="text-sm" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 mb-4">
                                            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-none">{user.displayName}</h2>
                                            <div className="flex flex-wrap gap-4 text-xs font-bold font-mono text-gray-400">
                                                <span className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${isProfileComplete ? 'bg-[#97b85d]/10 border-[#97b85d]/30 text-[#97b85d]' : 'bg-[#e33e33]/10 border-[#e33e33]/30 text-[#e33e33]'}`}>
                                                    <div className="w-2 h-2 rounded-full bg-[#97b85d] animate-pulse"></div>
                                                    {isProfileComplete ? 'ACCOUNT VERIFIED' : 'ACTION REQUIRED'}
                                                </span>
                                                <span className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 flex items-center gap-3">
                                                    UID: {user.uid.slice(0, 8).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {!isProfileComplete ? (
                                        /* ================== INCOMPLETE FORM ================== */
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="relative w-full max-w-4xl mx-auto"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#e33e33]/10 via-transparent to-[#97b85d]/10 pointer-events-none filter blur-3xl"></div>

                                            <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-[2rem] px-8 py-8 shadow-2xl">
                                                {/* Decorative Corner Accents (Smaller) */}
                                                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#e33e33]/30 rounded-tl-[2rem] pointer-events-none"></div>
                                                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#97b85d]/30 rounded-br-[2rem] pointer-events-none"></div>

                                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-6">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-16 h-16 bg-[#e33e33]/10 rounded-xl flex items-center justify-center border border-[#e33e33]/20">
                                                            <FaUserTie className="text-2xl text-[#e33e33]" />
                                                        </div>
                                                    </div>
                                                    <div className="text-center md:text-left flex-1">
                                                        <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Finalize Identity</h3>
                                                        <p className="text-gray-400 text-sm leading-snug max-w-xl">
                                                            Mandatory profile registration for Zorphix Event Grid access.
                                                        </p>
                                                    </div>
                                                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#e33e33] font-mono text-[10px] font-bold tracking-widest uppercase">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#e33e33] animate-pulse"></span>
                                                        Required
                                                    </div>
                                                </div>

                                                <form onSubmit={handleSubmitProfile} className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                                                        {/* College Input */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Institute Name</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="college"
                                                                    value={formData.college}
                                                                    onChange={handleChange}
                                                                    required
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all"
                                                                    placeholder="Enter College..."
                                                                />
                                                                <FaUniversity className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm group-focus-within:text-[#e33e33] transition-colors" />
                                                            </div>
                                                        </div>

                                                        {/* Department Input */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Department</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    name="department"
                                                                    value={formData.department}
                                                                    onChange={handleChange}
                                                                    required
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all"
                                                                    placeholder="Enter Dept..."
                                                                />
                                                                <FaBriefcase className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm group-focus-within:text-[#e33e33] transition-colors" />
                                                            </div>
                                                        </div>

                                                        {/* Year Input */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Current Year</label>
                                                            <div className="relative">
                                                                <select
                                                                    name="year"
                                                                    value={formData.year}
                                                                    onChange={handleChange}
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                                                >
                                                                    <option value="1" className="bg-[#111]">Year 1</option>
                                                                    <option value="2" className="bg-[#111]">Year 2</option>
                                                                    <option value="3" className="bg-[#111]">Year 3</option>
                                                                    <option value="4" className="bg-[#111]">Year 4</option>
                                                                </select>
                                                                <FaChartLine className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm group-focus-within:text-[#e33e33] transition-colors pointer-events-none" />
                                                            </div>
                                                        </div>

                                                        {/* Phone Input */}
                                                        <div className="space-y-1 group">
                                                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest group-focus-within:text-[#e33e33] transition-colors">Contact Number</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="tel"
                                                                    name="phone"
                                                                    value={formData.phone}
                                                                    onChange={handleChange}
                                                                    required
                                                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-8 text-sm font-bold text-white placeholder-white/20 focus:outline-none focus:border-[#e33e33] focus:bg-white/10 transition-all"
                                                                    placeholder="+91..."
                                                                />
                                                                <FaPhone className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-sm group-focus-within:text-[#e33e33] transition-colors" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 flex flex-col items-center">
                                                        <button
                                                            type="submit"
                                                            className="w-full md:w-auto px-10 py-3 bg-white text-black font-black text-sm uppercase tracking-widest rounded-xl hover:bg-[#e33e33] hover:text-white transition-all duration-300 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_-5px_rgba(227,62,51,0.6)] flex items-center justify-center gap-2"
                                                        >
                                                            Complete Profile <FaCheckCircle />
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        /* ================== COMPLETED DETAILS VIEW ================== */
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full max-w-4xl mx-auto"
                                        >
                                            <>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                                    <div className="group p-4 rounded-2xl border border-white/5 bg-[#111] hover:bg-[#161616] transition-all relative overflow-hidden">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Institute</span>
                                                        <span className="text-sm font-bold text-white block truncate" title={formData.college}>{formData.college}</span>
                                                    </div>

                                                    <div className="group p-4 rounded-2xl border border-white/5 bg-[#111] hover:bg-[#161616] transition-all relative overflow-hidden">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Department</span>
                                                        <span className="text-sm font-bold text-white block truncate" title={formData.department}>{formData.department}</span>
                                                    </div>

                                                    <div className="group p-4 rounded-2xl border border-white/5 bg-[#111] hover:bg-[#161616] transition-all relative overflow-hidden">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Year Level</span>
                                                        <span className="text-sm font-bold text-white block">Year {formData.year}</span>
                                                    </div>

                                                    <div className="group p-4 rounded-2xl border border-white/5 bg-[#111] hover:bg-[#161616] transition-all relative overflow-hidden">
                                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Contact</span>
                                                        <span className="text-sm font-bold text-white block">{formData.phone}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <button
                                                        onClick={() => navigate('/events')}
                                                        className="flex-1 py-4 bg-white text-black font-black text-lg uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.3)] transform hover:-translate-y-1 relative overflow-hidden group"
                                                    >
                                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                                        Access Events Module
                                                    </button>



                                                    <button
                                                        onClick={() => setIsProfileComplete(false)}
                                                        className="px-6 py-4 border-2 border-white/10 hover:border-white/30 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl font-mono font-bold uppercase text-xs tracking-widest transition-all"
                                                    >
                                                        Modify
                                                    </button>
                                                </div>
                                            </>
                                            {registeredEventsList.length > 0 && (
                                                /* ================== TICKET VIEW ================== */
                                                <motion.div
                                                    initial={{ scale: 0.95, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="w-full"
                                                >
                                                    <div className="mb-6 flex justify-between items-center">

                                                        <h3 className="text-white font-bold uppercase tracking-widest text-sm">Official Entry Pass</h3>
                                                    </div>

                                                    <div ref={ticketRef} className="flex flex-col md:flex-row bg-[#111] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(227,62,51,0.15)] border border-[#333]">
                                                        {/* Ticket Left Side */}
                                                        <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                                            <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full pointer-events-none" style={{ background: 'linear-gradient(to bottom right, rgba(227,62,51,0.1), transparent)' }}></div>

                                                            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                                                <div>
                                                                    <div className="flex justify-between items-start mb-8">
                                                                        <div>
                                                                            <p className="text-[#e33e33] text-xs font-mono uppercase tracking-[0.3em] mb-2">Symposium Pass</p>
                                                                            <h1 className="text-3xl md:text-5xl font-serif text-white tracking-wide">ZORPHIX '26</h1>
                                                                        </div>
                                                                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                                                                            <FaUserTie className="text-white/50" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-8 mb-8">
                                                                        <div>
                                                                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Attendee</p>
                                                                            <p className="text-white font-mono text-lg font-bold">{user.displayName}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Pass ID</p>
                                                                            <p className="text-[#97b85d] font-mono text-lg font-bold">#{user.uid.slice(0, 6).toUpperCase()}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-3">Registered Events</p>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {registeredEventsList.map(event => (
                                                                                <span key={event} className="px-3 py-1 bg-[#1a1a1a] border border-[#333] rounded text-[10px] md:text-xs text-gray-300 font-mono uppercase tracking-wider">
                                                                                    {event}
                                                                                </span>
                                                                            ))}
                                                                            {registeredEventsList.length === 0 && <span className="text-gray-600 text-xs italic">No events registered yet.</span>}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between items-end border-t border-[#333] pt-6">
                                                                    <div>
                                                                        <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Date</p>
                                                                        <p className="text-gray-400 font-mono text-xs">March 15-16, 2026</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-gray-600 text-[9px] uppercase tracking-widest mb-1">Total Value</p>
                                                                        <p className="text-white font-mono text-xl">₹{calculateTotalPaid()}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Ticket Right Side (QR) */}
                                                        <div className="md:w-80 bg-white relative flex flex-col items-center justify-center p-8 border-l-4 border-dashed border-[#111]">
                                                            <div className="absolute top-[-10px] left-[-12px] w-6 h-6 bg-[#000] rounded-full"></div>
                                                            <div className="absolute bottom-[-10px] left-[-12px] w-6 h-6 bg-[#000] rounded-full"></div>

                                                            <div className="text-center mb-6">
                                                                <p className="text-black font-bold uppercase tracking-[0.2em] text-xs mb-1">Scan for Entry</p>
                                                                <p className="text-gray-400 text-[9px] uppercase tracking-widest">Admit One</p>
                                                            </div>

                                                            <div className="p-4 bg-white border-2 border-black rounded-lg mb-6 shadow-xl">
                                                                <img
                                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.uid}`}
                                                                    alt="Entry QR Code"
                                                                    crossOrigin="anonymous"
                                                                    className="w-32 h-32 md:w-36 md:h-36"
                                                                />
                                                            </div>

                                                            <p className="text-[10px] text-gray-400 font-mono text-center mb-8 break-all px-4">
                                                                {user.uid}
                                                            </p>

                                                            <div className="ticket-actions w-full">
                                                                <button
                                                                    onClick={handleDownloadTicket}
                                                                    className="w-full py-3 bg-[#e33e33] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#c62828] transition-colors flex items-center justify-center gap-2 rounded-lg"
                                                                >
                                                                    <FaDownload /> Download Ticket
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;
