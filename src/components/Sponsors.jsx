import React from 'react';
import { motion } from 'framer-motion';

// Import sponsor images
import Decathlon from '../assets/sponsors/Decathlon.png';
import Dhaneesh from '../assets/sponsors/Dhaneesh.png';
import DMS from '../assets/sponsors/DMS.png';
import FunCity from '../assets/sponsors/FunCity.png';
import Gameistry from '../assets/sponsors/Gameistry.png';
import MRG from '../assets/sponsors/MRG.png';
import GreenTrends from '../assets/sponsors/GreenTrends.png';
import MYOP from '../assets/sponsors/MYOP.png';
import Vimal from '../assets/sponsors/Vimal.jpeg';

const Sponsors = () => {
    // Top row sponsors: poorvika, ovidesign, wolfram, makers, github
    const sponsorsTop = [
        { name: 'Co-Title Sponsor', logo: DMS },
        { name: 'Title Sponsor', logo: MRG },
        { name: 'Certificate Sponsor', logo: Vimal },
    ];

    // Bottom row sponsors: remaining ones
    const sponsorsBottom = [
        { name: 'Product Sponsor', logo: Decathlon },
        { name: 'Voucher Sponsor', logo: Dhaneesh },
        { name: 'Voucher Sponsor', logo: GreenTrends },
        { name: 'Product Sponsor', logo: MYOP },
        { name: "Voucher Sponsor", logo: FunCity },
        { name: 'Voucher Sponsor', logo: Gameistry },
    ];

    // Duplicate for infinite loop
    const row1 = [...sponsorsTop, ...sponsorsTop, ...sponsorsTop];
    const row2 = [...sponsorsBottom, ...sponsorsBottom, ...sponsorsBottom];

    return (
        <section className="py-24 relative overflow-hidden">
            <style>
                {`
                @keyframes scrollLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes scrollRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-scroll-left {
                    animation: scrollLeft 40s linear infinite;
                }
                .animate-scroll-right {
                    animation: scrollRight 40s linear infinite;
                }
                .pause-on-hover:hover .animate-scroll-left,
                .pause-on-hover:hover .animate-scroll-right {
                    animation-play-state: paused;
                }
                `}
            </style>

            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

            {/* Glowing Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#e33e33]/20 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#97b85d]/20 rounded-full blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="container mx-auto px-4 mb-20 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="inline-block"
                >
                    <h2 className="text-4xl md:text-7xl font-bold text-white mb-2 tracking-tighter mix-blend-difference">
                        PREVIOUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e33e33] to-[#97b85d]">PARTNERS</span>
                    </h2>
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4"></div>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative flex flex-col gap-12 my-10">
                {/* Row 1: Left to Right */}
                <div className="relative flex overflow-hidden group pause-on-hover">
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

                    <div className="flex gap-8 animate-scroll-left w-fit">
                        {row1.map((sponsor, i) => (
                            <SponsorCard key={i} sponsor={sponsor} isLarge={true} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Right to Left */}
                <div className="relative flex overflow-hidden group pause-on-hover">
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

                    <div className="flex gap-8 animate-scroll-right w-fit">
                        {row2.map((sponsor, i) => (
                            <SponsorCard key={i} sponsor={sponsor} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// Subcomponent for individual sponsor cards with image
const SponsorCard = ({ sponsor, isLarge = false }) => (
    <div
        className={`relative group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center p-6 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] shrink-0 cursor-pointer overflow-hidden ${isLarge ? 'w-[350px] h-[200px]' : 'w-[280px] h-[160px]'
            }`}
    >
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Logo Image */}
        <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="max-w-full max-h-full w-auto h-auto object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
            style={{ maxHeight: isLarge ? '140px' : '100px', maxWidth: isLarge ? '260px' : '200px' }}
        />

        {/* Glow on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-white"></div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e33e33] to-[#97b85d] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

        {/* Sponsor name overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center items-end">
            <span className="text-white text-sm font-bold uppercase tracking-wider text-center">{sponsor.name}</span>
        </div>
    </div>
);

export default Sponsors;
