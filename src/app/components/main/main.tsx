"use client";

import React from 'react';
import About from './about';
import Sponsors from './sponsors';
import Footer from './footer';
import TechEvents from './techevents';
import Workshops from './workshops';
import Team from './team';
import CarouselComponent from './carouselcomponent';
import EntryPass from './entrypass';
import BackgroundAnimation from './backgroundanimation';

const Main: React.FC = () => {
  return (
    <div>
      <BackgroundAnimation />
      <EntryPass />
      <About />
      <Sponsors />
      <TechEvents />
      <Workshops />
      <CarouselComponent />
      <Team />
      <Footer />
    </div>
  );
};

export default Main;
