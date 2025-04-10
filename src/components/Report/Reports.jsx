import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import ReportViewing from './ReportViewing';
import ReportGeneration from './ReportGeneration';
import ReportSharing from './ReportSharing';
import DoctorReport from './DoctorReport';
import LoadingScreen from '../Ui/LoadingScreen';

const Report = () => {
  const { role } = useAuth();

  if (!role || role.length === 0) {
      return <LoadingScreen />;
  }

  return (
      <div>
          {role.includes("patient") ? (
              <ReportViewing />
          ) : role.includes("doctor") ? (
              <DoctorReport />
        ) : role.includes("admin") ? (
              <ReportSharing />
          ) : 
            role.includes("superadmin") ? (
              <ReportGeneration />
          ) : (
              <p>Please log in as a patient or doctor to view this page.</p>
          )}
      </div>
  );
};

export default Report;
