import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) {
      setError("Must be all fields filled");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (name === user.name && email === user.email && password === user.password) {
      setError("No changes detected");
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/auth/update`, { name, email, password });
      alert("Profile updated");
      const updatedUser = { ...user, name, email, password };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (error) {
      if (error.response?.status === 409) {
        setError(error.response.data.message || "Email already exists");
      } else {
        setError(error.response?.data?.message || "Update failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex justify-end items-center  bg-opacity-50 z-50 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg flex flex-col items-center relative">
        
        {/* Avatar */}
        <div className="w-24 h-24 mb-4">
          <img
            src={user?.avatar || "https://i.pravatar.cc/300"}
            alt="User Avatar"
            className="w-full h-full rounded-full object-cover border-2 border-gray-300"
          />
        </div>

        {/* User Name */}
        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">
          {user?.name || "User"}
        </h2>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Form */}
        <form onSubmit={handleUpdate} className="w-full space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition-colors"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate("/home/borrower/dashboard")}
            className="w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
