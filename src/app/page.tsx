"use client";

import React, { useState, useEffect, useRef } from "react";
import Main from './components/main/main';
import Loader from "./components/loader/loader";
import Counter from "./components/main/counter";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "@/firebaseConfig";

const App: React.FC = () => {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const checkboxRef = useRef<HTMLInputElement | null>(null);

  const toggleCheckbox = () => {
    if (checkboxRef.current) {
      checkboxRef.current.checked = !checkboxRef.current.checked;
    }
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <div id="home" className="home">
      <div id="blur">
        <div className="navigation">
          <input
            type="checkbox"
            className="navigation__checkbox"
            id="navi-toggle"
            ref={checkboxRef}
          />
          <label htmlFor="navi-toggle" className="navigation__button">
            <span className="navigation__icon">&nbsp;</span>
          </label>
          <div className="navigation__background">&nbsp;</div>
          <nav className="navigation__nav">
            <ul className="navigation__list">
              <li className="navigation__item">
                <div className="navigation__link" onClick={toggleCheckbox}>
                  <a href="#" className="navigation__link one">Home</a>
                </div>
              </li>
              <li className="navigation__item">
                <div className="navigation__link" onClick={toggleCheckbox}>
                  <a href="#about" className="navigation__link two">About</a>
                </div>
              </li>
              <li className="navigation__item">
                <div className="navigation__link" onClick={toggleCheckbox}>
                  <a href="#events" className="navigation__link three">Events</a>
                </div>
              </li>
              <li className="navigation__item">
                <div className="navigation__link" onClick={toggleCheckbox}>
                  <a href="#team" className="navigation__link four">Team</a>
                </div>
              </li>
              {user ? (
                <li className="navigation__item">
                  <div className="navigation__link" onClick={toggleCheckbox}>
                    <a href="/profile" className="navigation__link five">Profile</a>
                  </div>
                </li>
              ) : (
                <li className="navigation__item">
                  <div className="navigation__link" onClick={toggleCheckbox}>
                    <a href="/auth/login" className="navigation__link five">Login</a>
                  </div>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div id="video-container">
          <div id="video-overlay"></div>
          <div className="bg-video">
            <video className="bg-video__content" autoPlay muted loop>
              <source src={"/video/zorphixbgnew.mp4"} type="video/mp4" />
              Your browser is not supported!
            </video>
          </div>
        </div>

        <div className="header" id="header">
          <div className="header__logo-box">
            <img
              className="citlogo"
              src={"/img/NEW-LOGO-CIT.png"}
              alt="clg-logo"
            />
          </div>

          <div className="header__text-box">
            <div className="logos">
              <img className="heading-primary--sub zor" src={"/img/zologo.png"} alt="new-logo" />
              <img className="heading-primary--main zorphix" src={"/img/zo.png"} alt="zorphix-logo" />
            </div>

            <h1 className="heading-primary--sub date">February 5th 2026</h1>

            <a
              href="https://drive.google.com/file/d/1dMm0oCW53daJt7EmHRQF6yqpZOane29A/view?usp=sharing"
              className="btn btn--white btn--animated"
              target="_blank"
              rel="noopener noreferrer"
            >
              CIT Bus Routes
            </a>

            <br /><br />
            <Counter />
          </div>
        </div>

        <Main />
      </div>
    </div>
  );
};

export default App;
