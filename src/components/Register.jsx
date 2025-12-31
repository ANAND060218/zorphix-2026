import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { FaGoogle, FaUser, FaEnvelope, FaUniversity, FaGraduationCap, FaPhone, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Background from './Background';

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
                // Check if user is already registered
                const docRef = doc(db, 'registrations', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSubmitted(true);
                    // Optionally populate form with existing data if you want to allow edits
                    // setFormData(docSnap.data());
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
            alert(`Sign-in failed: ${error.message}\n\nCheck if 'localhost' is added to Authorized Domains in Firebase Console.`);
        }
    };

    const handleSignOut = () => {
        signOut(auth);
        setSubmitted(false);
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
                registeredAt: serverTimestamp()
            });
            console.log("Registration saved to Firestore");
            setSubmitted(true);
        } catch (error) {
            console.error("Error saving registration:", error);
            // Optionally set an error state here to show to the user
            alert("Failed to save registration. Please try again.");
        }
    };

    // List of events for selection (could be imported from a shared constant)
    const eventOptions = [
        'Code Wars', 'Cyber Heist', 'AI Nexus', 'Web Wizards',
        'Robo Rumble', 'Circuitrix', 'Lens Legends', 'Meme Masters',
        'Gaming Arena', 'Treasure Hunt', 'Quiz Bowl'
    ];

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
            <Background />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>

            <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center min-h-screen">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 tracking-widest glitch-text" data-text="REGISTRATION">
                        REGISTRATION
                    </h1>

                    {!user ? (
                        // Unauthenticated View
                        <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#e33e33]/10 to-[#97b85d]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10 text-center space-y-6">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(227,62,51,0.5)]">
                                    <FaUser className="text-3xl text-white" />
                                </div>
                                <h2 className="text-xl text-gray-300 tracking-wider">Please Sign In to Continue</h2>
                                <p className="text-sm text-gray-500">
                                    You need to verify your identity with Google before accessing the registration form.
                                </p>

                                <button
                                    onClick={handleGoogleSignIn}
                                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-3 hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                >
                                    <FaGoogle className="text-[#e33e33]" /> Sign in with Google
                                </button>
                            </div>
                        </div>
                    ) : !submitted ? (
                        // Registration Form
                        <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-md relative">
                            <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                                <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-full border-2 border-[#97b85d]" />
                                <div>
                                    <h2 className="text-lg font-bold text-white tracking-wider">{user.displayName}</h2>
                                    <p className="text-xs text-gray-400 font-mono">{user.email}</p>
                                </div>
                                <button onClick={handleSignOut} className="ml-auto text-xs text-[#e33e33] hover:underline">Sign Out</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">College Name</label>
                                    <div className="relative">
                                        <FaUniversity className="absolute left-3 top-3 text-gray-500" />
                                        <input
                                            type="text"
                                            name="college"
                                            value={formData.college}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#97b85d] focus:outline-none focus:ring-1 focus:ring-[#97b85d] transition-all"
                                            placeholder="Enter your college"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Department</label>
                                        <div className="relative">
                                            <FaGraduationCap className="absolute left-3 top-3 text-gray-500" />
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#97b85d] focus:outline-none focus:ring-1 focus:ring-[#97b85d] transition-all"
                                                placeholder="Dept."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Year</label>
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-sm text-white focus:border-[#97b85d] focus:outline-none focus:ring-1 focus:ring-[#97b85d] transition-all appearance-none"
                                        >
                                            <option value="1" className="bg-black">1st Year</option>
                                            <option value="2" className="bg-black">2nd Year</option>
                                            <option value="3" className="bg-black">3rd Year</option>
                                            <option value="4" className="bg-black">4th Year</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                                    <div className="relative">
                                        <FaPhone className="absolute left-3 top-3 text-gray-500" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#97b85d] focus:outline-none focus:ring-1 focus:ring-[#97b85d] transition-all"
                                            placeholder="Mobile Number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Select Events</label>
                                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1 border border-white/5 rounded-lg">
                                        {eventOptions.map(event => (
                                            <label key={event} className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer hover:text-white">
                                                <input
                                                    type="checkbox"
                                                    value={event}
                                                    checked={formData.events.includes(event)}
                                                    onChange={handleEventChange}
                                                    className="form-checkbox bg-transparent border-gray-600 text-[#e33e33] rounded focus:ring-0"
                                                />
                                                <span>{event}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 mt-4 bg-gradient-to-r from-[#e33e33] to-[#97b85d] rounded-lg text-white font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(227,62,51,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Complete Registration
                                </button>
                            </form>
                        </div>
                    ) : (
                        // Success View
                        <div className="bg-[#0a0a0a] border border-[#97b85d]/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(151,184,93,0.2)] backdrop-blur-md text-center">
                            <div className="w-16 h-16 mx-auto bg-[#97b85d] rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(151,184,93,0.5)]">
                                <FaCheckCircle className="text-3xl text-black" />
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-wider mb-2">REGISTRATION SUCCESSFUL</h2>
                            <p className="text-gray-400 mb-6">
                                Thank you for registering, <span className="text-[#97b85d]">{user.displayName}</span>!
                                <br />We will verify your details and send a confirmation email shortly.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setSubmitted(false)} className="text-sm text-gray-500 hover:text-white underline">Register Another</button>
                                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors">Go to Home</button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #555;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default Register;
