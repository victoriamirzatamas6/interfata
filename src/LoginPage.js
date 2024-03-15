import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import tafbotImage from './assets/tafbot.png';
import axios from 'axios';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Setează focus pe inputul de username la încărcarea componentei
    const usernameInput = document.getElementById('username');
    usernameInput.focus();
    
    // Resetează username-ul și parola la încărcarea componentei
    setUsername('');
    setPassword('');
    setError('');
  }, []); // Dependențele goale [] indică faptul că acest efect se rulează o singură dată, la montarea componentei

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
        setError('Both fields are required');
    } else {
        axios.post('http://localhost:3000/login', { username, password })
            .then(response => {
                if (response.status === 200) {
                    navigate('/welcome');
                } else if (response.status === 401) {
                    setError('Invalid username or password');
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    setError('Invalid username or password');
                } else if (error.response && error.response.status === 500) {
                    setError('Error during login. Please try again later.');
                } else {
                    setError('Server error. Please try again later.');
                }
                console.error('Error during login request:', error);
            });
    }
};

  
  return (
    <div className="login-container">
      <img src={tafbotImage} alt="TAFBot" className="tafbot-icon" />
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
