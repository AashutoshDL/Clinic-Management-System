import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
      <h2 className="text-zinc-900 dark:text-black mt-4">Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
  