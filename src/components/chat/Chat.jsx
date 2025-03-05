import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext
import UserChat from './UserChat';
import DoctorChat from './DoctorChat'

const Chat = () => {
  const { role } = useAuth();

  console.log("User Roles:", role);

  if (!role || role.length === 0) {
      return <p>Loading...</p>;
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
