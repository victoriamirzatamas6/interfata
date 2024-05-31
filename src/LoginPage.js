import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import './LoginPage.css';
import tafbotImage from './assets/tafbot.png';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State nou pentru loading

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const usernameInput = document.getElementById('username');
    usernameInput.focus();
    setUsername('');
    setPassword('');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Both fields are required'); // Folosirea toast pentru eroare
    } else {
      setLoading(true); // Activăm animația de încărcare
      axios.post('http://localhost:3000/login', { username, password })
        .then(response => {
          localStorage.setItem('authToken', response.data.token); // Salvăm token-ul JWT în local storage
          localStorage.setItem('username', username); // Salvăm numele de utilizator pentru a fi utilizat mai târziu
          setLoading(false); // Oprim animația de încărcare
          if (response.status === 200) {
            login({ username: response.data.username, role: response.data.role });
            if (response.data.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/welcome');
            }
          }
        })
        .catch(error => {
          setLoading(false); // Oprim animația de încărcare
          if (error.response && error.response.status === 401) {
            toast.error('Invalid username or password');
          } else if (error.response && error.response.status === 500) {
            toast.error('Error during login. Please try again later.');
          } else {
            toast.error('Server error. Please try again later.');
          }
          console.error('Error during login request:', error);
        });
    }
  };

  return (
    <div 
      className="login-page" 
      style={{ 
        backgroundImage: "url('https://wallpaperaccess.com/full/1900851.png')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="login-container">
        <ToastContainer position="top-center" autoClose={5000} />
        <img src={tafbotImage} alt="TAFBot" className="tafbot-icon" />
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {loading && <div className="loader"></div>}
      </div>
    </div>
  );
}

export default LoginPage;
