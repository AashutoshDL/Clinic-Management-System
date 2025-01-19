import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const EmailReminders = () => {
  const { user, isLoggedIn } = useAuth();
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [isReminderSet, setIsReminderSet] = useState(false);

  const handleTimeChange = (e) => {
    setReminderTime(e.target.value);
  };

  const handleMessageChange = (e) => {
    setReminderMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user is logged in and all fields are filled
    if (!isLoggedIn || !reminderTime || !reminderMessage) {
      alert("Please fill in all fields and log in.");
      return;
    }

    const reminderData = {
      userId: user.id,  // Send the userId from context
      reminderTime,
      reminderMessage,
    };

    // Call the backend API to set the reminder
    try {
      const response = await fetch('http://localhost:3001/reminder/emailReminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminderData),
      });

      if (response.ok) {
        setIsReminderSet(true);
        alert("Reminder set successfully!");
      } else {
        alert("Failed to set reminder.");
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert("Error setting reminder.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Set Email Reminder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Reminder Time</label>
            <input
              type="time"
              value={reminderTime}
              onChange={handleTimeChange}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700">Reminder Message</label>
            <textarea
              value={reminderMessage}
              onChange={handleMessageChange}
              rows="4"
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Set Reminder
          </button>

          {isReminderSet && (
            <p className="text-green-600 mt-4">Reminder has been set successfully!</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmailReminders;
