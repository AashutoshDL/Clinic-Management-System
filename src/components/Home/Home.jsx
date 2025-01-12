import React from 'react';
import { useAuth } from '../context/AuthContext';  // Import the useAuth hook

const Home = () => {
  const { isLoggedIn, user } = useAuth();  // Access authentication state from context

  return (
    <div className='bg-buttonGray min-h-screen flex flex-col items-center justify-center'>
      {isLoggedIn ? (
        <h1 className="text-white text-3xl">Welcome, {user?.name}!</h1>
      ) : (
        <h1 className="text-white text-3xl">Please log in to continue.</h1>
      )}
    </div>
  );
};

export default Home;
