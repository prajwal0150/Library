import React, { useContext, useState } from 'react';
import { FaUser, FaLock, FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const { login } = useContext(AuthContext)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All field must be filled")
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email address");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        alert("Login success");
        navigate("/home");
        console.log(user)
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }


    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Remember me:', rememberMe);
  };
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:5000/auth/login", {
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
    <div className="flex justify-center items-center min-h-screen bg-[#dadaea] bg-cover bg-center">
      <div
        className="w-[420px] p-9 rounded-lg text-white flex flex-col"
        style={{
          backgroundImage:
            "url('../../img/pexels-shiva-smyth-394854-1051431.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Top User Icon */}
        <div className="flex justify-center items-center mb-2">
          <FaUser className="text-white text-[50px]" />
        </div>

        {/* Title */}
        <h1 className="text-center text-xl mb-5">Login </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Username Input */}
          <div className="relative  ">
            {/* <FaUser className="absolute left-78 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" /> */}
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="   w-full h-12 pl-12 pr-4 rounded-full text-white text-base placeholder-white bg-transparent border border-white/20 outline-none transition-all duration-300 focus:border-white"
            />
          </div>

          <div className="relative my-5">

            <input
              security='true'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 pl-12 pr-4 rounded-full text-white text-base placeholder-white bg-transparent border border-white/20 outline-none transition-all duration-300 focus:border-white"
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-[14.5px] mb-5">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-white mr-1"
              />
              Remember me
            </label>
            <Link to="#" className="hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full h-12 bg-sky-25 border text-white  rounded-full shadow-md hover:bg-blue-500 mb-2 transition-all duration-300"
          >
            Login
          </button>

          {/* Register */}
          <p className="text-center text-sm mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-white font-semibold hover:underline">
              Register
            </Link>
          </p>

          {/* Social Login */}
          <div className="mt-4 text-center">
            <p className="flex justify-center items-center">Or login with</p>
            <div className="flex justify-center items-center gap-5 mt-2">
              <button type="button" className="text-2xl">
                <i className="text-[#34A853]"><FaGoogle onClick={() => window.open("https://accounts.google.com/signin")} /></i>
              </button>
              <button type="button" className="text-2xl">
                <i className="text-[#4267B2]"><FaFacebook onClick={() => window.open("https://www.facebook.com/login")} /></i>
              </button>
              <button type="button" className="text-2xl">
                <i className="text-[#1DA1F2]"><FaTwitter onClick={() => window.open("https://twitter.com/login")} /></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
