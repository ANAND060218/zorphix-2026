"use client";

import React from 'react';

const Team: React.FC = () => {
  return (
    <div className="team section-stories" id="team">
      <div className="bg-video-2">
        <video className="bg-video__content" autoPlay muted loop>
          <source src="/video/video1.mp4" type="video/mp4" />
          <source src="/img/video.webm" type="video/webm" />
          Your browser is not supported!
        </video>
      </div>
      <div className="u-center-text u-margin-bottom-big">
        <h2 className="heading-secondary" style={{ color: 'white' }}>Our Team</h2>
      </div>
      <div className="main-section">
        <div className="box">
          <h2 className="position">President</h2>
          <h3 className="heading-tertiary u-margin-bottom-small">Bharath V</h3>
          <p>+91 97515 83361</p>
        </div>
        <div className="box">
          <h2 className="position">Vice President</h2>
          <h3 className="heading-tertiary u-margin-bottom-small">Maneesh J J</h3>
          <p>+91 90251 12972</p>
        </div>
        <div className="box">
          <h2 className="position">Secretary</h2>
          <h3 className="heading-tertiary u-margin-bottom-small">Suhashini R</h3>
          <p>+91 93425 72196 </p>
        </div>
        <div className="box">
          <h2 className="position">Treasurer</h2>
          <h3 className="heading-tertiary u-margin-bottom-small">Deepak K</h3>
          <p>+91 81225 50684</p>
        </div>
      </div>
    </div>
  );
};

export default Team;
