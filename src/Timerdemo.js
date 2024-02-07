import React, { useState, useEffect } from 'react';
import moment from 'moment';

const Timerdemo = () => {
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    let timerInterval;
  
    useEffect(() => {
      // Load timer state from local storage
      const savedTimer = localStorage.getItem('timer');
      const savedIsRunning = localStorage.getItem('isRunning');
  
      if (savedTimer && savedIsRunning) {
        setTimer(parseInt(savedTimer));
        setIsRunning(savedIsRunning === 'true');
      }
    }, []);
  
    useEffect(() => {
      // Save timer state to local storage
      localStorage.setItem('timer', timer);
      localStorage.setItem('isRunning', isRunning);
    }, [timer, isRunning]);
  
    useEffect(() => {
      return () => clearInterval(timerInterval);
    }, []);
  
    const startTimer = () => {
      setIsRunning(true);
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    };
  
    const stopTimer = () => {
      setIsRunning(false);
      clearInterval(timerInterval);
      setTimer(timer); // Update timer to the last value
    };
  
    const resetTimer = () => {
      setIsRunning(false);
      clearInterval(timerInterval);
      setTimer(0);
    };
  
    const formatTime = (time) => {
      return moment.utc(time * 1000).format('HH:mm:ss');
    };
  
    return (
      <div>
        <div>Timer: {formatTime(timer)}</div>
        <button onClick={startTimer} disabled={isRunning}>Start</button>
        <button onClick={stopTimer} disabled={!isRunning}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    );
  };
export default Timerdemo;
