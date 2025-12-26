"use client";

import React, { useEffect } from "react";
import Aos from "aos";
import 'aos/dist/aos.css';

const Sponsors: React.FC = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div className="section-features" data-aos="fade-down">
      <div className="u-center-text">
        <h2 className="heading-secondary white letter-spacing">Sponsored By</h2>
      </div>
      <div className="sponsor">
        {/* <div className="github-sponsor">
          <div className="section-sponsor-card" data-aos="fade-right">
            <img src={git} className="git" alt="github" />
          </div>
        </div> */}
        <div className="row1">
          {/* <div className="section-sponsor-card" data-aos="fade-right">
            <img src={"/img/poorvika.png"} className="i poorvika" alt="poorvika" />
          </div>

          <div className="section-sponsor-card" data-aos="fade-right">
            <img src={"/img/hubsoln.jpeg"} className="i hubsolutions" alt="hub solutions" />
          </div> */}
          
          <div className="section-sponsor-card" data-aos="fade-right">
            <img src={"/img/DIDO.png"} className="i ovi" alt="ovi design academy" />
          </div>
          {/* <div className="section-sponsor-card" data-aos="fade-right">
            <img src={people_logo} alt="people's logo" className="i some-large" />
          </div>

          <div className="section-sponsor-card" data-aos="fade-right">
            <img src={cake_logo} className="i padding-not" alt="interviewcake" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Sponsors;
