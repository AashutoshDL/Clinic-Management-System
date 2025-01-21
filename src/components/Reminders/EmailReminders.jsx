import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EmailReminders = () => {
  const { userId, isLoggedIn } = useAuth();
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [savedReminder, setSavedReminder] = useState(null);
  const [reminders, setReminders] = useState([]);  // New state for storing reminders

  // Fetch reminders for the user on component mount
  useEffect(() => {
    if (isLoggedIn) {
      fetchReminders();
    }
  }, [isLoggedIn]);

  const fetchReminders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/reminder/getAllReminders/${userId}`
      );
      setReminders(response.data);  // Set the fetched reminders in state
      console.log(response.data);  // Set the fetched reminders in state
    } catch (error) {
      console.error('Error fetching reminders:', error);
      alert('Failed to load reminders.');
    }
  };

  const handleTimeChange = (e) => {
    let time = e.target.value;

    // Ensure time is in HH:mm format (24-hour format)
    const timeParts = time.split(':');
    if (timeParts.length === 2) {
      const [hour, minute] = timeParts;

      // Ensure hour is 2 digits and minute is 2 digits
      const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
      setReminderTime(formattedTime);
    }
  };

  const handleMessageChange = (e) => {
    setReminderMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user is logged in and all fields are filled
    if (!isLoggedIn || !reminderTime || !reminderMessage) {
      alert('Please fill in all fields and log in.');
      return;
    }

    const reminderData = {
      userId, // Send the userId from context
      reminderTime,
      reminderMessage,
    };

    // Call the backend API to set the reminder using axios
    try {
      const response = await axios.post(
        `http://localhost:3001/reminder/emailReminder/${userId}`,
        reminderData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setSavedReminder({ time: reminderTime, message: reminderMessage });
        setReminderTime('');
        setReminderMessage('');
        setIsReminderSet(true);
        alert('Reminder set successfully!');
        fetchReminders();  // Refresh the list of reminders after setting one
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
      // Send POST request to cancel the specific reminder by userId, reminderTime, and reminderMessage
      await axios.post(`http://localhost:3001/reminder/cancelReminder/${userId}`, {
        reminderTime,
        reminderMessage,
      });

      // Remove the canceled reminder from the UI (state)
      setReminders((prevReminders) =>
        prevReminders.filter(
          (reminder) =>
            reminder.reminderTime !== reminderTime || reminder.reminderMessage !== reminderMessage
        )
      );

      alert('Reminder canceled successfully!');
    } catch (error) {
      console.error('Error canceling reminder:', error);
      alert('Error canceling reminder.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Set Email Reminder</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Reminder Time (HH:mm)</label>
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
        </form>

        {isReminderSet && savedReminder && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Current Reminder</h3>
            <p>
              <strong>Time:</strong> {savedReminder.time}
            </p>
            <p>
              <strong>Message:</strong> {savedReminder.message}
            </p>
            <button
              onClick={() =>
                cancelReminder(savedReminder.time, savedReminder.message)  // Cancel the saved reminder
              }
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Cancel Reminder
            </button>
          </div>
        )}

        {/* Display all reminders */}
        {reminders.length > 0 && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Your Reminders</h3>
            {reminders.map((reminder) => (
              <div key={`${reminder.reminderTime}-${reminder.reminderMessage}`} className="mb-4">
                <p><strong>Time:</strong> {reminder.reminderTime}</p>
                <p><strong>Message:</strong> {reminder.reminderMessage}</p>
                <button
                  onClick={() =>
                    cancelReminder(reminder.reminderTime, reminder.reminderMessage)  // Cancel the specific reminder
                  }
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                >
                  Cancel Reminder
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailReminders;