import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientHome from './PatientHome';
import AdminHome from './AdminHome';
import DoctorHome from './DoctorHome';
import SuperadminDashboard from '../Superadmin/SuperadminDashboard';

const Home = () => {
  const { role } = useAuth();

//   console.log("User Roles:", role); // Debugging

  if (!role || role.length === 0) {
      return <p>Loading...</p>;
  }

  return (
      <div>
          {role.includes("patient") ? (
              <PatientHome />
          ) : role.includes("doctor") ? (
              <DoctorHome />
          ) : role.includes("admin") ? (
              <AdminHome />
          ) : 
            role.includes("superadmin") ? (
              <SuperadminDashboard />
          ) : (
              <p>Please log in as a patient or doctor to view your dashboard.</p>
          )}
      </div>
  );
};

export default Home;
