import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Home = () => {
  const { isLoggedIn, userId } = useAuth();  // Access authentication state from context
  const [appointments, setAppointments] = useState([]);
  
  // Fetch appointments for the logged-in user
  useEffect(() => {
    const fetchAppointments = async () => {
      if (isLoggedIn && userId) {
        try {
          // Assuming you have an API endpoint to fetch appointments by user ID
          const response = await axios.get(`http://localhost:3001/appointments/getAppointmentsById/${userId}`);
          setAppointments(response.data.appointments);  // Store fetched appointments
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };

    fetchAppointments();  // Trigger the fetch function
  }, [isLoggedIn, userId]);

  return (
    <div className='bg-buttonGray min-h-screen flex flex-col items-center justify-center'>
      {isLoggedIn ? (
        <>
          <h1 className="text-white text-3xl mb-6">Welcome!</h1>
          
          {/* Display appointments */}
          <div className="appointments">
            {appointments.length > 0 ? (
              <ul className="text-white">
                {appointments.map((appointment) => (
                  <li key={appointment.id} className="mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h2 className="text-xl font-semibold">{appointment.patientName}</h2>
                      <p className="text-gray-600">Scheduled Time: {appointment.time}</p>
                      <p className="text-gray-500">Specialization: {appointment.specialization}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white">You have no upcoming appointments.</p>
            )}
          </div>
        </>
      ) : (
        <h1 className="text-white text-3xl">Please log in to continue.</h1>
      )}
    </div>
  );
};

export default Home;
