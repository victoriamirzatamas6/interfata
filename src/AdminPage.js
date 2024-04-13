// AdminPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './authContext';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import Modal from './Modal';
import UserForm from './UserForm';
import UserDetailsModal from './UserDetailsModal';
import EditUserModal from './EditUserModal'; // Asigură-te că acesta este importat corect
import FeedbackTable from './FeedbackTable';


function AdminPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/feedback')
      .then(response => {
        setFeedbacks(response.data);
      })
      .catch(error => {
        console.error('Error fetching feedbacks:', error);
      });
  }, []);
  

  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data); // Initialize filtered users with all users
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
    const result = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(result);
  }, [searchQuery, users]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewUser = () => {
    setIsModalOpen(true);
  };

  const addUser = (user) => {
    axios.post('http://localhost:3000/users', {
      username: user.username,
      password: user.password,
      role: 'user'
    })
    .then(response => {
      setUsers([...users, response.data]);
      setIsModalOpen(false);
      // Immediately show the new user in the filtered list
      setFilteredUsers([...filteredUsers, response.data]);
    })
    .catch(error => {
      console.error('Error adding user:', error);
    });
  };

  const deleteUser = (username) => {
    if (window.confirm(`Are you sure you want to delete ${username}?`)) {
      axios.delete(`http://localhost:3000/users/${username}`)
        .then(() => {
          const updatedUsers = users.filter(user => user.username !== username);
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers); // Also update the filtered list
          setSuccessMessage(`Deletion of ${username} was successful.`);
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        })
        .catch(error => {
          console.error('Error deleting user:', error);
          setSuccessMessage('Deletion failed.');
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000);
        });
    }
  };

  const openUserDetailsModal = (user) => {
    axios.get(`http://localhost:3000/user-details/${user.username}`)
      .then(response => {
        setSelectedUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  };

  const openEditModal = (user) => {
    setEditUserData(user);
    setIsEditModalOpen(true);
  };

  const updateUser = (username, updatedData) => {
    axios.put(`http://localhost:3000/users/${username}`, updatedData)
      .then(response => {
        const newUsers = users.map(user => user.username === username ? { ...user, ...response.data } : user);
        setUsers(newUsers);
        setFilteredUsers(newUsers); // Ensure the filtered list is also updated
        setIsEditModalOpen(false);
        setSuccessMessage(`Update of ${username} was successful.`);
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(error => {
        console.error('Error updating user:', error);
        setSuccessMessage('Error updating user.');
        setTimeout(() => setSuccessMessage(''), 3000);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  return (
    <div className="admin-container">
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="admin-header">
        <span className="username">Logged in as: {auth.username}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h1>User Management</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleNewUser}>New</button>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => openUserDetailsModal(user)}>View</button>
                  <button onClick={() => openEditModal(user)}>Edit</button>
                  <button onClick={() => deleteUser(user.username)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isEditModalOpen && (
        <Modal onClose={closeModal}>
          <UserForm
            onUpdateUser={(userData) => updateUser(editUserData.username, userData)}
            editUserData={editUserData}
          />
        </Modal>
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <UserForm onAddUser={addUser} />
        </Modal>
      )}
      {selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      <FeedbackTable feedbacks={feedbacks} />

    </div>
  );
}

export default AdminPage;