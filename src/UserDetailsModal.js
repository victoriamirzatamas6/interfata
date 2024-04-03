import React from 'react';
import './UserDetailsModal.css'; // Importă stilurile pentru fundalul modalului

const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>User Details</h2>
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Password:</strong> {user.password}</p>
        <button className="modal-close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default UserDetailsModal;
