import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import UserChat from './UserChat';
import DoctorChat from './DoctorChat'
import LoadingScreen from '../Ui/LoadingScreen'

const Chat = () => {
  const { role } = useAuth();
  
  if (!role || role.length === 0) {
      return <LoadingScreen />;
  }

  return (
      <div>
          {role.includes("patient") ? (
              <UserChat />
          ) : role.includes("doctor") ? (
              <DoctorChat />
          ) : (
              <p>Please log in as a patient or doctor to view your profile.</p>
          )}
      </div>
  );
};

export default Chat;
