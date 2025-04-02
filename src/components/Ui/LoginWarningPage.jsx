import React from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const LoginWarningPage = () => {
    const navigate=useNavigate();
  const handleLoginClick = () => {
navigate('/login')
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred overlay background */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-4 pointer-events-none">
        <div 
          className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center
                     animate-fade-in transform transition-all duration-300"
        >
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Oops! You're not logged in
          </h2>
          
          <p className="text-gray-600 mb-8">
            Please sign in to access this page and explore all features.
          </p>
          
          <button
            onClick={handleLoginClick}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium
                     hover:bg-indigo-700 transition-colors duration-200 flex items-center 
                     justify-center gap-2 pointer-events-auto shadow-lg
                     hover:shadow-indigo-100"
          >
            <LogIn className="w-5 h-5" />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginWarningPage;