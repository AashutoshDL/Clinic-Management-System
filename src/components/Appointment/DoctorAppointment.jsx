import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorAppointment = () => {
  const { userId, role } = useAuth();  // Get user data (assuming role is 'doctor')
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');  // State for search query
  const navigate = useNavigate();  // For navigation

  // Dummy appointments data
  const dummyAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      specialization: 'Cardiology',
      time: '1:00 PM',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      specialization: 'Dermatology',
      time: '10:00 AM',
    },
    {
      id: 3,
      patientName: 'Alex Johnson',
      specialization: 'Orthopedics',
      time: '3:00 PM',
    },
  ];

  // Fetch dummy appointments
  const fetchAppointments = () => {
    // Simulating API call
    setAppointments(dummyAppointments);
  };

  // Handle rescheduling the appointment
  const handleReschedule = (appointmentId, newTime) => {
    // Simulating rescheduling
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, time: newTime } : appointment
    );
    setAppointments(updatedAppointments);
    alert('Appointment rescheduled successfully!');
  };

  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId) => {
    // Simulating cancellation
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== appointmentId);
    setAppointments(updatedAppointments);
    alert('Appointment canceled successfully!');
  };

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchAppointments();  // Load dummy appointments
  }, [role]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Your Appointments</h1>

      {/* Search Bar */}
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

      {/* Display Appointments */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Your Scheduled Appointments</h2>
        {filteredAppointments.length > 0 ? (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white shadow-md p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800">{appointment.patientName}</h3>
                <p className="text-gray-600">Specialization: {appointment.specialization}</p>
                <p className="text-gray-500 mt-3">Scheduled Time: {appointment.time}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleReschedule(appointment.id, '10:00 AM')} // Example reschedule to '10:00 AM'
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancelAppointment(appointment.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No appointments found</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointment;
