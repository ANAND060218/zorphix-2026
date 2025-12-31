import React from 'react';

const Background = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Gradient Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] md:w-[800px] md:h-[800px] bg-[#e33e33]/20 rounded-full mix-blend-screen blur-[100px] animate-blob filter"></div>
            <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] md:w-[800px] md:h-[800px] bg-[#97b85d]/20 rounded-full mix-blend-screen blur-[100px] animate-blob animation-delay-2000 filter"></div>
            <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[70vw] h-[70vw] md:w-[800px] md:h-[800px] bg-[#e33e33]/10 rounded-full mix-blend-screen blur-[100px] animate-blob animation-delay-4000 filter"></div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
        </div>
    );
};

export default Background;
