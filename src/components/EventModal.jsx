import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaUserFriends, FaClipboardList, FaLightbulb, FaClock, FaGamepad, FaExternalLinkAlt, FaStar, FaGift, FaLock } from 'react-icons/fa';

// Import event images
import pixelReforgeImg from '../assets/events/PIXEL REFORGE.png';
import promptcraftImg from '../assets/events/PROMPTCRAFT.png';
import algopulseImg from '../assets/events/ALGO-PULSE.png';
import codebackImg from '../assets/events/CODEBACK.png';
import sipToSurviveImg from '../assets/events/SIP TO SURVIVE.png';
import codecryptImg from '../assets/events/CODECRYPT.png';
import linkLogicImg from '../assets/events/LINK LOGIC.png';
import pitchfestImg from '../assets/events/PITCHFEST.png';
import thesisPrecisedImg from '../assets/events/THESIS PRECISED.png';
import fintech360Img from '../assets/events/FINTECH 360 .png';
import wealthxImg from '../assets/events/WEALTHX.png';

// Backend API URL
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Map event IDs to their background images
const eventBackgrounds = {
    'pixel-reforge': pixelReforgeImg,
    'promptcraft': promptcraftImg,
    'algopulse': algopulseImg,
    'reverse-coding': codebackImg,
    'sip-to-survive': sipToSurviveImg,
    'codecrypt': codecryptImg,
    'linklogic': linkLogicImg,
    'pitchfest': pitchfestImg,
    'paper-presentation': thesisPrecisedImg,
    'fintech-workshop': fintech360Img,
    'wealthx-workshop': wealthxImg
};

const EventModal = ({ isOpen, onClose, event, isTechnical, isRegistered, isSelected, onAction, userId }) => {
    const [paperUploadLink, setPaperUploadLink] = useState(null);
    const [paperLinkLoading, setPaperLinkLoading] = useState(false);
    const [paperLinkError, setPaperLinkError] = useState(null);

    // Check if this is a workshop
    const isWorkshop = event?.workshopFocusAreas || event?.workshopFormat || event?.activities;

    // Get background image for this event
    const backgroundImage = event ? eventBackgrounds[event.id] : null;

    // Fetch paper upload link when modal opens and user is registered
    useEffect(() => {
        const fetchPaperUploadLink = async () => {
            if (!event?.hasPaperUpload || !isRegistered || !userId) {
                setPaperUploadLink(null);
                return;
            }

            setPaperLinkLoading(true);
            setPaperLinkError(null);

            try {
                const response = await fetch(`${API_URL}/api/get-paper-upload-link`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setPaperUploadLink(data.paperUploadLink);
                } else {
                    setPaperLinkError(data.message || 'Unable to fetch paper upload link');
                }
            } catch (error) {
                console.error('Error fetching paper upload link:', error);
                setPaperLinkError('Failed to fetch paper upload link');
            } finally {
                setPaperLinkLoading(false);
            }
        };

        if (isOpen && event) {
            fetchPaperUploadLink();
        }
    }, [isOpen, event?.hasPaperUpload, isRegistered, userId, event]);

    // Early return AFTER all hooks
    if (!event) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
                    >
                        {/* Header Image/Gradient */}
                        <div className="h-24 bg-gradient-to-r from-[#e33e33] to-[#97b85d] relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md z-10"
                            >
                                <FaTimes />
                            </button>
                            <div className="absolute bottom-3 left-4">
                                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider uppercase drop-shadow-lg glitch-text">
                                    {event.title}
                                </h2>
                            </div>
                        </div>

                        {/* Content with background image */}
                        <div className="max-h-[65vh] overflow-y-auto custom-scrollbar relative">
                            {/* Background Image Overlay - Fixed position within modal */}
                            {backgroundImage && (
                                <div
                                    className="sticky top-0 left-0 right-0 h-[65vh] bg-contain bg-center bg-no-repeat pointer-events-none -mb-[65vh]"
                                    style={{
                                        backgroundImage: `url(${backgroundImage})`,
                                        opacity: 0.35,
                                        backgroundSize: '90% auto'
                                    }}
                                />
                            )}
                            {/* Scrollable content */}
                            <div className="relative z-10 p-6 md:p-8">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
                                            <FaCalendarAlt /> Date
                                        </div>
                                        <div className="text-white font-mono text-sm">5/2/2026</div>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
                                            <FaMapMarkerAlt /> Venue
                                        </div>
                                        <a
                                            href="https://maps.google.com/?q=Chennai+Institute+of+Technology,+Malayambakkam,+Tamil+Nadu+600133"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#97b85d] font-mono text-sm hover:text-white transition-colors"
                                        >
                                            CIT ↗
                                        </a>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
                                            <FaUsers /> Team
                                        </div>
                                        <div className="text-white font-mono text-sm">
                                            {isWorkshop ? 'Individual' : `${event.teamSize || '1-2'} Members`}
                                        </div>
                                        {!isWorkshop && event.teamSize && event.teamSize !== '1' && event.teamSize !== 'Individual' && (
                                            <div className="text-yellow-400/80 text-[8px] font-mono mt-1">*Teams formed onspot</div>
                                        )}
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                                        <div className="text-gray-400 text-xs uppercase mb-1 flex items-center gap-1">
                                            <FaTrophy /> Fee
                                        </div>
                                        <div className="text-white font-mono text-sm text-[#e33e33]">{event.price}</div>
                                    </div>
                                </div>

                                {/* Prizes Section */}
                                {event.prizes && (
                                    <div className="bg-gradient-to-r from-[#e33e33]/10 to-[#97b85d]/10 p-4 rounded-xl border border-white/10 mb-6">
                                        <div className="text-gray-400 text-xs uppercase mb-2 flex items-center gap-2">
                                            <FaTrophy className="text-[#ffa500]" /> Prize Pool
                                        </div>
                                        <div className="text-white font-mono text-sm font-bold tracking-wide">{event.prizes}</div>
                                        <div className="text-[#97b85d] text-xs mt-2">🎁 Goodies & Certificates will be provided</div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* What is this event about? */}
                                    <div>
                                        <h3 className="text-[#97b85d] font-bold tracking-widest uppercase mb-2 text-sm">
                                            {isWorkshop ? 'What is this event about? (in short)' : 'What is this event about?'}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                            {event.whatIsThisEventAbout || event.desc}
                                        </p>
                                    </div>

                                    {/* Event Heads (first 2 members only) */}
                                    {event.heads && (
                                        <div>
                                            <h3 className="text-[#e33e33] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaUserFriends /> Event Heads
                                            </h3>
                                            <p className="text-gray-300 font-mono text-sm">{event.heads}</p>
                                        </div>
                                    )}

                                    {/* Event Focus Areas (for paper presentation and similar events) */}
                                    {event.eventFocusAreas && event.eventFocusAreas.length > 0 && (
                                        <div>
                                            <h3 className="text-[#97b85d] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaLightbulb /> Event Focus Areas
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.eventFocusAreas.map((area, index) => (
                                                    <li key={index} className="flex gap-3 text-sm text-gray-400">
                                                        <span className="text-[#97b85d] font-mono mt-0.5">•</span>
                                                        <span>{area}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Event Format (for paper presentation and similar events) */}
                                    {event.eventFormat && event.eventFormat.length > 0 && (
                                        <div>
                                            <h3 className="text-[#e33e33] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaClock /> Event Format
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.eventFormat.map((step, index) => (
                                                    <li key={index} className="flex gap-3 text-sm text-gray-400">
                                                        <span className="text-[#e33e33] font-mono mt-0.5">{index + 1}.</span>
                                                        <span>{step}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Paper Upload Section */}
                                    {event.hasPaperUpload && (
                                        <div className={`p-4 rounded-xl border ${isRegistered ? 'bg-gradient-to-r from-[#ffa500]/20 to-[#e33e33]/20 border-[#ffa500]/30' : 'bg-gray-900/50 border-gray-700/50'}`}>
                                            <h3 className={`font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2 ${isRegistered ? 'text-[#ffa500]' : 'text-gray-500'}`}>
                                                {isRegistered ? '📌' : <FaLock className="text-gray-500" />} Paper Upload
                                            </h3>

                                            {!isRegistered ? (
                                                // Not registered - Show disabled state
                                                <div>
                                                    <button
                                                        disabled
                                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-400 font-bold rounded-lg cursor-not-allowed text-sm uppercase tracking-wider opacity-60"
                                                    >
                                                        <FaLock /> Register First to Upload Paper
                                                    </button>
                                                    <p className="text-gray-500 text-xs mt-2">
                                                        Complete registration and payment to access the paper upload form.
                                                    </p>
                                                </div>
                                            ) : paperLinkLoading ? (
                                                // Loading state
                                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-300 font-bold rounded-lg text-sm uppercase tracking-wider">
                                                    <span className="animate-spin">⏳</span> Loading...
                                                </div>
                                            ) : paperUploadLink ? (
                                                // Registered and link available
                                                <a
                                                    href={paperUploadLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ffa500] to-[#e33e33] text-white font-bold rounded-lg hover:from-[#e33e33] hover:to-[#ffa500] transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,165,0,0.4)] text-sm uppercase tracking-wider"
                                                >
                                                    <FaExternalLinkAlt /> Upload Paper via Google Form
                                                </a>
                                            ) : (
                                                // Error or link not available
                                                <div>
                                                    <p className="text-yellow-400 text-sm">
                                                        {paperLinkError || 'Paper upload link will be available after successful registration.'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Judging Criteria */}
                                    {event.judgingCriteria && event.judgingCriteria.length > 0 && (
                                        <div>
                                            <h3 className="text-[#97b85d] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaStar /> Judging Criteria
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.judgingCriteria.map((criteria, index) => (
                                                    <li key={index} className="flex gap-3 text-sm text-gray-400">
                                                        <span className="text-[#97b85d] font-mono mt-0.5">•</span>
                                                        <span>{criteria}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Perks of the Event */}
                                    {event.perks && event.perks.length > 0 && (
                                        <div>
                                            <h3 className="text-[#e33e33] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaGift /> Perks of the Event
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.perks.map((perk, index) => (
                                                    <li key={index} className="flex gap-3 text-sm text-gray-400">
                                                        <span className="text-[#e33e33] font-mono mt-0.5">•</span>
                                                        <span>{perk}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Workshop Focus Areas */}
                                    {event.workshopFocusAreas && event.workshopFocusAreas.length > 0 && (
                                        <div>
                                            <h3 className="text-[#97b85d] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaLightbulb /> Workshop Focus Areas
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.workshopFocusAreas.map((area, index) => (
                                                    <li key={index} className="flex gap-3 text-sm text-gray-400">
                                                        <span className="text-[#97b85d] font-mono mt-0.5">•</span>
                                                        <span>{area}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Workshop Format */}
                                    {event.workshopFormat && (
                                        <div>
                                            <h3 className="text-[#e33e33] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaClock /> Workshop Format
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-400">
                                                <p><span className="text-[#e33e33] font-mono">1.</span> Duration: {event.workshopFormat.duration}</p>
                                                <p><span className="text-[#e33e33] font-mono">2.</span> Mode: {event.workshopFormat.mode}</p>
                                                <p><span className="text-[#e33e33] font-mono">3.</span> Participation: {event.workshopFormat.participation}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Activities */}
                                    {event.activities && event.activities.length > 0 && (
                                        <div>
                                            <h3 className="text-[#97b85d] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaGamepad /> Activities
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.activities.map((activity, index) => (
                                                    <li key={index} className="flex gap-3 text-sm text-gray-400">
                                                        <span className="text-[#97b85d] font-mono mt-0.5">•</span>
                                                        <span>{activity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Rounds (for events only) */}
                                    {event.rounds && !isWorkshop && (
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

                                    {/* Rules */}
                                    {event.rules && event.rules.length > 0 && (
                                        <div>
                                            <h3 className="text-[#e33e33] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaClipboardList /> Rules
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.rules.map((rule, index) => (
                                                    <li key={index} className="flex gap-3 text-sm text-gray-400 group hover:text-gray-200 transition-colors">
                                                        <span className="text-[#e33e33] font-mono mt-0.5">{String(index + 1).padStart(2, '0')}</span>
                                                        <span>{rule}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Instructions */}
                                    {event.instructions && event.instructions.length > 0 && (
                                        <div>
                                            <h3 className="text-[#97b85d] font-bold tracking-widest uppercase mb-3 text-sm flex items-center gap-2">
                                                <FaClipboardList /> Instructions
                                            </h3>
                                            <ul className="space-y-2">
                                                {event.instructions.map((instruction, index) => (
                                                    <li key={index} className="flex gap-3 text-sm text-gray-400 group hover:text-gray-200 transition-colors">
                                                        <span className="text-[#97b85d] font-mono mt-0.5">•</span>
                                                        <span>{instruction}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
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
                            <button
                                onClick={onAction}
                                disabled={isRegistered}
                                className={`px-6 py-2 rounded-lg text-sm font-mono uppercase tracking-widest transition-all ${isRegistered
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                    : 'bg-[#e33e33] text-white hover:bg-[#c22e24] shadow-[0_0_15px_rgba(227,62,51,0.3)] hover:shadow-[0_0_25px_rgba(227,62,51,0.5)]'
                                    }`}>
                                {isRegistered
                                    ? 'REGISTERED'
                                    : isTechnical
                                        ? 'REGISTER NOW'
                                        : isSelected ? 'ADDED' : 'ADD TO CART'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EventModal;
