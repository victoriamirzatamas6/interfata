// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './authContext'; // Asigură-te că importul este corect
import WelcomePage from './WelcomePage';
import ChatPage from './ChatPage';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';

function App() {
  return (
    <AuthProvider> {/* Învelește componentele Routes în AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
