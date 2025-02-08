import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const EmailReminders = () => {
  const { userId, isLoggedIn } = useAuth();
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
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
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          console.log(error.response.data.message);
        } else {
          console.log("Server could not fetch data");
        }
      } else {
        // No response
        console.error("Error fetching reminders", error);
        alert("Internal Server Error");
      }
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
        setReminderTime('');
        setReminderMessage('');
        fetchReminders();  // Refresh the list of reminders after setting one
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

  // Sort reminders by reminderTime to show the most recent one first
  const sortedReminders = reminders.sort((a, b) => {
    return new Date(`1970-01-01T${b.reminderTime}:00Z`) - new Date(`1970-01-01T${a.reminderTime}:00Z`);
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
              onChange={handleTimeChange}
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Reminder Message</label>
            <textarea
              value={reminderMessage}
              onChange={handleMessageChange}
              rows="4"
              className="mt-1 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                overflowY: 'auto',  // Allows scrolling when content exceeds box
                wordWrap: 'break-word',  // Ensures long words break and don't overflow
                maxHeight: '200px',  // Sets max height to prevent the textarea from growing indefinitely
                resize: 'vertical',  // Restricts the resize to vertical only
              }}
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-buttonGray text-white py-3 px-6 rounded-lg hover:bg-buttonGrayDark transition duration-300 w-full"
          >
            Set Reminder
          </button>
        </form>

        {/* Display all reminders */}
          {reminders.length > 0 ? (
            <div className="mt-8 space-y-6">
              <h3 className="text-xl font-semibold text-gray-800">Your Reminders</h3>
              {sortedReminders.map((reminder, index) => (
                <div
                  key={`${reminder.reminderTime}-${reminder.reminderMessage}`}
                  className="p-6 bg-white shadow-sm rounded-lg flex justify-between items-center border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-semibold text-gray-600">{index + 1}</div>
                    <div>
                      <p className="text-gray-800 font-medium">{reminder.reminderTime}</p>
                      <p className="text-gray-600">{reminder.reminderMessage}</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      cancelReminder(reminder.reminderTime, reminder.reminderMessage)  // Cancel the specific reminder
                    }
                    className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 text-center text-gray-600">
              <p>No Reminder Set</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default EmailReminders;
