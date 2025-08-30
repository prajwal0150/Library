import React, { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Right = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [accessDenied, setAccessDenied] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);

  const isProfileActive = window.location.pathname === "/home/borrower/profile";

  const handleProfileClick = () => {
    setProfileClicked(!profileClicked);
    
    if (user?.role === "borrower") {
      navigate("/home/borrower/profile");
    } else if (user?.role === "librarian") {
      setAccessDenied(true);
      setTimeout(() => setAccessDenied(false), 2000);
    }
  };

  return (
    <div className=" flex space-x-4 items-center p-2 relative">
      
      <FaUser
        className={`text-2xl text-gray-500 hover:text-gray-900 hover:scale-125 cursor-pointer ${
          isProfileActive ? "text-sky-600 scale-125" : ""
        }`}
        onClick={handleProfileClick}

      />

      {accessDenied && (
        <span className="absolute top-10 right-0 text-red-500 font-semibold bg-white px-2 py-1 rounded shadow">
          Access Denied. It's for borrowers only.
        </span>
      )}

      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};


export default Right;
