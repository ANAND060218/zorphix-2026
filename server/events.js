// Events data for price lookup (same as frontend but without React icons)
const technicalEvents = [
    { id: 'pixel-reforge', name: 'Pixel Reforge', price: 'FREE' },
    { id: 'promptcraft', name: 'PromptCraft', price: 'FREE' },
    { id: 'algopulse', name: 'AlgoPulse', price: 'FREE' },
    { id: 'reverse-coding', name: 'CodeBack', price: 'FREE' },
    { id: 'sip-to-survive', name: 'Sip to Survive', price: 'FREE' },
    { id: 'codecrypt', name: 'CodeCrypt', price: 'FREE' },
    { id: 'linklogic', name: 'LinkLogic', price: 'FREE' },
    { id: 'pitchfest', name: 'Pitchfest', price: 'FREE' }
];

const paperPresentation = [
    {
        id: 'paper-presentation',
        name: 'Thesis Precised',
        price: '₹120',
        paperUploadLink: 'https://forms.gle/rgHascw4RsaGy9qG9' // Only returned to registered users
    }
];

const workshops = [
    { id: 'fintech-workshop', name: 'FinTech 360°', price: '₹120' },
    { id: 'wealthx-workshop', name: 'WealthX', price: '₹120' }
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

// Get paper upload link (for registered users only)
const getPaperUploadLink = () => {
    const paperEvent = paperPresentation.find(e => e.id === 'paper-presentation');
    return paperEvent ? paperEvent.paperUploadLink : null;
};

module.exports = {
    technicalEvents,
    workshops,
    paperPresentation,
    getAllEvents,
    parsePrice,
    getEventById,
    getEventByName,
    calculateTotalPrice,
    getPaperUploadLink
};
git 