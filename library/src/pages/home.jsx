import React from 'react';
import Navbar from '../components/home/Navbar';

import { Outlet } from 'react-router-dom';
import Right from '../components/home/right';

const Home = () => {
  return (
    <div className="home min-h-screen  flex flex-col ">

     
      <div className="flex justify-between p-4 bg-gray-200">
        <span className='font-semibold tracking text-4xl'>L <span className='text-blue-500 text-3xl'>M</span> S</span>
        <Right />
      </div>
    

      <div className="flex ">

        
        <Navbar />

        <div className="flex">
          <Outlet />
        </div>
         

        
        
      </div>
    </div>
  );
};

export default Home;
