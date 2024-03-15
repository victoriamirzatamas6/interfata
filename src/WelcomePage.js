import React, { useState, useEffect } from 'react';
import welcomeImage from './assets/chatbot-welcome.png';
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  let navigate = useNavigate();
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [showAdditionalText, setShowAdditionalText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => {
        setShowWelcomeText(true);
      }, 1000),
      setTimeout(() => {
        setShowAdditionalText(true);
      }, 2000),
      setTimeout(() => {
        setShowButton(true);
      }, 3000)
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  function handleStartChat() {
    navigate('/chat');
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={welcomeImage} alt="Welcome" style={{ maxWidth: '100%', height: 'auto' }} />
        <h1 className={showWelcomeText ? 'welcome-text show' : 'welcome-text'}>Welcome to Our TAFBot</h1>
        <p className={showAdditionalText ? 'additional-text show' : 'additional-text'}>For questions about existing processes and documentation click below</p>
        {showButton && <button className="start-button" onClick={handleStartChat}>Start Chatting</button>}
      </header>
    </div>
  );
}

export default WelcomePage;
