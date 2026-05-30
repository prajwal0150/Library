import React from 'react';
import libraryImg from '../assets/img/library.jpg';

const StatCard = ({ value, label }) => (
  <div className="bg-slate-800/60 rounded-lg p-6 flex flex-col items-start">
    <div className="text-3xl font-semibold text-white">{value}</div>
    <div className="text-sm text-slate-300 mt-1">{label}</div>
  </div>
);

const ValueCard = ({ title, desc, children }) => (
  <div className="bg-slate-800/60 rounded-lg p-6 flex gap-4 items-start">
    <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-blue-400">
      {children}
    </div>
    <div>
      <div className="text-white font-semibold">{title}</div>
      <div className="text-slate-300 text-sm mt-1">{desc}</div>
    </div>
  </div>
);

const TeamCard = ({ name, role, initials }) => (
  <div className="bg-slate-800/40 rounded-lg p-6 flex items-center gap-4">
    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center text-white font-semibold">
      {initials}
    </div>
    <div>
      <div className="text-white font-medium">{name}</div>
      <div className="text-slate-300 text-sm">{role}</div>
    </div>
  </div>
);

const Aboutus = () => {
  return (
    <div className="p-8 bg-slate-900 min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-8">
          <div className="flex-1">
            <div className="text-sm text-blue-300 uppercase tracking-wide font-semibold mb-3">
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Empowering Readers, Connecting Communities
            </h1>
            <p className="text-slate-300 mt-4 max-w-2xl">
              Welcome to LibraryOS — a dynamic platform designed to enhance the library
              experience. Our system efficiently manages an extensive book collection,
              streamlines borrowing processes, and provides a user-friendly interface for both
              librarians and borrowers. We foster a vibrant reading community by leveraging modern
              technology to ensure easy access to resources and support educational growth.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow">
                Browse Collection
              </button>
              <button className="text-slate-300 underline hover:text-white">Learn more →</button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard value="12,430" label="Books in Collection" />
              <StatCard value="3,284" label="Active Members" />
              <StatCard value="98%" label="Member Satisfaction" />
              <StatCard value="1994" label="Year Founded" />
            </div>

            <div className="mt-10">
              <div className="text-sm text-blue-300 uppercase tracking-wide font-semibold mb-4">
                Our Values
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ValueCard
                  title="Accessibility"
                  desc="We believe knowledge should be available to everyone, regardless of background."
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </ValueCard>

                <ValueCard
                  title="Community"
                  desc="A gathering place that fosters lifelong learning, curiosity, and connection."
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A8 8 0 1118.88 6.196" />
                  </svg>
                </ValueCard>

                <ValueCard
                  title="Integrity"
                  desc="We uphold the highest standards of privacy, accuracy, and stewardship of resources."
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c.667 0 2 1.333 2 2s-1.333 2-2 2-2-1.333-2-2 1.333-2 2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.54 6.36l-1.42-1.42M7.88 6.46L6.46 5.04" />
                  </svg>
                </ValueCard>

                <ValueCard
                  title="Innovation"
                  desc="We embrace modern technology to continuously improve access and discovery."
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </ValueCard>
              </div>
            </div>

            <div className="mt-10">
              <div className="text-sm text-blue-300 uppercase tracking-wide font-semibold mb-4">
                Meet The Team
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <TeamCard name="Dr. Eleanor Hayes" role="Chief Librarian" initials="EH" />
                <TeamCard name="Marcus Lane" role="Senior Cataloger" initials="ML" />
                <TeamCard name="Priya Sharma" role="Digital Resources Lead" initials="PS" />
                <TeamCard name="James Okafor" role="Member Services" initials="JO" />
              </div>
            </div>
          </div>

          <div className="w-96 hidden lg:block">
            <div className="sticky top-8 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-slate-800 to-slate-700">
              <img src={libraryImg} alt="Library" className="w-full h-96 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
