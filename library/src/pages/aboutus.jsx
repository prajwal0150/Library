import React from 'react';

const Aboutus = () => {
  return (
    <div className="w-[1230px] h-full flex flex-col p-8 bg-white-400 rounded-xl shadow-2xl border border-gray-100 transform transition-all hover:shadow-3xl"
    >
      <h2 className="text-4xl font-serif text-white-900 mb-6 border-b-2 border-blue-200 pb-4">
        About Us
      </h2>
      <div className="flex w-290 h-[40vh] justify-between">
        <p className="w-100">
          Welcome to our Library Management System, a sophisticated platform designed to enhance library operations as of August 24, 2025. Built with React, Tailwind CSS, and a robust Node.js backend, it empowers librarians to efficiently manage book catalogs and borrowers to seamlessly access resources. Our mission is to foster a thriving reading community by providing a secure, user-friendly experience, reflecting our commitment to education and innovation.
        </p>
        <div className="h-full">
          <img
            src="../img/library.jpg"
            alt="Example"
            className="w-full h-full object-cover shadow-lg"
          />
        </div>

      </div>
      <div className="flex  w-auto">
        <button className=" bg-gray-400 p-2 rounded-md justify-center hover:bg-gray-600 underline">
          Learn More
        </button>
      </div>


    </div>
  );
};

export default Aboutus;