import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientHome from './PatientHome';
import DoctorHome from './DoctorHome';
import Admin from '../Admin/Admin';
import LoadingScreen from '../Ui/LoadingScreen';
import SuperAdminHome from './SuperAdminHome';


const Home = () => {
  const { role } = useAuth();

  if (!role || role.length === 0) {
      return <LoadingScreen />;
  }

  return (
      <div>
          {role.includes("patient") ? (
              <PatientHome />
          ) : role.includes("doctor") ? (
              <DoctorHome />
          ) : role.includes("admin") ? (
              <Admin />
          ) : 
            role.includes("superadmin") ? (
              <SuperAdminHome />
          ) : (
              <p>Please log in as a patient or doctor to view your dashboard.</p>
          )}
      </div>
  );
};

export default Home;
