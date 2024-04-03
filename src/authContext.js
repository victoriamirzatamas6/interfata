// authContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const login = (authData) => {
    setAuth(authData);
    // Dacă dorești să folosești localStorage, ai putea să adaugi aici:
    localStorage.setItem('adminUsername', authData.username);
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('adminUsername'); // Șterge username-ul la logout
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
