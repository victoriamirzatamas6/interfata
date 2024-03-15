// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import ChatPage from './ChatPage';
import LoginPage from './LoginPage'; // Importă noua pagină

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/welcome" element={<WelcomePage />} />
  <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


