import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate=useNavigate();
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-6 md:px-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to CMS
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Streamline your clinic management with ease. Schedule, track, and manage appointments all in one place.
        </p>
        <div>
          <button onClick={()=>{navigate('/register')}}className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg mr-4">
            Get Started
          </button>
          <button className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
