import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaReply, FaClock, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const UserQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReply, setActiveReply] = useState(null); // { id: string, text: string }
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!auth.currentUser) {
            setLoading(false);
            return;
        }

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

            userQueries.sort((a, b) => b.createdAt - a.createdAt);
            setQueries(userQueries);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching queries:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleUserReply = async (queryId) => {
        if (!activeReply?.text?.trim()) return;

        setIsSubmitting(true);
        try {
            const queryRef = doc(db, 'queries', queryId);
            await updateDoc(queryRef, {
                status: 'pending', // Re-open status for admin attention
                responses: arrayUnion({
                    text: activeReply.text.trim(),
                    respondedAt: new Date(),
                    respondedBy: 'user'
                }),
                lastRespondedAt: serverTimestamp()
            });

            toast.success('Reply sent successfully!');
            setActiveReply(null);
        } catch (error) {
            console.error('Error sending reply:', error);
            toast.error('Failed to send reply');
        } finally {
            setIsSubmitting(false);
        }
    };

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
        return null;
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

                            {/* Legacy Admin Response */}
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

                            {/* Threaded Responses */}
                            {q.responses && q.responses.map((resp, idx) => {
                                const isAdmin = resp.respondedBy === 'admin';
                                return (
                                    <div key={idx} className={`mt-3 pt-3 border-t border-white/10 ${!isAdmin ? 'pl-4' : ''}`}>
                                        <div className={`flex items-center gap-2 mb-2 ${!isAdmin ? 'justify-end' : ''}`}>
                                            {isAdmin ? (
                                                <>
                                                    <FaReply className="text-[#97b85d] text-xs" />
                                                    <span className="text-xs text-[#97b85d] font-bold uppercase tracking-wider">
                                                        Admin Response
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                                        You
                                                    </span>
                                                    <FaReply className="text-gray-400 text-xs transform scale-x-[-1]" />
                                                </>
                                            )}
                                            <span className="text-[10px] text-gray-500">
                                                {formatDate(resp.respondedAt?.toDate ? resp.respondedAt.toDate() : resp.respondedAt)}
                                            </span>
                                        </div>
                                        <p className={`text-sm rounded-lg p-3 border ${isAdmin
                                            ? 'text-white bg-[#97b85d]/10 border-[#97b85d]/20'
                                            : 'text-gray-300 bg-white/5 border-white/10 text-right'
                                            }`}>
                                            {resp.text}
                                        </p>
                                    </div>
                                );
                            })}

                            {/* Reply Action */}
                            <div className="mt-4 flex justify-end">
                                {activeReply?.id === q.id ? (
                                    <div className="w-full mt-2 animate-in fade-in slide-in-from-top-2">
                                        <textarea
                                            value={activeReply.text}
                                            onChange={(e) => setActiveReply({ ...activeReply, text: e.target.value })}
                                            placeholder="Type your reply..."
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#e33e33] min-h-[80px] mb-2"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setActiveReply(null)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                            <button
                                                onClick={() => handleUserReply(q.id)}
                                                disabled={isSubmitting || !activeReply.text.trim()}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#e33e33] text-white hover:bg-[#c62828] transition-colors flex items-center gap-1 disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <FaPaperPlane />
                                                )}
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setActiveReply({ id: q.id, text: '' })}
                                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
                                    >
                                        <FaReply /> Reply to thread
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default UserQueries;
