import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50">
      <div className="text-center p-6 rounded-lg">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-yellow-500 mx-auto"></div>
        <h2 className="text-zinc-900 dark:text-zinc-100 mt-4 font-medium">Loading...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
