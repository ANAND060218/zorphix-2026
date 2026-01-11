import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaCode,
    FaTerminal,
    FaLaptopCode,
    FaUndo,
    FaCoffee,
    FaPuzzlePiece,
    FaProjectDiagram,
    FaLink,
    FaBolt,
    FaWrench,
    FaScroll,
    FaShoppingCart,
    FaWallet,
    FaCheckCircle
} from 'react-icons/fa';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

import EventModal from './EventModal';
import toast from 'react-hot-toast';
import { technicalEvents, workshops, paperPresentation } from '../data/events';

const EventsPage = () => {
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [activeTab, setActiveTab] = useState('events');
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [selectedEventsList, setSelectedEventsList] = useState(() => {
        try {
            const stored = localStorage.getItem('selectedEvents');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [registeredEventsList, setRegisteredEventsList] = useState([]);


    useEffect(() => {
        // Listen for auth state changes to sync with DB if registered
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, 'registrations', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();

                        // Check profile completion
                        if (data.profileCompleted || (data.college && data.phone)) {
                            setIsProfileComplete(true);
                        } else {
                            setIsProfileComplete(false);
                        }

                        if (data.events && Array.isArray(data.events)) {
                            // Database has Mixed Case (e.g. "Pixel Reforge"), mapped to title for local logic
                            const dbEvents = data.events;

                            // Update state
                            setRegisteredEventsList(dbEvents);

                            // REMOVED: Merge DB events with existing local selection to ensure nothing is lost
                            // We now strictly separate Cart (local) vs Registered (DB)
                        }
                    }
                } catch (error) {
                    console.error("Error syncing events from DB:", error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleRegisterEvent = async (event) => {
        if (!auth.currentUser) {
            toast.error("Please login to register for events!");
            setTimeout(() => navigate('/profile'), 2000);
            return;
        }

        if (!isProfileComplete) {
            toast.error('Please complete your profile to access registration functions.');
            setTimeout(() => navigate('/profile'), 2000);
            return;
        }


        setProcessingId(event.id);
        try {
            const userRef = doc(db, 'registrations', auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    events: [event.name],
                    email: auth.currentUser.email,
                    userId: auth.currentUser.uid
                });
            } else {
                await updateDoc(userRef, {
                    events: arrayUnion(event.name)
                });
            }

            // Update local state immediately
            setRegisteredEventsList(prev => [...prev, event.name]);
            toast.success(`Successfully registered for ${event.name}!`);

        } catch (error) {
            console.error("Error registering for event:", error);
            toast.error(`Failed to register for ${event.name}. Please try again.`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleAddeEvent = (event) => {
        if (!auth.currentUser) {
            toast.error("Please login to add events!");
            setTimeout(() => navigate('/profile'), 2000);
            return;
        }

        if (!isProfileComplete) {
            toast.error("Please complete your profile to access registration functions.");
            setTimeout(() => navigate('/profile'), 2000);
            return;
        }
        // Prevent removing/toggling if already registered
        if (registeredEventsList.includes(event.name)) return;

        let updatedList;
        if (selectedEventsList.includes(event.name)) {
            // Remove
            updatedList = selectedEventsList.filter(title => title !== event.name);
            toast.success(`Successfully removed ${event.name} from cart!`);
        } else {
            // Add
            updatedList = [...selectedEventsList, event.name];
            toast.success(`Successfully added ${event.name} to cart!`);
        }
        setSelectedEventsList(updatedList);
        localStorage.setItem('selectedEvents', JSON.stringify(updatedList));
    };

    const handlePayment = async () => {
        if (!auth.currentUser) {
            toast.error("Please login to pay!");
            return;
        }

        if (!isProfileComplete) {
            toast.error("Please complete your profile before payment!");
            navigate('/profile');
            return;
        }

        const amountToPay = calculateTotals().amountToPay;
        if (amountToPay === 0) {
            toast.error("No pending payment found!");
            return;
        }

        const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];
        const eventsToRegister = allEvents
            .filter(e => selectedEventsList.includes(e.name) && !registeredEventsList.includes(e.name))
            .map(e => e.name);

        if (eventsToRegister.length === 0) {
            toast.error("No new events to register.");
            return;
        }

        const toastId = toast.loading("Processing Payment...");
        setProcessingId('PAYMENT'); // Start loading

        try {
            const userRef = doc(db, 'registrations', auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    events: eventsToRegister,
                    email: auth.currentUser.email,
                    userId: auth.currentUser.uid,
                    // Initialize other fields possibly
                });
            } else {
                await updateDoc(userRef, {
                    events: arrayUnion(...eventsToRegister)
                });
            }

            // Update local state
            setRegisteredEventsList(prev => [...prev, ...eventsToRegister]);
            setSelectedEventsList([]); // Clear cart
            localStorage.setItem('selectedEvents', JSON.stringify([]));

            toast.success("Payment Successful! Events Registered.", { id: toastId });
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Payment failed. Please try again.", { id: toastId });
        } finally {
            setProcessingId(null); // Stop loading
        }
    };



    const getCartEvents = () => {
        const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];
        return allEvents.filter(event =>
            selectedEventsList.includes(event.name) && !registeredEventsList.includes(event.name)
        );
    };

    const getRegisteredEvents = () => {
        const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];
        return allEvents.filter(event => registeredEventsList.includes(event.name));
    };

    const parsePrice = (priceStr) => {
        if (!priceStr || priceStr === 'FREE') return 0;
        return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    };

    const calculateTotals = () => {
        const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];

        // Filter selected events to EXCLUDE those already registered
        // This prevents double counting in "Amount to Pay" if logic fails to clear local storage
        const selectedEvents = allEvents.filter(e =>
            selectedEventsList.includes(e.name) && !registeredEventsList.includes(e.name)
        );

        const registeredEvents = allEvents.filter(e => registeredEventsList.includes(e.name));

        // Use name sets to avoid duplicates
        const uniqueNames = new Set([...selectedEventsList, ...registeredEventsList]);

        const totalEvents = uniqueNames.size;

        const alreadyPaidValue = registeredEvents.reduce((acc, curr) => acc + parsePrice(curr.price), 0);
        const amountToPayValue = selectedEvents.reduce((acc, curr) => acc + parsePrice(curr.price), 0);
        const totalValue = alreadyPaidValue + amountToPayValue;

        return {
            totalEvents,
            totalValue,
            alreadyPaid: alreadyPaidValue,
            amountToPay: amountToPayValue
        };
    };

    const renderEventCard = (event, index) => (
        <motion.div
            key={event.id}
            layout
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative"
        >
            {/* Card Background - Massive Realistic Metal Card */}
            <div className={`relative w-full min-h-[220px] md:min-h-0 aspect-[1.58/1] bg-gradient-to-br from-[#1c1c1c] via-[#0d0d0d] to-[#000] rounded-2xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-500 transform group-hover:scale-[1.05] group-hover:-translate-y-2 ${registeredEventsList.includes(event.name)
                ? 'border-2 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)] grayscale-[0.3]'
                : selectedEventsList.includes(event.name)
                    ? 'border-2 border-[#97b85d] shadow-[0_0_30px_rgba(151,184,93,0.3)]'
                    : 'border border-white/5 group-hover:shadow-[0_20px_50px_rgba(227,62,51,0.15)]'
                }`}>

                {/* Registered Watermark */}
                {registeredEventsList.includes(event.name) && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none rotate-[-30deg]">
                        <span className="text-6xl md:text-8xl font-black text-blue-500/10 tracking-widest border-4 border-blue-500/10 px-8 py-2 rounded-xl">
                            REGISTERED
                        </span>
                    </div>
                )}

                {/* Brushed Metal Texture */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"></div>

                {/* Holographic Sheen */}
                <div className="absolute -inset-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[25deg] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out pointer-events-none blur-sm"></div>

                {/* Card Content */}
                <div className="p-5 md:p-7 flex-1 flex flex-col justify-between relative z-10 h-full">

                    {/* Top Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner border border-white/10 ${registeredEventsList.includes(event.name)
                                ? 'bg-gradient-to-br from-blue-600 to-blue-900'
                                : selectedEventsList.includes(event.name)
                                    ? 'bg-gradient-to-br from-[#97b85d] to-[#4a5c2d]'
                                    : 'bg-gradient-to-br from-[#e33e33] to-[#800000]'
                                }`}>
                                <event.icon className="text-white text-xs" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-[0.25em] text-gray-300 uppercase font-mono text-shadow-sm leading-none">ZORPHIX BANK</span>
                                <span className={`text-[6px] tracking-[0.2em] uppercase font-mono mt-1 ${registeredEventsList.includes(event.name)
                                    ? 'text-blue-400'
                                    : selectedEventsList.includes(event.name)
                                        ? 'text-[#97b85d]'
                                        : 'text-[#e33e33]'
                                    }`}>
                                    {registeredEventsList.includes(event.name) ? 'REGISTERED MEMBER' : 'WORLD ELITE'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[8px] font-mono text-white/40 tracking-widest border border-white/20 px-1 rounded">DEBIT</span>
                            {/* Contactless Icon */}
                            <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14v6l5 3-1 1.7-6-3.7V6h2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Chip & Event Title */}
                    <div className="mt-2">
                        <div className="flex justify-between items-end mb-4">
                            <div className="w-12 h-9 bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#C49303] rounded-md border border-[#FDB931] shadow-md relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/40"></div>
                                <div className="absolute top-0 left-1/2 h-full w-[1px] bg-black/40"></div>
                                <div className="absolute top-1/2 left-1/2 w-4 h-3 border border-black/40 rounded-[2px] -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                            <div className="text-[8px] text-white/30 font-mono tracking-widest">
                                AUTHORIZED SIGNATURE
                            </div>
                        </div>

                        <h3 className="text-xl md:text-2xl lg:text-3xl font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400 tracking-[0.15em] uppercase truncate drop-shadow-[2px_4px_6px_rgba(0,0,0,0.8)] filter shadow-inner font-bold" style={{ textShadow: '-1px -1px 0 rgba(255,255,255,0.1), 2px 2px 4px rgba(0,0,0,0.8)' }}>
                            {event.name}
                        </h3>

                        <div className="flex gap-4 mt-2 mb-4">
                            <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">4520</span>
                            <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">****</span>
                            <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">****</span>
                            <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-widest">8892</span>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex items-center gap-6">
                                <div>
                                    <span className="block text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">MEMBER SINCE</span>
                                    <span className="text-xs md:text-sm text-white font-mono tracking-wider">2024</span>
                                </div>
                                <div>
                                    <span className="block text-[8px] text-gray-400 uppercase tracking-widest mb-0.5">VALID THRU</span>
                                    <span className="text-xs md:text-sm text-white font-mono tracking-wider">03/26</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-[5px] md:text-[6px] text-gray-400 uppercase tracking-widest mb-0.5">PRICE</span>
                                <span className="text-xl md:text-3xl font-black text-white tracking-tight drop-shadow-md block leading-none">{event.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="flex justify-between items-end border-t border-white/5 pt-2 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-white/10 rounded-sm flex items-center justify-center border border-white/5">
                                <span className="text-[6px] text-white/50 font-bold">VIP</span>
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-300 font-mono uppercase tracking-wider">{event.subtitle}</div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                            <div className="text-white/30 font-bold italic text-lg md:text-xl tracking-tighter">VISA</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Actions Below Card */}
            <div className="mt-4 flex gap-3">
                <button
                    onClick={() => setSelectedEvent(event)}
                    className="flex-1 py-3 bg-[#1a1a1a] rounded-lg border border-[#e33e33] text-[#e33e33] font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#e33e33] hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(227,62,51,0.2)] hover:shadow-[0_0_20px_rgba(227,62,51,0.6)]"
                >
                    Know More
                </button>
                <button
                    onClick={() => {
                        // Check if it's a technical event
                        const isTechnical = technicalEvents.some(e => e.id === event.id);
                        if (isTechnical) {
                            // Technical events: direct register
                            handleRegisterEvent(event);
                        } else {
                            // Workshops/Paper: add to cart toggle
                            handleAddeEvent(event);
                        }
                    }}
                    disabled={registeredEventsList.includes(event.name) || processingId === event.id}
                    className={`flex-1 py-3 rounded-lg border font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 ${registeredEventsList.includes(event.name)
                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600 text-gray-400 shadow-none cursor-not-allowed opacity-80'
                        : technicalEvents.some(e => e.id === event.id)
                            ? 'bg-[#95b55c] border-[#95b55c] text-black hover:bg-[#84a34d] shadow-[0_0_10px_rgba(149,181,92,0.2)] hover:shadow-[0_0_20px_rgba(149,181,92,0.6)]'
                            : selectedEventsList.includes(event.name)
                                ? 'bg-[#1a1a1a] border-[#e33e33] text-[#e33e33] hover:bg-[#e33e33] hover:text-white shadow-[0_0_10px_rgba(227,62,51,0.2)] hover:shadow-[0_0_20px_rgba(227,62,51,0.6)]'
                                : 'bg-[#1a1a1a] border-[#97b85d] text-[#97b85d] hover:bg-[#97b85d] hover:text-black shadow-[0_0_10px_rgba(151,184,93,0.2)] hover:shadow-[0_0_20px_rgba(151,184,93,0.6)]'
                        }`}>
                    {processingId === event.id ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>PROCESSING...</span>
                        </div>
                    ) : (
                        registeredEventsList.includes(event.name)
                            ? 'REGISTERED'
                            : technicalEvents.some(e => e.id === event.id)
                                ? 'REGISTER'
                                : selectedEventsList.includes(event.name) ? 'REMOVE' : 'ADD'
                    )}
                </button>
            </div>
        </motion.div>
    );

    // Calculate cart count
    const getCartCount = () => {
        const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];
        return allEvents.filter(event =>
            selectedEventsList.includes(event.name) || registeredEventsList.includes(event.name)
        ).length;
    };

    return (
        <div className="min-h-screen text-white font-mono relative overflow-x-hidden">


            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

            <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter sm:tracking-widest mb-4 glitch-text" data-text="EVENTS">
                        EVENTS
                    </h1>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#e33e33] via-[#97b85d] to-[#e33e33]"></div>
                    <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                        Explore our lineup of cutting-edge technical challenges designed to test your skills at Zorphix '26
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="w-full mb-16 overflow-x-auto pb-4 md:overflow-visible custom-red-scrollbar">
                    <div className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-4 px-4 md:px-0 min-w-max mx-auto md:w-full">
                        {[
                            { id: 'events', label: 'EVENTS', icon: FaBolt },
                            { id: 'workshops', label: 'WORKSHOPS', icon: FaWrench }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group relative px-6 md:px-8 py-3 md:py-4 transition-all duration-300 transform hover:-translate-y-1 ${activeTab === tab.id
                                    ? 'bg-[#e33e33] text-black clip-path-cyberpunk'
                                    : 'bg-transparent text-gray-400 border border-white/20 hover:border-[#e33e33] hover:text-white clip-path-cyberpunk-outline'
                                    }`}
                                style={{
                                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)',
                                    minWidth: '160px'
                                }}
                            >
                                <div className="flex items-center justify-center gap-3 font-mono font-black tracking-widest text-sm md:text-base">
                                    <tab.icon className={`text-lg ${activeTab === tab.id ? 'text-black' : 'text-gray-500 group-hover:text-[#e33e33]'}`} />
                                    <span>{tab.label}</span>
                                    {tab.id === 'my-cart' && getCartCount() > 0 && (
                                        <span className={`ml-2 px-2 py-0.5 text-[10px] rounded-full font-bold ${activeTab === 'my-cart'
                                            ? 'bg-black text-[#e33e33]'
                                            : 'bg-[#e33e33] text-white'
                                            }`}>
                                            {getCartCount()}
                                        </span>
                                    )}
                                </div>

                                {/* Decorative corner lines for active state */}
                                {activeTab === tab.id && (
                                    <>
                                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-black opacity-30"></div>
                                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-black opacity-30"></div>
                                    </>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Events Grid */}
                <div className="min-h-[50vh]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'events' && (
                            <motion.div
                                key="events-grid"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                {technicalEvents.map((event, index) => renderEventCard(event, index))}
                            </motion.div>
                        )}

                        {activeTab === 'workshops' && (
                            <motion.div
                                key="workshops-container"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-24"
                            >
                                {/* Workshops Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#e33e33] to-[#97b85d] shadow-lg">
                                            <FaWrench className="text-2xl text-white" />
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-widest">WORKSHOPS</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {workshops.map((event, index) => renderEventCard(event, index))}
                                    </div>
                                </section>

                                {/* Paper Presentation Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#ffa500] to-[#ffd700] shadow-lg">
                                            <FaScroll className="text-2xl text-black" />
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-widest">PAPER PRESENTATION</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {paperPresentation.map((event, index) => renderEventCard(event, index))}
                                    </div>
                                </section>

                                {/* Registered Events Section */}
                                {getRegisteredEvents().length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 shadow-lg">
                                                <FaCheckCircle className="text-2xl text-white" />
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-widest">REGISTERED EVENTS</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {getRegisteredEvents().map((event, index) => renderEventCard(event, index))}
                                        </div>
                                    </section>
                                )}


                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scrolling decorative text */}
            <div className="fixed -right-20 top-1/2 -translate-y-1/2 rotate-90 opacity-10 pointer-events-none hidden lg:block">
                <span className="text-9xl font-bold text-transparent stroke-text-white tracking-widest">
                    SYMPOSIUM '26
                </span>
            </div>

            <style jsx>{`
                .stroke-text-white {
                    -webkit-text-stroke: 2px rgba(255,255,255,0.2);
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                    height: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e33e33;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #97b85d;
                }
            `}</style>

            <EventModal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                event={selectedEvent}
                isTechnical={selectedEvent && technicalEvents.some(e => e.id === selectedEvent.id)}
                isRegistered={selectedEvent && registeredEventsList.includes(selectedEvent.name)}
                isSelected={selectedEvent && selectedEventsList.includes(selectedEvent.name)}
                onAction={() => {
                    if (selectedEvent) {
                        const isTechnical = technicalEvents.some(e => e.id === selectedEvent.id);
                        if (isTechnical) {
                            handleRegisterEvent(selectedEvent);
                        } else {
                            handleAddeEvent(selectedEvent);
                        }
                        setSelectedEvent(null);
                    }
                }}
            />
        </div>
    );
};

export default EventsPage;
