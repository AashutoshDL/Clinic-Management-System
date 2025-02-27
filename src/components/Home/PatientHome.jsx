import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import PatientProfile from '../Profile/PatientProfile';

const PatientHome = () => {
  const { isLoggedIn, userId } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await axios.get(`http://localhost:3001/appointments/getAppointmentsById/${userId}`);
          setAppointments(response.data.appointments);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };

    fetchAppointments();
  }, [isLoggedIn, userId]);

  const handleSetReminder = (appointmentId) => {
    alert(`Reminder set for appointment ID: ${appointmentId}`);
    // Implement reminder functionality here
  };

  return (
    <div className="bg-buttonGray min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Patient Dashboard</h1>
      </header>

      {/* Main content - vertical layout */}
      <div className="flex-grow p-6">
        <div className="flex flex-col gap-6">
          {/* Profile section - always at the top */}
          <div className="w-full">
            <PatientProfile />
          </div>

          {/* Appointments section - always below profile */}
          <div className="w-full">
            {isLoggedIn ? (
              <>
                <h2 className="text-white text-3xl mb-6">Welcome!</h2>
                <div className="appointments">
                  <h3 className="text-white text-xl mb-4">Upcoming Appointments</h3>
                  {appointments.length > 0 ? (
                    <ul className="space-y-4">
                      {appointments.map((appointment) => (
                        <li key={appointment.id}>
                          <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">{appointment.patientName}</h2>
                            <p className="text-gray-600">Scheduled Time: {appointment.time}</p>
                            <p className="text-gray-500">Specialization: {appointment.specialization}</p>
                            <button 
                              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                              onClick={() => handleSetReminder(appointment.id)}
                            >
                              Set Reminder
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <p className="text-gray-700">You have no upcoming appointments.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <h1 className="text-white text-3xl">Please log in to continue.</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;