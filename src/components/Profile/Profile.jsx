import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
            A
          </div>
          <h2 className="text-xl font-semibold mt-4">John Doe</h2>
          <p className="text-gray-600 text-sm">Software Engineer</p>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">About</h3>
          <p className="text-gray-600 mt-2 text-sm">
            Passionate developer with experience in building scalable web applications. Always eager to learn and explore new technologies.
          </p>
        </div>
        <div className="mt-6 flex justify-between">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
            Edit Profile
          </button>
          <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
