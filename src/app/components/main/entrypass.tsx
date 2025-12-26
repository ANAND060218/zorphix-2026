"use client";

import React, { useEffect } from "react";
import Aos from "aos";
import 'aos/dist/aos.css';

const EntryPass: React.FC = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div id="EntryPass" className="section-EntryPass" data-aos="fade-down">
      <div className="u-center-text">
        <h2 className="heading-secondary white letter-spacing">Your Entry Pass</h2>
      </div>
      <div style={{ color: "white" }} className="qrdiv">
        <a href="/auth/login" className="btn btn--white btn--animated bold">
          <h3 className="mt-2"><b>Login to get Entry Pass</b></h3>
        </a>
        <br />
      </div>
    </div>
  );
};

export default EntryPass;
