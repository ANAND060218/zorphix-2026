"use client"

import React, { useEffect, useRef, useState } from 'react';

const Counter: React.FC = () => {
  const [timerDays, setTimerDays] = useState<string>('00');
  const [timerHours, setTimerHours] = useState<string>('00');
  const [timerMinutes, setTimerMinutes] = useState<string>('00');
  const [timerSeconds, setTimerSeconds] = useState<string>('00');

  const interval = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    const countdownDate = new Date('February 5, 2026 00:00:00').getTime();

    interval.current = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(interval.current!);
      } else {
        setTimerDays(days.toString().padStart(2, '0'));
        setTimerHours(hours.toString().padStart(2, '0'));
        setTimerMinutes(minutes.toString().padStart(2, '0'));
        setTimerSeconds(seconds.toString().padStart(2, '0'));
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return (
    <section className="timer-container">
      <section className="timer">
        <div className="info" style={{ marginBottom: '20px' }}>
          <span className="mdi mdi-calendar-clock timer-icon" style={{ display: 'block' }}></span>
          <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>Your Entry Pass Awaits</p>
        </div>
        <div>
          <div>
            <span className="mdi mdi-calendar-clock" style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}></span>
            <span style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{timerDays}</span>
            <br />
            <small style={{ fontSize: '0.8em', letterSpacing: '2px' }}>DAYS</small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className='divider' style={{ fontSize: '2.5em' }}>:</span>
          </div>
          <div>
            <span className="mdi mdi-clock" style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}></span>
            <span style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{timerHours}</span>
            <br />
            <small style={{ fontSize: '0.8em', letterSpacing: '2px' }}>HOURS</small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className='divider' style={{ fontSize: '2.5em' }}>:</span>
          </div>
          <div>
            <span className="mdi mdi-clock" style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}></span>
            <span style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{timerMinutes}</span>
            <br />
            <small style={{ fontSize: '0.8em', letterSpacing: '2px' }}>MINUTES</small>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className='divider' style={{ fontSize: '2.5em' }}>:</span>
          </div>
          <div>
            <span className="mdi mdi-clock" style={{ fontSize: '2em', display: 'block', marginBottom: '10px' }}></span>
            <span style={{ fontSize: '2.5em', fontWeight: 'bold' }}>{timerSeconds}</span>
            <br />
            <small style={{ fontSize: '0.8em', letterSpacing: '2px' }}>SECONDS</small>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Counter;
