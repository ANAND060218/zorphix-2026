import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import img1 from "../assets/about_carousel/img1.jpg";
import img2 from "../assets/about_carousel/img2.jpg";
import img3 from "../assets/about_carousel/img3.png";
import img4 from "../assets/about_carousel/img4.jpg";
import img5 from "../assets/about_carousel/img5.jpg";

const images = [img1, img2, img3, img4, img5];

const UniqueCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Auto-rotate
    useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, []);

    const getSlideStyles = (index) => {
        const diff = (index - currentIndex + images.length) % images.length;

        // Mobile-specific offsets
        const xOffset = isMobile ? 120 : 300;
        const zDepth = isMobile ? -100 : 0;

        // Center item
        if (diff === 0) {
            return {
                x: 0,
                z: 100,
                scale: isMobile ? 1.1 : 1.2,
                opacity: 1,
                rotateY: 0,
                zIndex: 10,
                filter: "grayscale(0%) blur(0px)",
            };
        }

        // Immediate right
        if (diff === 1) {
            return {
                x: xOffset,
                z: zDepth,
                scale: isMobile ? 0.8 : 0.9,
                opacity: 0.7,
                rotateY: -45,
                zIndex: 5,
                filter: "grayscale(80%) blur(2px)",
            };
        }

        // Immediate left
        if (diff === images.length - 1) {
            return {
                x: -xOffset,
                z: zDepth,
                scale: isMobile ? 0.8 : 0.9,
                opacity: 0.7,
                rotateY: 45,
                zIndex: 5,
                filter: "grayscale(80%) blur(2px)",
            };
        }

        // Others
        return {
            x: 0,
            z: -200,
            scale: 0.5,
            opacity: 0,
            rotateY: 0,
            zIndex: 0,
            filter: "grayscale(100%) blur(10px)",
        };
    };

    return (
        <div className="relative w-full h-[250px] md:h-[600px] flex justify-center items-center overflow-hidden perspective-1000">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#97b85d]/5 to-transparent blur-3xl" />

            <div className="relative w-full max-w-[280px] md:max-w-4xl h-[180px] md:h-[400px] flex justify-center items-center">
                {images.map((img, index) => {
                    const styles = getSlideStyles(index);
                    return (
                        <motion.div
                            key={index}
                            className="absolute rounded-xl border-2 border-[#97b85d]/30 bg-black shadow-[0_0_20px_rgba(151,184,93,0.2)] overflow-hidden w-[200px] h-[140px] md:w-[500px] md:h-[300px]"
                            initial={{ opacity: 0 }}
                            animate={{
                                x: styles.x,
                                z: styles.z,
                                scale: styles.scale,
                                opacity: styles.opacity,
                                rotateY: styles.rotateY,
                                zIndex: styles.zIndex,
                                filter: styles.filter,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            onClick={() => setCurrentIndex(index)}
                        >
                            <img
                                src={img}
                                alt={`Slide ${index}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-2 md:bottom-10 flex gap-4 z-50">
                <button
                    onClick={prevSlide}
                    className="p-2 md:p-3 rounded-full border border-[#e33e33]/50 text-[#e33e33] hover:bg-[#e33e33] hover:text-white transition-all duration-300"
                >
                    <FaChevronLeft size={16} />
                </button>
                <div className="flex gap-2 items-center">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full cursor-pointer transition-all duration-300 ${i === currentIndex ? 'bg-[#97b85d] w-4 md:w-6' : 'bg-gray-600'}`}
                        />
                    ))}
                </div>
                <button
                    onClick={nextSlide}
                    className="p-2 md:p-3 rounded-full border border-[#97b85d]/50 text-[#97b85d] hover:bg-[#97b85d] hover:text-white transition-all duration-300"
                >
                    <FaChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default UniqueCarousel;
