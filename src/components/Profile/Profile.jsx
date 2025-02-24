import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext
import PatientProfile from './PatientProfile'; // Assuming you have a PatientProfile component
import DoctorProfile from './DoctorProfile'; // Assuming you have a DoctorProfile component
import SuperadminDashboard from '../Superadmin/SuperadminDashboard';

const Profile = () => {
  const { role } = useAuth(); // role is an array

//   console.log("User Roles:", role); // Debugging

  if (!role || role.length === 0) {
      return <p>Loading...</p>; // Handle case where role is undefined or empty
  }

  return (
      <div>
          {role.includes("patient") ? (
              <PatientProfile />
          ) : role.includes("doctor") ? (
              <DoctorProfile />
          ) : role.includes("superadmin") ? (
              <SuperadminDashboard />
          ) : (
              <p>Please log in as a patient or doctor to view your profile.</p>
          )}
      </div>
  );
};

export default Profile;
