import React, { useContext } from 'react';
import { useAuth } from '../../context/AuthContext'; // Assuming you have an AuthContext
import UserChat from './UserChat';

const Chat = () => {
  const { role } = useAuth(); // role is an array

  console.log("User Roles:", role); // Debugging

  if (!role || role.length === 0) {
      return <p>Loading...</p>; // Handle case where role is undefined or empty
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
