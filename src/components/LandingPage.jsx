import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Clinic Management System
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Streamline your clinic management with ease. Schedule, track, and manage appointments all in one place.
        </p>

        {/* Sign In As Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            Who are you ?
          </h2>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Patient
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Doctor
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Lab-Tech
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
