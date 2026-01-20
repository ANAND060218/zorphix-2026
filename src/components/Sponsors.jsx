import React from 'react';
import { motion } from 'framer-motion';

// Import sponsor images
import poorvika from '../assets/sponsors/poorvika.jpg';
import ovidesign from '../assets/sponsors/ovidesign.png';
import wolfram from '../assets/sponsors/wolframlanguage.jpg';
import makers from '../assets/sponsors/makers.png';
import github from '../assets/sponsors/github.jpg';
import buddyinterview from '../assets/sponsors/buddyinterview.jpg';
import cw from '../assets/sponsors/cw.jpg';
import digitalocean from '../assets/sponsors/digitalocean.png';
import interviewcake from '../assets/sponsors/interviewcake.jpg';
import jetbrain from '../assets/sponsors/jetbrain.webp';

const Sponsors = () => {
    // Top row sponsors: poorvika, ovidesign, wolfram, makers, github
    const sponsorsTop = [
        { name: 'Poorvika', logo: poorvika },
        { name: 'Ovi Design Academy', logo: ovidesign },
        { name: 'Wolfram Language', logo: wolfram },
        { name: "Maker's Cafe", logo: makers },
        { name: 'GitHub', logo: github },
    ];

    // Bottom row sponsors: remaining ones
    const sponsorsBottom = [
        { name: 'Interview Buddy', logo: buddyinterview },
        { name: 'Corporate Warranties', logo: cw },
        { name: 'DigitalOcean', logo: digitalocean },
        { name: 'Interview Cake', logo: interviewcake },
        { name: 'JetBrains', logo: jetbrain },
    ];

    // Duplicate for infinite loop
    const row1 = [...sponsorsTop, ...sponsorsTop, ...sponsorsTop];
    const row2 = [...sponsorsBottom, ...sponsorsBottom, ...sponsorsBottom];

    return (
        <section className="py-24 relative overflow-hidden">
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
                        TRUSTED <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e33e33] to-[#97b85d]">PARTNERS</span>
                    </h2>
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4"></div>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative flex flex-col gap-12 my-10">
                {/* Row 1: Left to Right */}
                <div className="relative flex overflow-hidden group">
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

                    <motion.div
                        className="flex gap-8"
                        animate={{ x: [0, -2500] }}
                        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                    >
                        {row1.map((sponsor, i) => (
                            <SponsorCard key={i} sponsor={sponsor} />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2: Right to Left */}
                <div className="relative flex overflow-hidden group">
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>

                    <motion.div
                        className="flex gap-8"
                        animate={{ x: [-2500, 0] }}
                        transition={{ duration: 45, ease: "linear", repeat: Infinity }}
                    >
                        {row2.map((sponsor, i) => (
                            <SponsorCard key={i} sponsor={sponsor} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// Subcomponent for individual sponsor cards with image
const SponsorCard = ({ sponsor }) => (
    <div className="relative group w-[280px] h-[160px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center p-6 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] shrink-0 cursor-pointer overflow-hidden">
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Logo Image */}
        <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="max-w-full max-h-full w-auto h-auto object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
            style={{ maxHeight: '100px', maxWidth: '200px' }}
        />

        {/* Glow on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-white"></div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#e33e33] to-[#97b85d] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

        {/* Sponsor name overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-white text-sm font-bold uppercase tracking-wider">{sponsor.name}</span>
        </div>
    </div>
);

export default Sponsors;
