import React, { useState, useEffect } from 'react';

const EditUserModal = ({ user, onClose, onUpdateUser }) => {
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Resetăm parola la deschiderea modalului
    setPassword('');
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser(username, { username, password });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Edit User</h2>
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
            New Password (leave blank to keep unchanged):
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <div className="modal-footer">
  <button type="button" onClick={onClose} className="modal-button">
    Cancel
  </button>
  <button type="submit" className="modal-button">
    Update
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
