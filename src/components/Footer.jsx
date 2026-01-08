import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter, FaMapMarkerAlt, FaEnvelope, FaArrowRight, FaDiscord, FaTelegramPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#050505] pt-12 pb-6 px-4 md:px-6 font-mono relative overflow-hidden">
            {/* Background Noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 mb-4">

                    {/* 1. Brand Card - Large */}
                    <div className="col-span-1 md:col-span-4 lg:col-span-5 relative group overflow-hidden rounded-3xl bg-[#111] border border-white/5 p-8 flex flex-col justify-between min-h-[300px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#e33e33] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-500" />

                        <div>
                            <Link to="/" className="inline-block">
                                <h2 className="text-6xl font-black text-white tracking-tighter mb-2">
                                    ZORPHIX<span className="text-[#e33e33]">.</span>
                                </h2>
                            </Link>
                            <p className="text-gray-400 text-lg max-w-md mt-2">
                                Converging Finance & Deep Tech.
                            </p>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#97b85d] text-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97b85d] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#97b85d]"></span>
                                </span>
                                Systems Operational
                            </div>
                        </div>
                    </div>

                    {/* 2. Navigation Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl bg-[#111] border border-white/5 p-6 flex flex-col hover:border-[#97b85d]/30 transition-colors duration-300">
                        <h3 className="text-[#97b85d] text-xs font-bold uppercase tracking-[0.2em] mb-6">Navigation</h3>
                        <nav className="flex flex-col gap-3 flex-grow">
                            <FooterLink to="/" text="Home" num="01" />
                            <FooterLink to="/events" text="Events" num="02" />
                            <FooterLink to="/profile" text="Profile" num="03" />
                            <FooterLink to="/about" text="About" num="04" />
                        </nav>
                    </div>

                    {/* 3. Socials Grid */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 gap-4">
                        <SocialCard icon={FaInstagram} label="Instagram" href="https://www.instagram.com/zorphix.cit/" color="#E1306C" />
                        <SocialCard icon={FaLinkedin} label="LinkedIn" href="#" color="#0077B5" />
                        <SocialCard icon={FaEnvelope} label="Email" href="mailto:zorphix@citchennai.net" color="#97b85d" />
                        <SocialCard icon={FaTwitter} label="Twitter" href="#" color="#1DA1F2" />
                    </div>

                    {/* 4. Newsletter / Updates */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 rounded-3xl bg-[#e33e33] p-8 text-white relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-black/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
                                <p className="text-white/80 text-sm mb-6">Get the latest updates on events and hackathons.</p>
                            </div>

                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="email@address.com"
                                    className="w-full bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-sm placeholder-white/50 focus:outline-none focus:bg-black/30 transition-colors"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white text-[#e33e33] rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
                                    <FaArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 5. Location Card */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-5 rounded-3xl bg-[#111] border border-white/5 p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">HQ Coordinates</h3>
                                <div className="space-y-1 text-gray-300 text-sm">
                                    <p className="font-bold text-white">Chennai Institute of Technology</p>
                                    <p>Sarathy Nagar, Kundrathur</p>
                                    <p>Chennai - 600069</p>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-[#e33e33]">
                                <FaMapMarkerAlt size={20} />
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5 flex gap-6 text-xs text-gray-500">
                            <a href="mailto:contact@zorphix.com" className="hover:text-white transition-colors flex items-center gap-2">
                                <FaEnvelope /> contact@zorphix.com
                            </a>
                        </div>
                    </div>

                    {/* 6. Legal / Copyright */}
                    <div className="col-span-1 md:col-span-4 lg:col-span-3 rounded-3xl bg-[#111] border border-white/5 p-6 flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                            <Link to="/privacy" className="text-gray-500 text-xs hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="text-gray-500 text-xs hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                        <div className="mt-8 text-[10px] text-gray-600 uppercase tracking-wider">
                            &copy; {currentYear} Zorphix Symposium
                        </div>
                    </div>

                </div>


            </div>
        </footer>
    );
};

// Helper Components

const SocialCard = ({ icon: Icon, label, href, color }) => (
    <a
        href={href}
        className="group relative h-24 rounded-2xl bg-[#111] border border-white/5 flex flex-col items-center justify-center gap-2 overflow-hidden hover:-translate-y-1 transition-all duration-300"
    >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{ backgroundColor: color }} />
        <Icon size={24} className="text-gray-400 group-hover:scale-110 transition-transform duration-300" style={{ color: 'inherit' }} />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-white transition-colors">{label}</span>
    </a>
);

const FooterLink = ({ to, text, num }) => (
    <Link to={to} className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
        <span className="text-gray-400 font-medium group-hover:text-white transition-colors">{text}</span>
        <span className="text-[10px] text-gray-700 font-mono group-hover:text-[#97b85d] transition-colors">{num}</span>
    </Link>
);

export default Footer;
