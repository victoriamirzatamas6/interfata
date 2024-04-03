import React, { useState, useEffect } from 'react';
import continentalLogo from './assets/continental-logo.png'; // Presupunând că acesta este path-ul către logo
import { useNavigate } from 'react-router-dom';

function WelcomePage() {
  let navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [showAdditionalText, setShowAdditionalText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Setarea timeout-urilor pentru afișarea secvențială a elementelor
    const timeouts = [
      setTimeout(() => setShowLogo(true), 0),
      setTimeout(() => setShowWelcomeText(true), 1500),
      setTimeout(() => setShowAdditionalText(true), 2500),
      setTimeout(() => setShowButton(true), 3500),
    ];

    // Curățarea timeout-urilor la demontarea componentei
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
        {showLogo && <img src={continentalLogo} alt="Welcome" className="welcome-image" />}
        {showWelcomeText && <h1 className='welcome-text show'>Welcome to Our TAFBot</h1>}
        {showAdditionalText && <p className='additional-text show'>For questions about existing processes and documentation click below</p>}
        {showButton && <button className='start-button show' onClick={handleStartChat}>Start Chatting</button>}
      </header>
    </div>
  );
}

export default WelcomePage;
