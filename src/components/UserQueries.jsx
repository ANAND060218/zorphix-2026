import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaReply, FaClock, FaCheckCircle } from 'react-icons/fa';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const UserQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }

        // Listen for user's queries (no orderBy to avoid index requirement)
        const q = query(
            collection(db, 'queries'),
            where('userId', '==', auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userQueries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.() || new Date()
            }));
            // Sort client-side by createdAt descending
            userQueries.sort((a, b) => b.createdAt - a.createdAt);
            setQueries(userQueries);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching queries:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#e33e33] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (queries.length === 0) {
        return null; // Don't show section if no queries
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
        >
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#e33e33]/10 rounded-xl flex items-center justify-center">
                        <FaQuestionCircle className="text-[#e33e33]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">My Queries</h3>
                        <p className="text-xs text-gray-500">Your submitted questions & responses</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {queries.map((q) => (
                        <div
                            key={q.id}
                            className={`p-4 rounded-xl border ${q.status === 'responded'
                                ? 'bg-[#97b85d]/5 border-[#97b85d]/20'
                                : 'bg-white/5 border-white/10'
                                }`}
                        >
                            {/* Original Query */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <FaClock size={10} />
                                        {formatDate(q.createdAt)}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${q.status === 'responded'
                                        ? 'bg-[#97b85d]/20 text-[#97b85d]'
                                        : 'bg-[#e33e33]/20 text-[#e33e33]'
                                        }`}>
                                        {q.status === 'responded' ? 'Responded' : 'Pending'}
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">{q.message}</p>
                            </div>

                            {/* Admin Response */}
                            {q.response && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaReply className="text-[#97b85d] text-xs" />
                                        <span className="text-xs text-[#97b85d] font-bold uppercase tracking-wider">Admin Response</span>
                                    </div>
                                    <p className="text-white text-sm bg-[#97b85d]/10 rounded-lg p-3 border border-[#97b85d]/20">
                                        {q.response}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default UserQueries;
