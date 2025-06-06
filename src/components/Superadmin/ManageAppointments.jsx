import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingScreen from '../Ui/LoadingScreen';
import { baseURL } from '../service/baseURL';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);  
  const [expanded, setExpanded] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/appointments/getAllAppointments`);
      setAppointments(response.data.appointments || []);  
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await axios.delete(`${baseURL}/appointments/cancelAppointmentById/${id}`);
      setAppointments(appointments.filter(appointment => appointment._id !== id));  
      alert('Appointment canceled successfully');
    } catch (error) {
      setError('Failed to cancel appointment');
      console.error('Error canceling appointment:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleToggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);  
  };

  if (loading) {
    return <LoadingScreen />;  
  }

  if (error) {
    return <div>{error}</div>;  
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Appointments</h1>

      <div className="space-y-4">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
              onClick={() => handleToggleExpand(appointment._id)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{appointment.patientName}</h2>
                <p className="text-sm text-gray-600">{appointment.date}</p>
              </div>

              <p className="text-gray-500 mt-2">Doctor: {appointment.doctorName}</p>
              <p className="text-gray-500">Time: {appointment.time}</p>
              <p className="text-gray-500">Status: <span className={appointment.status === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'}>{appointment.status}</span></p>

              {}
              <button
                onClick={(e) => {
                  e.stopPropagation();  
                  cancelAppointment(appointment._id);
                }}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
              >
                Cancel Appointment
              </button>

              {}
              {expanded === appointment._id && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                  <p><strong>Patient ID:</strong> {appointment.patientId}</p>
                  <p><strong>Doctor ID:</strong> {appointment.doctorId}</p>
                  <p><strong>Created At:</strong> {new Date(appointment.createdAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No appointments available</div>  
        )}
      </div>
    </div>
  );
};

export default ManageAppointments;
