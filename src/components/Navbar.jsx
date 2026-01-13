import { useState } from 'react';
import { Link } from 'react-router-dom';
import zorphixLogo from '../assets/zorphix-logo.png';
import citLogo from '../assets/cit_logo.png';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Events', href: '/events' },
        { name: 'Cart', href: '/cart' },
        { name: 'Profile', href: '/profile' }
    ];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const stockTickerItems = [
        { symbol: "CSBS", value: "+24.5%", up: true },
        { symbol: "TECH", value: "+12.8%", up: true },
        { symbol: "INNO", value: "+8.4%", up: true },
        { symbol: "CODE", value: "-2.1%", up: false },
        { symbol: "DATA", value: "+15.3%", up: true },
        { symbol: "ALGO", value: "+32.7%", up: true },
        { symbol: "NETW", value: "-0.5%", up: false },
        { symbol: "SYMP", value: "+100%", up: true },
        { symbol: "FUTR", value: "+45.2%", up: true },
        { symbol: "AI", value: "+67.9%", up: true },
    ];

    // Generate a long string for the tunnel walls
    const tickerString = stockTickerItems.map(item => `${item.symbol} ${item.value}`).join(' • ').repeat(10);

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <img src={citLogo} alt="Zorphix Logo" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_10px_rgba(227,62,51,0.5)]" />
                        </div>
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img src={zorphixLogo} alt="Zorphix Logo" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_10px_rgba(227,62,51,0.5)]" />
                            <span className="text-white font-bold text-xl tracking-wider">ZORPHIX</span>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                link.name === 'Profile' ? (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className="px-6 py-2 bg-gradient-to-r from-[#e33e33] to-[#97b85d] text-white font-mono uppercase text-sm font-bold tracking-wider rounded-lg hover:shadow-[0_0_15px_rgba(227,62,51,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                                    >
                                        {link.name}
                                    </Link>
                                ) : (
                                    <Link
                                        key={link.name}
                                        to={link.href.replace('#', '/').replace('//', '/')}
                                        className="text-gray-300 hover:text-white transition-colors duration-300 font-mono uppercase text-sm tracking-wider relative group"
                                    >
                                        {link.name}
                                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#e33e33] to-[#97b85d] group-hover:w-full transition-all duration-300"></span>
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isSidebarOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-black/95 backdrop-blur-xl border-l border-white/10 z-[110] transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <img src={zorphixLogo} alt="Zorphix Logo" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(227,62,51,0.5)]" />
                        <span className="text-white font-bold text-lg tracking-wider">ZORPHIX</span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                        aria-label="Close menu"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Sidebar Navigation Links */}
                <div className="flex flex-col p-6 gap-4">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            to={link.href.replace('#', '/').replace('//', '/')}
                            onClick={toggleSidebar}
                            className={`${link.name === 'Profile'
                                ? 'bg-gradient-to-r from-[#e33e33] to-[#97b85d] text-white border-none shadow-[0_0_10px_rgba(227,62,51,0.3)]'
                                : 'text-gray-300 hover:text-white hover:bg-white/5 border-transparent hover:border-white/10'
                                } px-4 py-3 rounded-lg transition-all duration-300 font-mono uppercase text-sm tracking-wider border group`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <span className={link.name === 'Profile' ? 'font-bold' : ''}>{link.name}</span>
                                <svg
                                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Sidebar Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
                    <div className="text-center">
                        <p className="text-gray-500 text-xs font-mono">SYMPOSIUM '26</p>
                        <div className="mt-2 flex justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#e33e33] animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-[#97b85d] animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Scrolling Ticker */}
            <div className="fixed top-16 w-full bg-black/80 border-b border-white/10 backdrop-blur-md py-1 md:py-2 z-50">
                <div className="flex animate-ticker whitespace-nowrap text-xs md:text-sm font-mono">
                    <span className="mx-4 text-[#e33e33]">WARNING: MARKET VOLATILITY DETECTED</span>
                    {stockTickerItems.map((item, i) => (
                        <span key={i} className="mx-4">
                            <span className="text-gray-400">{item.symbol}</span>
                            <span className={`ml-2 ${item.up ? 'text-[#97b85d]' : 'text-[#e33e33]'}`}>
                                {item.value} {item.up ? '▲' : '▼'}
                            </span>
                        </span>
                    ))}
                    {stockTickerItems.map((item, i) => (
                        <span key={`dup-${i}`} className="mx-4">
                            <span className="text-gray-400">{item.symbol}</span>
                            <span className={`ml-2 ${item.up ? 'text-[#97b85d]' : 'text-[#e33e33]'}`}>
                                {item.value} {item.up ? '▲' : '▼'}
                            </span>
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Navbar;
