// Events data for price lookup (same as frontend but without React icons)
const technicalEvents = [
    { id: 'pixel-reforge', name: 'Pixel Reforge', price: 'FREE' },
    { id: 'promptcraft', name: 'PromptCraft', price: 'FREE' },
    { id: 'algopulse', name: 'AlgoPulse', price: 'FREE' },
    { id: 'codeback', name: 'CodeBack', price: 'FREE' },
    { id: 'sip-to-survive', name: 'Sip to Survive', price: 'FREE' },
    { id: 'codecrypt', name: 'CodeCrypt', price: 'FREE' },
    { id: 'linklogic', name: 'LinkLogic', price: 'FREE' }
];

const paperPresentation = [
    { id: 'paper-presentation', name: 'Paper Presentation', price: '₹149' }
];

const workshops = [
    { id: 'ai-workshop', name: 'AI Workshop', price: '₹1' },
    { id: 'cloud-workshop', name: 'Cloud Workshop', price: '₹1' },
    { id: 'ethical-hacking', name: 'Ethical Hacking', price: '₹1' },
    { id: 'app-dev', name: 'App Dev', price: '₹1' },
    { id: 'blockchain', name: 'Blockchain', price: '₹1' }
];

// Get all events
const getAllEvents = () => [...technicalEvents, ...workshops, ...paperPresentation];

// Parse price string to number (in INR)
const parsePrice = (priceStr) => {
    if (!priceStr || priceStr === 'FREE') return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
};

// Get event by ID
const getEventById = (eventId) => {
    return getAllEvents().find(e => e.id === eventId);
};

// Get event by name
const getEventByName = (eventName) => {
    return getAllEvents().find(e => e.name === eventName);
};

// Calculate total price for given event names
const calculateTotalPrice = (eventNames) => {
    let total = 0;
    for (const name of eventNames) {
        const event = getEventByName(name);
        if (event) {
            total += parsePrice(event.price);
        }
    }
    return total;
};

module.exports = {
    technicalEvents,
    workshops,
    paperPresentation,
    getAllEvents,
    parsePrice,
    getEventById,
    getEventByName,
    calculateTotalPrice
};
