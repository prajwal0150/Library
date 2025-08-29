import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const {user} = useContext(AuthContext);
  
  if(!user) return <span>No user defined</span>
  
  return (
    <div className="flex p-2 bg-gray-100 border-b border-gray-300 h-[650px] font-sans">
      <div className="flex flex-col gap-8 list-none m-1 p-2 text-lg w-[200px] border-r border-gray-600 rounded-md">

        {/* Dashboard Link */}

        {user.role === 'librarian' ? <NavLink
          to="/home/librarian/dashboard"
          
          className={({ isActive }) =>
            `block px-2 py-1 no-underline ${
              isActive ? "text-blue-600" : "text-black"
            } hover:bg-gray-500 hover:text-gray-700`
          }
        >
          Dashboard
        </NavLink> :  <NavLink
          to="/home/borrower/dashboard"
          
          className={({ isActive }) =>
            `block px-2 py-1 no-underline ${
              isActive ? "text-blue-600" : "text-black"
            } hover:bg-gray-500 hover:text-gray-700`
          }
        >
          Dashboard
        </NavLink>}
      

        {/* About Link */}
        <NavLink
          to="/home/borrower/bookDetail"
          className={({ isActive }) =>
            `block px-2 py-1 no-underline ${
              isActive ? "text-blue-600" : "text-black"
            } hover:bg-gray-500 hover:text-gray-700`
          }
        >
          Books
        </NavLink>

        {/* About Us Link */}
        <NavLink
          to="/home/aboutus"
          className={({ isActive }) =>
            `block px-2 py-1 no-underline ${
              isActive ? "text-blue-600" : "text-black"
            } hover:bg-gray-500 hover:text-gray-700`
          }
        >
          About Us
        </NavLink>

        {/* Contact Link */}
        <NavLink
          to="/home/contact"
          className={({ isActive }) =>
            `block px-2 py-1 no-underline  ${
              isActive ? "text-blue-600" : "text-black"
            } hover:bg-gray-500 hover:text-gray-700`
          }
        >
          Contact Us
        </NavLink>

      </div>
    </div>
  );
};

export default Navbar;
