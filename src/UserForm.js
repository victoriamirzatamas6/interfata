
// UserForm.js
import React, { useState, useEffect } from 'react';

const UserForm = ({ onAddUser, onUpdateUser, editUserData }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Efect pentru a preîncărca formularul cu datele pentru editare
  useEffect(() => {
    if (editUserData) {
      setUsername(editUserData.username);
      setPassword(''); // Nu preîncărca parola, deoarece este securizată
    }
  }, [editUserData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editUserData) {
      onUpdateUser({ username, password });
    } else {
      onAddUser({ username, password });
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button type="submit" className="modal-button">
  {editUserData ? 'Update User' : 'Add User'}
</button>

    </form>
  );
};




export default UserForm;
