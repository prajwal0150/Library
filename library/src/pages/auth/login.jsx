import React, { useContext, useState, useEffect } from 'react';
import { FaUser, FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';


import lmsImage from '../../assets/img/lms.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields must be filled");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address");
      return;
    }

    try {
      const response = await axios.post("https://library-r8vp.onrender.com/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        alert("Login success");
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("https://library-r8vp.onrender.com/auth/login", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      if (error.response?.status === 404 || error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    login();
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-5">
      <div className="flex md:flex-row max-w-5xl bg-gray-200 rounded-lg shadow-lg overflow-hidden gap-5">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex justify-center mb-4">
            <FaUser className="text-gray-800 text-5xl" />
          </div>
          <h1 className="text-center text-2xl font-semibold mb-6 text-gray-800">Login</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
            />

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 accent-sky-500"
                />
                Remember me
              </label>
              <Link to="#" className="hover:underline text-sky-500">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-full transition-colors"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-sky-500 font-semibold hover:underline">
              Register
            </Link>
          </p>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Or login with</p>
            <div className="flex justify-center gap-5 text-2xl">
              <FaGoogle className="text-[#34A853] cursor-pointer" onClick={() => window.open("https://accounts.google.com/signin")} />
              <FaFacebook className="text-[#4267B2] cursor-pointer" onClick={() => window.open("https://www.facebook.com/login")} />
              <FaTwitter className="text-[#1DA1F2] cursor-pointer" onClick={() => window.open("https://twitter.com/login")} />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src={lmsImage}
            alt="Library"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
