import React from 'react';

const Aboutus = () => {
  return (
    <div className="p-6  bg-gray-100">
      <h2 className="text-4xl font-serif text-gray-900 mb-6 border-b-2 border-blue-200 pb-4 text-center md:text-left">
        About Us
      </h2>

      <div className="flex flex-col md:flex-row md:justify-between  gap-2">
        <p className="md:w-1/2 text-gray-800 text-lg leading-relaxed">
          Welcome to our Library Management System, a dynamic platform designed to enhance the library experience as of August 30, 2025. This system serves to efficiently manage our extensive book collection, streamline borrowing processes, and provide a user-friendly interface for both librarians and borrowers. Our purpose is to foster a vibrant reading community by leveraging modern technology, ensuring easy access to resources, and supporting educational growth through organized and secure library operations.
        </p>

        <div className="md:w-1/2 h-64 md:h-96">
          <img
            src="../img/library.jpg"
            alt="Library"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className=" flex flex-row ">
        <button className="bg-gray-400 text-white p-2 rounded-md hover:bg-gray-600 underline transition-colors duration-300">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Aboutus;
