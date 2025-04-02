import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../service/baseURL';

const DoctorAppointment = () => {
  const { userId, role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${baseURL}/appointments/getAppointmentsById/${userId}`);
      if (!response.data || !response.data.appointments) {
        console.log("No appointments received from API.");
        return;
      }

      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [role, userId]);

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      const response = await axios.patch(
        `${baseURL}/appointments/confirmAppointment/${appointmentId}`,
      );
      
      if (response.data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, status: 'Confirmed' }
              : appointment
          )
        );
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) => 
      appointment.status === "Pending" &&
      appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Pending Appointments</h1>

      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-10 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-3 text-gray-500">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>

      <div>
        {filteredAppointments.length > 0 ? (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="bg-white shadow-md p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800">{appointment.patientName}</h3>
                <h3 className="text-xl font-semibold text-gray-800">{appointment.patientId}</h3>
                <p className="text-gray-500 mt-3">Scheduled Time: {appointment.time}</p>
                <p className="text-gray-500 mt-1">Status: {appointment.status}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleConfirmAppointment(appointment._id)}
                    className="bg-buttonGrayDark text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-center">No pending appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;