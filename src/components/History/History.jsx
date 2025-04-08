import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import DoctorHistory from './DoctorHistory';
import PatientHistory from './PatientHistory';
import CreatePatientHistory from './CreatePatientHistory';
import LoadingScreen from '../Ui/LoadingScreen';

const History = () => {
  const { role } = useAuth();

//   console.log("User Roles:", role); // Debugging

  if (!role || role.length === 0) {
      return <LoadingScreen />;
  }

  return (
      <div>
          {role.includes("patient") ? (
              <PatientHistory />
          ) : role.includes("doctor") ? (
              <DoctorHistory />
          ) : role.includes("admin") ? (
              <CreatePatientHistory />
          ) : (
              <p>Please log in as a patient or doctor to view your profile.</p>
          )}
      </div>
  );
};

export default History;
