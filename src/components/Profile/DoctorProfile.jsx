import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../Ui/LoadingScreen';
import axiosInstance from '../service/axiosInterceptor';
import { baseURL } from '../service/baseURL';

const DoctorProfile = () => {
  const { userId, isLoggedIn, accessToken, logout } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [specialization, setSpecialization] = useState('');
  const [information, setInformation] = useState('');
  const [dutyTimeFrom, setDutyTimeFrom] = useState('');
  const [dutyTimeTo, setDutyTimeTo] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [newAvailableTimeFrom, setNewAvailableTimeFrom] = useState('');
  const [newAvailableTimeTo, setNewAvailableTimeTo] = useState('');
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  const fetchDoctorData = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorResponse = await axiosInstance.get(`/doctor/getDoctorById/${userId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        withCredentials: true,
      });

      const doctor = doctorResponse.data.doctor;
      setDoctorData(doctor);

      if (doctor.dutyTime) {
        setDutyTimeFrom(doctor.dutyTime.from || '');
        setDutyTimeTo(doctor.dutyTime.to || '');
      } else {
        setDutyTimeFrom('');
        setDutyTimeTo('');
      }
      setSpecialization(doctor.specialization || '');
      setInformation(doctor.information || '');
      setAvailableTimes(doctor.availableTimes || []);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      setError('Failed to load doctor data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && isLoggedIn) {
      fetchDoctorData();
    }
  }, [userId, isLoggedIn, accessToken]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const doctorData = {
      specialization,
      information,
      dutyTime: {
        from: dutyTimeFrom,
        to: dutyTimeTo,
      },
      availableTimes,
    };

    try {
      const response = await axios.post(
        `${baseURL}/doctor/editProfile/${userId}`,
        doctorData,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        }
      );
      console.log('Doctor Data Saved:', response.data);
      alert('Doctor information updated successfully!');
      setDoctorData(response.data.doctor);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving doctor data:', error);
      setFormError('Failed to save doctor data. Please try again later.');
    }
  };

  const handleAddAvailableTime = () => {
    if (newAvailableTimeFrom && newAvailableTimeTo) {
      setAvailableTimes([...availableTimes, { from: newAvailableTimeFrom, to: newAvailableTimeTo }]);
      setNewAvailableTimeFrom('');
      setNewAvailableTimeTo('');
    }
  };

  const handleDeleteAvailableTime = (index) => {
    const updatedAvailableTimes = availableTimes.filter((_, i) => i !== index);
    setAvailableTimes(updatedAvailableTimes);
  };

  const handleLogOut = async () => {
    logout();
    navigate('/');
  };

  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center">You need to log in to view your profile.</div>;
  }

  if (loading) return <LoadingScreen />;

  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-xl text-red-600">{error}</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {}
        <div className="bg-gradient-to-r from-orange-300 via-pink-400 to-blue-500 p-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-4xl font-bold mb-4">
              {doctorData.name?.charAt(0).toUpperCase() || 'D'}
            </div>
            <h1 className="text-2xl font-bold text-white">{doctorData.name}</h1>
            <p className="text-white opacity-90">{doctorData.role || 'doctor'}</p>
            
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-md"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogOut}
                className="bg-white text-red-500 px-4 py-2 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {}
        <div className="p-6">
          <div className="flex items-center mb-4">
          <svg className="w-5 h-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <h2 className="text-xl font-semibold">Doctor Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{doctorData.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="text-lg font-medium">{doctorData.specialization || 'Not provided'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Duty Time</p>
              <p className="text-lg font-medium">
                {doctorData.dutyTime ? `${doctorData.dutyTime.from} - ${doctorData.dutyTime.to}` : 'Not set'}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>{doctorData.information || 'No information provided'}</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Available Times</h3>
            {doctorData.availableTimes && doctorData.availableTimes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {doctorData.availableTimes.map((time, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-md">
                    <p className="text-lg font-medium">{time.from} - {time.to}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                <p>No available times set</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Doctor Information</h2>

            {formError && <p className="text-red-500">{formError}</p>}

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-4">
                <label htmlFor="specialization" className="block text-gray-700">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="information" className="block text-gray-700">Information</label>
                <textarea
                  id="information"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter doctor information"
                  value={information}
                  onChange={(e) => setInformation(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="duty-time" className="block text-gray-700">Duty Time</label>
                <div className="flex space-x-4">
                  <input
                    type="time"
                    className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dutyTimeFrom}
                    onChange={(e) => setDutyTimeFrom(e.target.value)}
                  />
                  <input
                    type="time"
                    className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dutyTimeTo}
                    onChange={(e) => setDutyTimeTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="available-times" className="block text-gray-700">Available Times</label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="time"
                    value={newAvailableTimeFrom}
                    onChange={(e) => setNewAvailableTimeFrom(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={newAvailableTimeTo}
                    onChange={(e) => setNewAvailableTimeTo(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAvailableTime}
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    Add
                  </button>
                </div>
                {availableTimes.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {availableTimes.map((time, index) => (
                        <li key={index} className="py-2 flex items-center justify-between">
                          <span>{time.from} - {time.to}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteAvailableTime(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;