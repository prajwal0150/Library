import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');

  // Email regex validation
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim() || !email.trim()) {
      setError('Must be all fields filled');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (name === user.name && email === user.email) {
      setError('No changes detected');
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/auth/update`, { name, email });
      alert('Profile updated');

      // Update localStorage and context
      const updatedUser = { ...user, name, email };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload(); // Optional: refresh to show updated info
    } catch (error) {
      // Handle backend duplicate email/name
      if (error.response?.status === 409) {
        setError(error.response.data.message); // e.g., "Email already exists"
      } else {
        setError(error.response?.data?.message || 'Update failed');
      }
    }
  };

  return (
    <div className="flex min-h-screen  p-4">
      <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto text-center ">
        <h2 className="text-2xl font-bold mb-4 text-center ">Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
          {/* <button
            type="button"
            onClick={logout}
            className="w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Profile;
