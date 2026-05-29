import React from 'react';
import Navbar from '../components/home/Navbar';

import { Outlet } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home min-h-screen flex bg-[#090d14] text-slate-100">
      <Navbar />

      <main className="min-w-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,_#0b1018_0%,_#090d14_100%)]">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
