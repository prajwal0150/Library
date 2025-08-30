import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";


const Contact = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) {
      setError('Message is required');
      return;
    }
    alert('Message sent!');
    setMessage('');
  };

  return (
    <div className=" w-[1230px] h-full flex items-center  p-2 bg-gray-100 ">
      <div className="flex  md:flex-row w-full w-full h-full rounded-lg overflow-hidden">
       
          <div className="w-full md:w-1/2 p-8  ml-20">
            <h2 className="text-3xl font-serif text-gray-900">Contact Us</h2>
            <p className="mt-2 text-gray-600">Any question? 
              We would </p>
              <p className='text-gray-600'>be happy to help you!</p>
             <div className="mt-15 space-y-4">
              <p className="flex items-center text-gray-700">
                <FaPhone className="mr-2 text-sky-600" />
                +977 9814357561
              </p>
              <p className="flex items-center text-gray-700">
                <FaEnvelope className="mr-2 text-sky-600" />
                prajwalrai@gmail.com
              </p>
              <p className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="mr-2 text-sky-600" />
                Dharan-17, Nepal
              </p>
           </div>
            <div className=" flex space-x-4 mt-50">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="text-2xl text-blue-600"
                onClick={() => window.open("https://www.facebook.com/prajwal.raee.12")} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="text-2xl text-sky-400"
                onClick={() => window.open("https://twitter.com/Prajwal34136137")} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="text-2xl text-pink-500"
                onClick={() => window.open("https://www.instagram.com/prajwalrai724")} />
              </a>
            </div>

          </div>

        <div className="w-full md:w-1/2 p-8 bg-white mr-20 mt-10 mb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-1/2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-1/2 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <textarea
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            ></textarea>
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded transition-colors flex items-center justify-center"
            >
              Send Message 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;