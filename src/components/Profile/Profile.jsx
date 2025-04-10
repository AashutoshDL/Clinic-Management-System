import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientProfile from './PatientProfile'; 
import DoctorProfile from './DoctorProfile'; 
import SuperAdminHome from '../Home/SuperAdminHome';

const Profile = () => {
  const { role } = useAuth();

  if (!role || role.length === 0) {
      return <p>Loading...</p>;
  }

  return (
      <div>
          {role.includes("patient") ? (
              <PatientProfile />
          ) : role.includes("doctor") ? (
              <DoctorProfile />
          ) : role.includes("superadmin") ? (
              <SuperAdminHome />
          ) : (
              <p>Please log in as a patient or doctor to view your profile.</p>
          )}
      </div>
  );
};

export default Profile;
