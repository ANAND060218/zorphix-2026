import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch, FaReply, FaTimes, FaEnvelope, FaPaperPlane,
    FaCheck, FaClock, FaUser, FaFilter, FaFileExcel
} from 'react-icons/fa'; // Added FaFileExcel if available, else FaEnvelope
import { db } from '../../firebase';
import { collection, doc, updateDoc, serverTimestamp, query, orderBy, onSnapshot, arrayUnion } from 'firebase/firestore';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const AdminQueries = () => {
    const [queries, setQueries] = useState([]);
    const [filteredQueries, setFilteredQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        // Real-time listener
        const unsubscribe = onSnapshot(
            query(collection(db, 'queries'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const queriesData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        // Safe date conversion
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt || new Date())
                    };
                });
                setQueries(queriesData);
                setLoading(false);
            },
            (error) => {
                console.error('Error fetching queries:', error);
                toast.error('Failed to load queries');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let result = queries;

        // Filter by status
        if (statusFilter !== 'all') {
            result = result.filter(q => q.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(q =>
                (q.email && q.email.toLowerCase().includes(term)) ||
                (q.message && q.message.toLowerCase().includes(term))
            );
        }

        setFilteredQueries(result);
    }, [queries, searchTerm, statusFilter]);

    // Export Function
    const exportToExcel = () => {
        if (!queries || queries.length === 0) {
            toast.error('No queries to export');
            return;
        }

        try {
            const exportData = queries.map(q => {
                // Get last response text safely
                let lastResponse = '-';
                if (Array.isArray(q.responses) && q.responses.length > 0) {
                    lastResponse = q.responses[q.responses.length - 1].text || '-';
                } else if (q.response) {
                    lastResponse = q.response;
                }

                return {
                    'Query ID': q.id,
                    'User ID': q.userId || 'Guest',
                    'Name': q.name || '-',
                    'Email': q.email || '-',
                    'Status': q.status || 'pending',
                    'Message': q.message || '-',
                    'Created At': q.createdAt ? new Date(q.createdAt).toLocaleString('en-IN') : '-',
                    'Last Response': lastResponse,
                    'Response Count': q.responses?.length || (q.response ? 1 : 0)
                };
            });

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Queries');

            const dateStr = new Date().toISOString().split('T')[0];
            const filename = `Zorphix_Queries_${dateStr}.xlsx`;

            XLSX.writeFile(wb, filename);
            toast.success(`Exported ${queries.length} queries`);
        } catch (err) {
            console.error("Export failed:", err);
            toast.error("Export failed");
        }
    };

    const handleReply = async () => {
        if (!replyText.trim() || !selectedQuery) return;

        setIsReplying(true);
        try {
            const queryRef = doc(db, 'queries', selectedQuery.id);
            const newResponse = {
                text: replyText.trim(),
                respondedAt: new Date(),
                respondedBy: 'admin'
            };

            await updateDoc(queryRef, {
                status: 'responded',
                responses: arrayUnion(newResponse),
                lastRespondedAt: serverTimestamp()
            });

            toast.success('Response sent successfully!');
            setSelectedQuery(null);
            setReplyText('');
        } catch (error) {
            console.error('Error sending response:', error);
            toast.error('Failed to send response');
        } finally {
            setIsReplying(false);
        }
    };

    const handleSendEmail = async (queryItem) => {
        const subject = encodeURIComponent('Re: Your Query - Zorphix 2026');
        const body = encodeURIComponent(`Hi,\n\nThank you for reaching out to Zorphix 2026.\n\nRegarding your query: "${queryItem.message}"\n\n[Your response here]\n\nBest regards,\nZorphix Team`);
        window.open(`mailto:${queryItem.email}?subject=${subject}&body=${body}`);

        try {
            const queryRef = doc(db, 'queries', queryItem.id);
            await updateDoc(queryRef, {
                status: 'responded',
                responses: arrayUnion({
                    text: 'Responded via email',
                    respondedAt: new Date(),
                    respondedBy: 'admin'
                }),
                lastRespondedAt: serverTimestamp()
            });
            toast.success('Email client opened');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        try {
            // Ensure date is a valid Date object or timestamp
            const d = date.toDate ? date.toDate() : new Date(date);
            if (isNaN(d.getTime())) return 'Invalid Date';
            return d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return 'N/A';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#e33e33] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black">Query Management</h1>
                    <p className="text-gray-500 text-sm">Manage and respond to user queries</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-[#97b85d] text-white rounded-xl text-sm font-medium hover:bg-[#7a9a4a] transition-colors"
                    >
                        {/* Fallback icon if FaFileExcel is not found */}
                        <FaEnvelope size={12} /> Export Queries
                    </button>
                    <span className="text-sm text-gray-500">
                        {queries.filter(q => q.status === 'pending').length} pending
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by email or message..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e33e33]"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'responded'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${statusFilter === status
                                ? 'bg-[#e33e33] text-white'
                                : 'bg-white/5 text-gray-400 hover:text-white'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Queries List */}
            <div className="space-y-4">
                {filteredQueries.length === 0 ? (
                    <div className="text-center py-16 bg-[#0a0a0a] border border-white/5 rounded-2xl">
                        <FaEnvelope className="text-4xl text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">No queries found</p>
                    </div>
                ) : (
                    filteredQueries.map((q) => (
                        <motion.div
                            key={q.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-2 h-2 rounded-full ${q.status === 'pending' ? 'bg-[#e33e33]' : 'bg-[#97b85d]'}`}></div>
                                        <span className="font-medium">{q.email}</span>
                                        {q.userId && (
                                            <span className="text-xs px-2 py-0.5 bg-[#97b85d]/20 text-[#97b85d] rounded-full flex items-center gap-1">
                                                <FaUser size={10} /> Registered
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-300 mb-3 bg-white/5 p-3 rounded-lg border border-white/5">"{q.message}"</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <FaClock size={10} />
                                            {formatDate(q.createdAt)}
                                        </span>
                                        {q.name && <span>From: {q.name}</span>}
                                    </div>

                                    {/* Discussion Thread */}
                                    <div className="space-y-3 pl-4 border-l-2 border-white/10">
                                        {/* Legacy single response */}
                                        {q.response && (!q.responses || q.responses.length === 0) && (
                                            <div className="relative">
                                                <div className="absolute -left-[21px] top-3 w-4 h-[2px] bg-white/10"></div>
                                                <div className="p-3 bg-[#97b85d]/10 border border-[#97b85d]/20 rounded-xl">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs text-[#97b85d] font-bold uppercase tracking-wider">Admin</span>
                                                        <span className="text-[10px] text-gray-400">{formatDate(q.respondedAt)}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{q.response}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* New Threaded Responses */}
                                        {Array.isArray(q.responses) && q.responses.map((resp, idx) => (
                                            <div key={idx} className="relative">
                                                <div className="absolute -left-[21px] top-3 w-4 h-[2px] bg-white/10"></div>
                                                <div className="p-3 bg-[#97b85d]/10 border border-[#97b85d]/20 rounded-xl">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs text-[#97b85d] font-bold uppercase tracking-wider">{resp.respondedBy || 'Admin'}</span>
                                                        <span className="text-[10px] text-gray-400">
                                                            {resp.respondedAt ? formatDate(resp.respondedAt) : 'Just now'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">{resp.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2">
                                    {q.userId ? (
                                        <button
                                            onClick={() => setSelectedQuery(q)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#e33e33] text-white rounded-xl text-sm font-medium hover:bg-[#c62828] transition-colors"
                                        >
                                            <FaReply size={12} />
                                            {q.status === 'pending' ? 'Reply' : 'Follow Up'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleSendEmail(q)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] text-white rounded-xl text-sm font-medium hover:bg-[#2563eb] transition-colors"
                                        >
                                            <FaEnvelope size={12} />
                                            Send Email
                                        </button>
                                    )}

                                    <span className={`text-xs px-3 py-2 rounded-xl text-center flex items-center justify-center ${q.status === 'pending'
                                        ? 'bg-[#e33e33]/20 text-[#e33e33]'
                                        : 'bg-[#97b85d]/20 text-[#97b85d]'
                                        }`}>
                                        {q.status === 'pending' ? 'Pending' : 'Responded'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Reply Modal */}
            <AnimatePresence>
                {selectedQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedQuery(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Reply to Query</h3>
                                <button
                                    onClick={() => setSelectedQuery(null)}
                                    className="text-gray-500 hover:text-white"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 mb-4">
                                <p className="text-xs text-gray-500 mb-1">From: {selectedQuery.email}</p>
                                <p className="text-gray-300">{selectedQuery.message}</p>
                            </div>

                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your response..."
                                rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#e33e33] resize-none mb-4"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedQuery(null)}
                                    className="flex-1 py-3 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReply}
                                    disabled={!replyText.trim() || isReplying}
                                    className="flex-1 py-3 bg-[#e33e33] text-white rounded-xl font-medium hover:bg-[#c62828] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isReplying ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane size={12} />
                                            Send Response
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminQueries;
