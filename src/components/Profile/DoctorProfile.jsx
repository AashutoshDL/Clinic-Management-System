import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../Ui/LoadingScreen';

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

  // Fetch Doctor Data
  const fetchDoctorData = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorResponse = await axios.get(`http://localhost:3001/doctor/getDoctorById/${userId}`, {
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
      setAvailableTimes(doctor.availableTimes || []); // Set available times
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

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const doctorData = {
      specialization,
      information,
      dutyTime: {
        from: dutyTimeFrom,
        to: dutyTimeTo,
      },
      availableTimes, // Include available times in the profile update
    };

    try {
      const response = await axios.post(
        `http://localhost:3001/doctor/editProfile/${userId}`,
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

  // Handle adding available time range
  const handleAddAvailableTime = () => {
    if (newAvailableTimeFrom && newAvailableTimeTo) {
      setAvailableTimes([...availableTimes, { from: newAvailableTimeFrom, to: newAvailableTimeTo }]);
      setNewAvailableTimeFrom(''); // Reset from input field
      setNewAvailableTimeTo(''); // Reset to input field
    }
  };

  // Handle deleting an available time slot
  const handleDeleteAvailableTime = (index) => {
    const updatedAvailableTimes = availableTimes.filter((_, i) => i !== index);
    setAvailableTimes(updatedAvailableTimes);
  };

  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center">You need to log in to view your profile.</div>;
  }

  if (loading) return <LoadingScreen />;

  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-xl text-red-600">{error}</p></div>;
  }

  const handleLogOut = async () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {isEditing ? (
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
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={newAvailableTimeFrom}
                      onChange={(e) => setNewAvailableTimeFrom(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="From"
                    />
                    <input
                      type="time"
                      value={newAvailableTimeTo}
                      onChange={(e) => setNewAvailableTimeTo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="To"
                    />
                    <button
                      type="button"
                      onClick={handleAddAvailableTime}
                      className="bg-blue-500 text-white p-2 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2">
                    {availableTimes.length > 0 && (
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {availableTimes.map((time, index) => (
                          <li key={index} className="flex items-center justify-between">
                            {`${time.from} - ${time.to}`}
                            <button
                              type="button"
                              onClick={() => handleDeleteAvailableTime(index)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
                >
                  Save Doctor
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl font-bold">
                {doctorData.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold mt-4">{doctorData.name}</h2>
              <p className="text-gray-600 text-sm">{doctorData.role}</p>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-600"><strong>Email:</strong> {doctorData.email}</p>
              <p className="text-sm text-gray-600"><strong>Specialization:</strong> {doctorData.specialization || 'Not provided'}</p>
              <p className="text-sm text-gray-600"><strong>Information:</strong> {doctorData.information || 'Not provided'}</p>
              <p className="text-sm text-gray-600"><strong>Duty Time:</strong> {doctorData.dutyTime ? `${doctorData.dutyTime.from} - ${doctorData.dutyTime.to}` : 'Not set'}</p>
              <p className="text-sm text-gray-600"><strong>Available Times:</strong> {doctorData.availableTimes.length > 0 ? doctorData.availableTimes.map(time => `${time.from} - ${time.to}`).join(', ') : 'None'}</p>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                onClick={handleLogOut}
              >
                Log Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
