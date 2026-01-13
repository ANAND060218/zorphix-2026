import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import toast from 'react-hot-toast';

// Admin email (must exist in Firebase Auth)
const ADMIN_EMAIL = 'admin@zorphix.com';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Check if already logged in as admin
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.email === ADMIN_EMAIL) {
                navigate('/admin/dashboard');
            }
            setCheckingAuth(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        // Check if email is admin
        if (email !== ADMIN_EMAIL) {
            toast.error('Invalid admin credentials');
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Welcome, Admin!');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            if (error.code === 'auth/user-not-found') {
                toast.error('Admin account not found. Please create it in Firebase Console.');
            } else if (error.code === 'auth/wrong-password') {
                toast.error('Incorrect password');
            } else if (error.code === 'auth/invalid-credential') {
                toast.error('Invalid credentials. Check email and password.');
            } else {
                toast.error('Login failed: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#e33e33] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 font-mono">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e33e33] rounded-full blur-[200px] opacity-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative w-full max-w-md"
            >
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#e33e33] to-[#97b85d] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FaShieldAlt className="text-3xl text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight">ADMIN ACCESS</h1>
                        <p className="text-gray-500 text-sm mt-2">Zorphix Control Panel</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-[#e33e33] transition-colors"
                                    placeholder="admin@zorphix.com"
                                    required
                                />
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-[#e33e33] transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-[#e33e33] to-[#c62828] text-white font-bold uppercase tracking-widest rounded-xl transition-all hover:shadow-[0_0_30px_rgba(227,62,51,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <FaShieldAlt />
                                    Access Dashboard
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-gray-600 text-xs">
                            Restricted Access • Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
