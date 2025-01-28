import React from 'react';
import PatientAppointment from './PatientAppointment'; // Assuming you have this component
import DoctorAppointment from './DoctorAppointment';

const Appointment = () => {
  const role = 'patient';  // This will come from your AuthContext or similar

  return (
    <div>
      {role === 'patient' ? (
        <PatientAppointment />  // Render PatientAppointment if the role is 'patient'
      ) : role === 'doctor' ? (
        <DoctorAppointment />  // Render DoctorAppointments if the role is 'doctor'
      ) : (
        <p>Please log in as either a patient or doctor.</p>  // Display this if no valid role is provided
      )}
    </div>
  );
};

export default Appointment;
