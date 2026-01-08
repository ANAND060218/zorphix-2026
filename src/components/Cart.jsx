import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaShoppingCart,
    FaWallet,
    FaTrash
} from 'react-icons/fa';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { technicalEvents, workshops, paperPresentation } from '../data/events';
import EventModal from './EventModal';

const Cart = () => {
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [processingId, setProcessingId] = useState(null);
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, 'registrations', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.profileCompleted || (data.college && data.phone)) {
                            setIsProfileComplete(true);
                        }
                        if (data.events && Array.isArray(data.events)) {
                            setRegisteredEventsList(data.events);
                        }
                    }
                } catch (error) {
                    console.error("Error syncing events from DB:", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const handleAddeEvent = (event) => {
        // Since we are in Cart, this action acts as REMOVE
        const updatedList = selectedEventsList.filter(title => title !== event.name);
        setSelectedEventsList(updatedList);
        localStorage.setItem('selectedEvents', JSON.stringify(updatedList));
        toast.success("Removed from cart");
    };

    const parsePrice = (priceStr) => {
        if (!priceStr || priceStr === 'FREE') return 0;
        return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    };

    const calculateTotals = () => {
        const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];

        // Filter out registered events from cart calculation to avoid double counting
        const selectedEvents = allEvents.filter(e =>
            selectedEventsList.includes(e.name) && !registeredEventsList.includes(e.name)
        );
        const registered = allEvents.filter(e => registeredEventsList.includes(e.name));

        const totalEvents = selectedEvents.length + registered.length;
        const alreadyPaidValue = registered.reduce((acc, curr) => acc + parsePrice(curr.price), 0);
        const amountToPayValue = selectedEvents.reduce((acc, curr) => acc + parsePrice(curr.price), 0);
        const totalValue = alreadyPaidValue + amountToPayValue;

        return { totalEvents, totalValue, alreadyPaid: alreadyPaidValue, amountToPay: amountToPayValue };
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

        const toastId = toast.loading("Processing Payment...");
        setProcessingId('PAYMENT');

        try {
            const userRef = doc(db, 'registrations', auth.currentUser.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    events: eventsToRegister,
                    email: auth.currentUser.email,
                    userId: auth.currentUser.uid,
                });
            } else {
                await updateDoc(userRef, {
                    events: arrayUnion(...eventsToRegister)
                });
            }

            setRegisteredEventsList(prev => [...prev, ...eventsToRegister]);
            setSelectedEventsList([]);
            localStorage.setItem('selectedEvents', JSON.stringify([]));

            toast.success("Payment Successful! Events Registered.", { id: toastId });
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Payment failed. Please try again.", { id: toastId });
        } finally {
            setProcessingId(null);
        }
    };

    const getCartEvents = () => {
        const allEvents = [...technicalEvents, ...workshops, ...paperPresentation];
        return allEvents.filter(event =>
            selectedEventsList.includes(event.name) && !registeredEventsList.includes(event.name)
        );
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
                : 'border-2 border-[#97b85d] shadow-[0_0_30px_rgba(151,184,93,0.3)]'
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
                                : 'bg-gradient-to-br from-[#97b85d] to-[#4a5c2d]'
                                }`}>
                                <event.icon className="text-white text-xs" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold tracking-[0.25em] text-gray-300 uppercase font-mono text-shadow-sm leading-none">ZORPHIX BANK</span>
                                <span className={`text-[6px] tracking-[0.2em] uppercase font-mono mt-1 ${registeredEventsList.includes(event.name)
                                    ? 'text-blue-400'
                                    : 'text-[#97b85d]'
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
                                <path d="M4.93 4.93c-1.2 1.2-1.93 2.76-1.93 4.57s.73 3.37 1.93 4.57l1.41-1.41c-.82-.82-1.34-1.95-1.34-3.16s.52-2.34 1.34-3.16L4.93 4.93zM8.46 8.46c-.43.43-.69.99-.69 1.62s.26 1.19.69 1.62l1.41-1.41c-.06-.06-.1-.13-.1-.21s.04-.15.1-.21L8.46 8.46zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 1.79 4 4-1.79 4-4 4z" />
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
                    onClick={() => handleAddeEvent(event)}
                    disabled={registeredEventsList.includes(event.name) || processingId === event.id}
                    className={`flex-1 py-3 rounded-lg border font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 ${registeredEventsList.includes(event.name)
                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600 text-gray-400 shadow-none cursor-not-allowed opacity-80'
                        : selectedEventsList.includes(event.name) || true // Always styling as ADDED for cart items
                            ? 'bg-[#97b85d] text-black border-[#97b85d] shadow-[0_0_10px_rgba(151,184,93,0.2)]'
                            : ''
                        }`}
                >
                    {registeredEventsList.includes(event.name) ? 'REGISTERED' : 'ADDED'}
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen text-white font-mono relative overflow-x-hidden">
            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>

            <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-white/10 border border-white/20 shadow-lg">
                            <FaShoppingCart className="text-3xl text-white" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-widest uppercase">My Cart</h1>
                    </div>
                    <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#e33e33] via-[#97b85d] to-[#e33e33]"></div>
                </motion.div>

                <div className="space-y-24">
                    {/* Cart Items List */}
                    <section>
                        {getCartEvents().length === 0 ? (
                            <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
                                <FaShoppingCart className="text-6xl text-white/20 mx-auto mb-6" />
                                <h2 className="text-xl font-bold text-gray-400">Your cart is empty</h2>
                                <button onClick={() => navigate('/events')} className="mt-6 px-6 py-3 bg-[#e33e33] text-white font-bold rounded hover:bg-white hover:text-black transition-all">
                                    Browse Events
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <AnimatePresence mode="popLayout">
                                    {getCartEvents().map((event, index) => renderEventCard(event, index))}
                                </AnimatePresence>
                            </div>
                        )}
                    </section>

                    <section className="flex justify-center pb-20">
                        <div className="w-full max-w-md bg-[#e6e6e6] text-[#1a1a1a] rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden font-mono p-6 md:p-8">
                            {/* Zigzag Top */}
                            <div className="absolute top-0 left-0 w-full h-4 bg-[#0d0d0d]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 0)', display: 'none' }}></div> {/* Simple fallback or no zigzag for cleaner look, sticking to 'torn' top via css later if needed. For now, flat nicely rounded receipt is safer. */}

                            {/* Receipt Header */}
                            <div className="text-center border-b-2 border-dashed border-[#1a1a1a]/20 pb-6 mb-6">
                                <h2 className="text-2xl font-black tracking-widest uppercase mb-2">ZORPHIX BANK</h2>
                                <p className="text-xs tracking-widest uppercase opacity-60">Transaction Receipt</p>
                                <div className="flex justify-center items-center gap-4 mt-4 text-[10px] uppercase tracking-wider opacity-60">
                                    <span>{new Date().toLocaleDateString()}</span>
                                    <span>{new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>

                            {/* Receipt Items */}
                            <div className="space-y-4 mb-6 text-sm">
                                <div className="flex justify-between items-center group">
                                    <span className="uppercase tracking-widest opacity-70 text-lg">Total Events</span>
                                    <span className="font-bold text-lg">{calculateTotals().totalEvents}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="uppercase tracking-widest opacity-70 text-lg">Subtotal</span>
                                    <span className="font-bold text-lg">₹{calculateTotals().totalValue}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#e33e33]">
                                    <span className="uppercase tracking-widest font-bold text-lg">Paid</span>
                                    <span className="font-bold text-lg">- ₹{calculateTotals().alreadyPaid}</span>
                                </div>
                            </div>

                            {/* Divider line using '=' characters for ASCII receipt feel */}
                            <div className="text-center opacity-20 tracking-[1em] overflow-hidden whitespace-nowrap mb-6">
                                ================================
                            </div>

                            {/* Total Amount */}
                            <div className="flex justify-between items-end mb-8">
                                <span className="uppercase tracking-widest font-bold text-lg">Total</span>
                                <span className="text-4xl font-black tracking-tighter">₹{calculateTotals().amountToPay}</span>
                            </div>

                            {/* Payment Button */}
                            <button
                                onClick={handlePayment}
                                disabled={processingId === 'PAYMENT'}
                                className="w-full py-4 bg-[#1a1a1a] text-white font-black tracking-[0.2em] uppercase rounded hover:bg-[#e33e33] transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
                            >
                                {processingId === 'PAYMENT' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>PROCESSING</span>
                                    </>
                                ) : 'CONFIRM PAYMENT'}
                            </button>

                            {/* Barcode */}
                            <div className="text-center opacity-60">
                                <div className="h-12 bg-[repeating-linear-gradient(to_right,#000,#000_1px,transparent_1px,transparent_3px)] w-[80%] mx-auto mb-2 opacity-80"></div>
                                <p className="text-[10px] tracking-[0.5em] uppercase">THANK YOU</p>
                            </div>

                            {/* Decorative Torn Edge Effect (Bottom) */}
                            <div className="absolute bottom-[-10px] left-0 w-full h-4 bg-[#050505]" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
                            <div className="absolute top-[-10px] left-0 w-full h-4 bg-[#050505] rotate-180" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
                        </div>
                    </section>
                </div>

                <EventModal
                    isOpen={!!selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    event={selectedEvent}
                    onRegister={() => { }}
                    isRegistered={selectedEvent && registeredEventsList.includes(selectedEvent.name)}
                />
            </div>
        </div>
    );
};

export default Cart;
