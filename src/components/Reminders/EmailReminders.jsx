import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const EmailReminders = () => {
  const { userId, isLoggedIn, role } = useAuth();
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchReminders();
    }
  }, [userId]);

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/reminder/getAllReminders/${userId}`);
      setReminders(response.data);
    } catch (error) {
      console.error("Error fetching reminders:", error.response?.data?.message || error.message);
      alert("Error fetching reminders. Try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn || !reminderTime || !reminderMessage) {
      alert('Please fill in all fields and log in.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/reminder/emailReminder/${userId}`,
        { reminderTime, reminderMessage, role: [role] },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setReminderTime('');
        setReminderMessage('');
        fetchReminders();
        alert('Reminder set successfully!');
      } else {
        alert('Failed to set reminder.');
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert('Error setting reminder.');
    }
  };

  const cancelReminder = async (reminderTime, reminderMessage) => {
    try {
      const response = await axios.post(`http://localhost:3001/reminder/cancelReminder/${userId}`, {
        reminderTime,
        reminderMessage,
      });

      if (response.status === 200) {
        setReminders((prev) => prev.filter(
          (reminder) => reminder.reminderTime !== reminderTime || reminder.reminderMessage !== reminderMessage
        ));
        alert('Reminder cancelled successfully!');
      } else {
        alert('Failed to cancel reminder.');
      }
    } catch (error) {
      console.error('Error canceling reminder:', error);
      alert('Error canceling reminder.');
    }
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    const timeA = new Date();
    const timeB = new Date();
    timeA.setHours(...a.reminderTime.split(':').map(Number), 0);
    timeB.setHours(...b.reminderTime.split(':').map(Number), 0);
    return timeA - timeB;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Set Email Reminder</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Reminder Time (HH:mm)</label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Reminder Message</label>
            <textarea
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              rows="4"
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              style={{ maxHeight: '200px', overflowY: 'auto' }}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 w-full"
          >
            Set Reminder
          </button>
        </form>

        {reminders.length > 0 ? (
          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Your Reminders</h3>
            {sortedReminders.map((reminder) => (
              <div
                key={`${reminder.reminderTime}-${reminder.reminderMessage}`}
                className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center border border-gray-200 hover:shadow-lg transition"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{reminder.reminderTime}</p>
                  <p className="text-gray-600">{reminder.reminderMessage}</p>
                </div>
                <button
                  onClick={() => cancelReminder(reminder.reminderTime, reminder.reminderMessage)}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-600">
            <p>No Reminders Set</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailReminders;