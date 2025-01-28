import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../Ui/LoadingScreen';

const Profile = () => {
  const { userId, isLoggedIn, accessToken, logout } = useAuth(); // Access token from context
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Send token in the Authorization header
        const response = await axios.get(`http://localhost:3001/user/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Include the token here
          },
          withCredentials: true, // Include credentials (cookies)
        });
        setProfileData(response.data.user);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfileData();
  }, [userId, accessToken]); // Include accessToken as a dependency

  const handleLogOut = async () => {
    try {
      // Call the API to log out and clear cookies on the server
      await axios.post('http://localhost:3001/auth/logout', {
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include the token here
        },
      withCredentials: true,
    });
    } catch (error) {
      console.error('Error during logout:', error);
    }
    logout(); // Clear local state
    navigate('/login'); // Redirect to login page
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">You need to log in to view your profile.</h1>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (!profileData) {
    return <div className="min-h-screen flex items-center justify-center">Error loading profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
            {profileData?.firstName?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-semibold mt-4">{profileData.firstName}</h2>
          <p className="text-gray-600 text-sm">{profileData.role}</p>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            onClick={() => navigate('/edit-profile')}
          >
            Edit Profile
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
