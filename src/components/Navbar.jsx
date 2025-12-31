import { useState } from 'react';
import { Link } from 'react-router-dom';
import zorphixLogo from '../assets/zorphix-logo.png';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Events', href: '/events' },
        { name: 'Register', href: '/register' }
    ];

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img src={zorphixLogo} alt="Zorphix Logo" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(227,62,51,0.5)]" />
                            <span className="text-white font-bold text-xl tracking-wider">ZORPHIX</span>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href.replace('#', '/').replace('//', '/')}
                                    className="text-gray-300 hover:text-white transition-colors duration-300 font-mono uppercase text-sm tracking-wider relative group"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#e33e33] to-[#97b85d] group-hover:w-full transition-all duration-300"></span>
                                </Link>
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
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-black/95 backdrop-blur-xl border-l border-white/10 z-[95] transform transition-transform duration-300 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
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
                            className="text-gray-300 hover:text-white hover:bg-white/5 px-4 py-3 rounded-lg transition-all duration-300 font-mono uppercase text-sm tracking-wider border border-transparent hover:border-white/10 group"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <span>{link.name}</span>
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
        </>
    );
};

export default Navbar;
