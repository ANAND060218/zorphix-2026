import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const EventModal = ({ isOpen, onClose, event }) => {
    if (!event) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
                    >
                        {/* Header Image/Gradient */}
                        <div className="h-32 bg-gradient-to-r from-[#e33e33] to-[#97b85d] relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md z-10"
                            >
                                <FaTimes />
                            </button>
                            <div className="absolute bottom-4 left-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wider uppercase drop-shadow-lg glitch-text">
                                    {event.title}
                                </h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
                                        <FaCalendarAlt /> Date
                                    </div>
                                    <div className="text-white font-mono text-sm">{event.date}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
                                        <FaMapMarkerAlt /> Venue
                                    </div>
                                    <div className="text-white font-mono text-sm">{event.venue}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
                                        <FaUsers /> Team
                                    </div>
                                    <div className="text-white font-mono text-sm">{event.team}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                    <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
                                        <FaTrophy /> Prize
                                    </div>
                                    <div className="text-white font-mono text-sm text-[#e33e33]">{event.prize}</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[#97b85d] font-bold tracking-widest uppercase mb-2 text-sm">Description</h3>
                                    <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                        {event.desc}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[#e33e33] font-bold tracking-widest uppercase mb-3 text-sm">Event Heads</h3>
                                    <p className="text-gray-300 font-mono text-sm">{event.heads}</p>
                                </div>

                                {event.rounds && (
                                    <div>
                                        <h3 className="text-[#97b85d] font-bold tracking-widest uppercase mb-3 text-sm">Rounds</h3>
                                        <ul className="space-y-2">
                                            {Array.isArray(event.rounds) ? event.rounds.map((round, index) => (
                                                <li key={index} className="flex gap-3 text-sm text-gray-400">
                                                    <span className="text-[#97b85d] font-mono mt-0.5">{`R${index + 1}`}</span>
                                                    <span>{round}</span>
                                                </li>
                                            )) : (
                                                <li className="text-sm text-gray-400">{event.rounds}</li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-[#e33e33] font-bold tracking-widest uppercase mb-3 text-sm">Rules & Guidelines</h3>
                                    <ul className="space-y-2">
                                        {event.rules && event.rules.map((rule, index) => (
                                            <li key={index} className="flex gap-3 text-sm text-gray-400 group hover:text-gray-200 transition-colors">
                                                <span className="text-[#e33e33] font-mono mt-0.5">{`0${index + 1}`}</span>
                                                <span>{rule}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3 backdrop-blur-sm">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg text-sm font-mono uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all"
                            >
                                Close
                            </button>
                            <button className="px-6 py-2 rounded-lg text-sm font-mono uppercase tracking-widest bg-[#e33e33] text-white hover:bg-[#c22e24] shadow-[0_0_15px_rgba(227,62,51,0.3)] hover:shadow-[0_0_25px_rgba(227,62,51,0.5)] transition-all">
                                Register Now
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EventModal;
