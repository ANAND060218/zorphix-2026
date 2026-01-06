import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FaGoogle, FaUserTie, FaUniversity, FaBuilding, FaPhone, FaCheckCircle, FaChartLine, FaBriefcase, FaWallet, FaHandshake } from 'react-icons/fa';


const Register = () => {
    // Defined properly at the top or outside to be accessible
    const eventOptions = [
        // Technical Events (from EventsPage.jsx)
        { name: 'Pixel Reforge', type: 'tech', price: 149 },
        { name: 'PromptCraft', type: 'tech', price: 149 },
        { name: 'AlgoPulse', type: 'tech', price: 149 },
        { name: 'CodeBack', type: 'tech', price: 149 },
        { name: 'Sip to Survive', type: 'tech', price: 149 },
        { name: 'CodeCrypt', type: 'tech', price: 149 },
        { name: 'LinkLogic', type: 'tech', price: 149 },

        // Keeping existing Non-Tech and Workshops for now
        { name: 'Lens Legends', type: 'non-tech', price: 99 },
        { name: 'Meme Masters', type: 'non-tech', price: 99 },
        { name: 'Gaming Arena', type: 'non-tech', price: 99 },
        { name: 'Treasure Hunt', type: 'non-tech', price: 99 },
        { name: 'Quiz Bowl', type: 'non-tech', price: 99 },
        { name: 'Ethical Hacking', type: 'workshop', price: 199 },
        { name: 'App Dev', type: 'workshop', price: 199 },
        { name: 'Blockchain', type: 'workshop', price: 199 }
    ];

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

    const location = useLocation();
    // Removed the useEffect that was setting form data from localStorage
    const [submitted, setSubmitted] = useState(false);
    const [alreadyRegistered, setAlreadyRegistered] = useState([]);

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
        } catch (error) {
            console.error("Error saving registration:", error);
            alert("Transaction Failed. Retry.");
        }
    };

    // eventOptions removed (moved to top)

    const calculateTotal = () => {
        return formData.events.reduce((total, eventName) => {
            const event = eventOptions.find(e => e.name === eventName);
            return total + (event ? event.price : 0);
        }, 0);
    };

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

            <div className="relative z-10 container mx-auto px-4 pt-32 pb-12 flex flex-col items-center justify-center min-h-screen">

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
                        !submitted ? (
                            <motion.div
                                key="form"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full max-w-5xl"
                            >
                                <div className="bg-[#111] border border-[#e33e33]/30 rounded-lg shadow-2xl relative overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-[#0f0f0f] p-8 border-b border-[#333] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full border-2 border-[#e33e33]" />
                                            <div>
                                                <h2 className="text-xl font-serif text-white flex items-center gap-2">
                                                    {user.displayName} <FaCheckCircle className="text-[#e33e33] text-sm" />
                                                </h2>
                                                <p className="text-gray-500 font-mono text-xs tracking-wider">USER ID: {user.uid.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Status</p>
                                                <p className="text-xl text-[#97b85d] font-mono font-bold">VERIFIED</p>
                                            </div>
                                            <button onClick={handleSignOut} className="px-4 py-2 border border-[#e33e33] text-[#e33e33] text-xs uppercase tracking-widest hover:bg-[#e33e33] hover:text-black transition-colors">
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>

                                    {/* Form Content */}
                                    <div className="p-8 md:p-12 bg-[#080808]">
                                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-12">

                                            {/* Left Column - Personal Details */}
                                            <div className="md:col-span-7 space-y-8">
                                                <div className="flex items-center gap-2 mb-6">
                                                    <FaUserTie className="text-[#e33e33]" />
                                                    <h3 className="text-sm text-gray-400 uppercase tracking-[0.2em] font-serif">Participant Details</h3>
                                                </div>

                                                <div className="space-y-6">
                                                    <div className="relative group">
                                                        <label className="text-[10px] text-[#e33e33] uppercase tracking-widest mb-1 block">College Name</label>
                                                        <FaUniversity className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-white transition-colors" />
                                                        <input
                                                            type="text"
                                                            name="college"
                                                            value={formData.college}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full bg-transparent border-b border-gray-700 py-2 pl-6 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-[#e33e33] transition-all font-serif"
                                                            placeholder="Enter College Name"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div className="relative group">
                                                            <label className="text-[10px] text-[#e33e33] uppercase tracking-widest mb-1 block">Department</label>
                                                            <FaBriefcase className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-white transition-colors" />
                                                            <input
                                                                type="text"
                                                                name="department"
                                                                value={formData.department}
                                                                onChange={handleChange}
                                                                required
                                                                className="w-full bg-transparent border-b border-gray-700 py-2 pl-6 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-[#e33e33] transition-all font-serif"
                                                                placeholder="Enter Department"
                                                            />
                                                        </div>
                                                        <div className="relative group">
                                                            <label className="text-[10px] text-[#e33e33] uppercase tracking-widest mb-1 block">Year of Study</label>
                                                            <select
                                                                name="year"
                                                                value={formData.year}
                                                                onChange={handleChange}
                                                                className="w-full bg-transparent border-b border-gray-700 py-2 px-2 text-white placeholder-gray-700 focus:outline-none focus:border-[#e33e33] transition-all font-serif appearance-none cursor-pointer"
                                                            >
                                                                <option value="1" className="bg-black">1st Year</option>
                                                                <option value="2" className="bg-black">2nd Year</option>
                                                                <option value="3" className="bg-black">3rd Year</option>
                                                                <option value="4" className="bg-black">4th Year</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="relative group">
                                                        <label className="text-[10px] text-[#e33e33] uppercase tracking-widest mb-1 block">Phone Number</label>
                                                        <FaPhone className="absolute left-0 bottom-3 text-gray-600 group-focus-within:text-white transition-colors" />
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full bg-transparent border-b border-gray-700 py-2 pl-6 pr-4 text-white placeholder-gray-700 focus:outline-none focus:border-[#e33e33] transition-all font-serif"
                                                            placeholder="Contact Number"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column - Asset Selection */}
                                            <div className="md:col-span-5 bg-[#111] p-6 rounded border border-[#333]">
                                                <div className="flex items-center gap-2 mb-6">
                                                    <FaWallet className="text-[#97b85d]" />
                                                    <h3 className="text-sm text-gray-400 uppercase tracking-[0.2em] font-serif">Select Events</h3>
                                                </div>

                                                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                    {eventOptions.map(event => {
                                                        const isRegistered = alreadyRegistered.includes(event.name);
                                                        const isSelected = formData.events.includes(event.name);

                                                        return (
                                                            <label key={event.name} className={`flex items-center justify-between p-3 border rounded transition-all ${isRegistered
                                                                ? 'border-blue-500/50 bg-blue-500/10 cursor-not-allowed opacity-70'
                                                                : isSelected
                                                                    ? 'border-[#97b85d] bg-[#97b85d]/10 cursor-pointer'
                                                                    : 'border-[#333] hover:border-gray-500 cursor-pointer'
                                                                }`}>
                                                                <div className="flex flex-col">
                                                                    <span className={`text-xs font-mono uppercase ${isRegistered ? 'text-blue-400' : isSelected ? 'text-white' : 'text-gray-500'
                                                                        }`}>
                                                                        {event.name} {isRegistered && '(REGISTERED)'}
                                                                    </span>
                                                                    <span className="text-[10px] text-[#e33e33] mt-1">₹{event.price}</span>
                                                                </div>

                                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isRegistered
                                                                    ? 'border-blue-500 bg-blue-500'
                                                                    : isSelected
                                                                        ? 'border-[#97b85d] bg-[#97b85d]'
                                                                        : 'border-gray-600'
                                                                    }`}>
                                                                    {(isSelected || isRegistered) && <FaCheckCircle className="text-black text-[10px]" />}
                                                                </div>
                                                                <input
                                                                    type="checkbox"
                                                                    value={event.name}
                                                                    checked={isSelected || isRegistered}
                                                                    onChange={handleEventChange}
                                                                    disabled={isRegistered}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                        )
                                                    })}
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-[#333] flex flex-col gap-2">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-500 uppercase tracking-wider">Total Selected</span>
                                                        <span className="text-white font-mono">{formData.events.length} EVENTS</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-[#e33e33] uppercase tracking-wider font-bold">Total Cost</span>
                                                        <span className="text-[#97b85d] font-mono font-bold text-lg">₹{calculateTotal()}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="w-full mt-6 py-4 bg-gradient-to-r from-[#e33e33] to-[#97b85d] hover:from-[#c2352b] hover:to-[#86a352] text-white font-bold uppercase tracking-[0.2em] rounded shadow-[0_5px_15px_rgba(227,62,51,0.3)] transition-all transform hover:-translate-y-1"
                                                >
                                                    Pay & Register
                                                </button>
                                            </div>
                                        </form>
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
                                className="w-full max-w-4xl"
                            >
                                <div className="flex flex-col md:flex-row bg-[#111] rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(227,62,51,0.15)] border border-[#333]">
                                    {/* Left Side: Ticket Details */}
                                    <div className="flex-1 p-8 md:p-12 relative overflow-hidden">
                                        {/* Background Texture */}
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e33e33]/10 to-transparent rounded-bl-full pointer-events-none"></div>

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
                                                    <p className="text-white font-mono text-xl">₹{calculateTotal()}</p>
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
                                                className="w-32 h-32 md:w-40 md:h-40"
                                            />
                                        </div>

                                        <p className="text-[10px] text-gray-400 font-mono text-center mb-8 break-all px-4">
                                            {user.uid}
                                        </p>

                                        <button
                                            onClick={() => {
                                                setSubmitted(false);
                                                setFormData({ college: '', department: '', year: '1', phone: '', events: [] });
                                            }}
                                            className="w-full py-3 bg-[#111] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#e33e33] transition-colors"
                                        >
                                            Register More Events
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            <style jsx>{`
                @keyframes float-up {
                    0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.6; }
                    100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
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
                }
            `}</style>
        </div>
    );
};

export default Register;
