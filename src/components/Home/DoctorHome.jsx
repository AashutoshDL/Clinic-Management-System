import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../service/axiosInterceptor';

const DoctorHome = () => {
  const { isLoggedIn, userId } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await axiosInstance.get(`/appointments/getAppointmentsById/${userId}`);
          setAppointments(response.data.appointments);
        } catch (error) {
          console.error("Error fetching appointments:", error);
        }
      }
    };

    fetchAppointments();
  }, [isLoggedIn, userId]);

  const handleConfirmAppointment = (appointmentId) => {
    alert(`Appointment ID ${appointmentId} confirmed.`);
  };

  return (
    <div className="bg-buttonGray min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Doctor Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="flex flex-col gap-6">
          {/* Appointments Section */}
          <div className="w-full">
            {isLoggedIn ? (
              <>
                <h2 className="text-white text-3xl mb-6">Welcome, Doctor!</h2>
                <div className="appointments">
                  <h3 className="text-white text-xl mb-4">Upcoming Appointments</h3>
                  {appointments.length > 0 ? (
                    <ul className="space-y-4">
                      {appointments.map((appointment) => (
                        <li key={appointment._id}>
                          <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold">Patient: {appointment.patientName}</h2>
                            <p className="text-gray-600">Scheduled Time: {appointment.time}</p>
                            <p className="text-gray-500">Issue: {appointment.issue}</p>
                            <button
                              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                              onClick={() => handleConfirmAppointment(appointment._id)}
                            >
                              Confirm Appointment
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <p className="text-gray-700">No upcoming appointments.</p>
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

export default DoctorHome;