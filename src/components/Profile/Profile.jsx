import React, { useContext } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import PatientProfile from './PatientProfile'; // Assuming you have a PatientProfile component
import DoctorProfile from './DoctorProfile'; // Assuming you have a DoctorProfile component

const Profile = () => {
    const { role } = useAuth(); // Access token from context
    // const role='patient';
  

  return (
    <div>
      {role === 'patient' ? (
        <PatientProfile /> // Render PatientProfile if the role is 'patient'
      ) : role === 'doctor' ? (
        <DoctorProfile /> // Render DoctorProfile if the role is 'doctor'
      ) : (
        <p>Please log in as a patient or doctor to view your profile.</p> // Message for other roles
      )}
    </div>
  );
};

export default Profile;
