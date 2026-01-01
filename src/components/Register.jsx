import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FaGoogle, FaUserTie, FaUniversity, FaBuilding, FaPhone, FaCheckCircle, FaChartLine, FaBriefcase, FaWallet, FaHandshake } from 'react-icons/fa';
import CurrencyBackground from './CurrencyBackground';

const Register = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        college: '',
        department: '',
        year: '1',
        phone: '',
        events: []
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const docRef = doc(db, 'registrations', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
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
        if (checked) {
            setFormData({ ...formData, events: [...events, value] });
        } else {
            setFormData({ ...formData, events: events.filter((e) => e !== value) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            await setDoc(doc(db, 'registrations', user.uid), {
                ...formData,
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                registeredAt: serverTimestamp(),
                portfolioValue: 'PENDING VALUATION'
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Error saving registration:", error);
            alert("Transaction Failed. Retry.");
        }
    };

    const eventOptions = [
        'Code Wars', 'Cyber Heist', 'AI Nexus', 'Web Wizards',
        'Robo Rumble', 'Circuitrix', 'Lens Legends', 'Meme Masters',
        'Gaming Arena', 'Treasure Hunt', 'Quiz Bowl'
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f0d] text-white font-serif relative overflow-hidden flex flex-col items-center justify-center selection:bg-[#e33e33] selection:text-black">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1a2e26,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#1f1a0e,transparent_50%)]"></div>

                <CurrencyBackground />

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
        <div className="min-h-screen bg-[#0a0f0d] text-white font-serif relative overflow-hidden selection:bg-[#e33e33] selection:text-black">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1a2e26,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#1f1a0e,transparent_50%)]"></div>

            {/* Floating Currency Symbols */}
            <CurrencyBackground />

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
                                                    {eventOptions.map(event => (
                                                        <label key={event} className={`flex items-center justify-between p-3 border rounded cursor-pointer transition-all ${formData.events.includes(event)
                                                            ? 'border-[#97b85d] bg-[#97b85d]/10'
                                                            : 'border-[#333] hover:border-gray-500'
                                                            }`}>
                                                            <span className={`text-xs font-mono uppercase ${formData.events.includes(event) ? 'text-white' : 'text-gray-500'
                                                                }`}>{event}</span>

                                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${formData.events.includes(event) ? 'border-[#97b85d] bg-[#97b85d]' : 'border-gray-600'
                                                                }`}>
                                                                {formData.events.includes(event) && <FaCheckCircle className="text-black text-[10px]" />}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                value={event}
                                                                checked={formData.events.includes(event)}
                                                                onChange={handleEventChange}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    ))}
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-[#333] flex justify-between items-center text-xs">
                                                    <span className="text-gray-500 uppercase tracking-wider">Total Selected</span>
                                                    <span className="text-[#97b85d] font-mono font-bold">{formData.events.length} EVENTS</span>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="w-full mt-6 py-4 bg-gradient-to-r from-[#e33e33] to-[#97b85d] hover:from-[#c2352b] hover:to-[#86a352] text-white font-bold uppercase tracking-[0.2em] rounded shadow-[0_5px_15px_rgba(227,62,51,0.3)] transition-all transform hover:-translate-y-1"
                                                >
                                                    Register Now
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* ================== SUCCESS VIEW ================== */
                            <motion.div
                                key="success"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full max-w-lg"
                            >
                                <div className="bg-[#111] border-2 border-[#97b85d] p-10 text-center relative shadow-[0_0_50px_rgba(151,184,93,0.2)]">
                                    <div className="w-20 h-20 mx-auto bg-[#97b85d] rounded-full flex items-center justify-center mb-6">
                                        <FaHandshake className="text-4xl text-black" />
                                    </div>

                                    <h2 className="text-3xl font-serif text-white tracking-wide mb-2">
                                        REGISTRATION SUCCESSFUL
                                    </h2>

                                    <p className="text-[#97b85d] font-mono text-xs tracking-wider mb-8">
                                        REGISTRATION ID: #{user.uid.slice(0, 6).toUpperCase()}
                                    </p>

                                    <div className="bg-[#080808] p-6 rounded border border-[#333] mb-8">
                                        <p className="text-gray-400 text-sm italic leading-relaxed font-serif">
                                            "Welcome aboard, {user.displayName.split(' ')[0]}. You have successfully registered for the events. Check your email for details."
                                        </p>
                                    </div>

                                    <div className="flex gap-4 justify-center">
                                        <button onClick={() => setSubmitted(false)} className="text-xs text-gray-500 hover:text-[#e33e33] uppercase tracking-widest underline">
                                            Register Another
                                        </button>
                                        <button className="px-6 py-2 border border-white text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                                            Return Home
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
