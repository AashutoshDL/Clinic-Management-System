import React, { useState, useEffect } from 'react';

const Reminders = () => {
  const [reminderTime, setReminderTime] = useState('12:00'); // Default time (hh:mm format)
  const [reminderMessage, setReminderMessage] = useState(''); // Default message
  const [reminders, setReminders] = useState([]); // Array to store multiple reminders
  const [editingIndex, setEditingIndex] = useState(null); // To track which reminder is being edited

  // Request Notification permission on mount
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }, []);

  // Function to calculate the time difference
  const calculateTimeDifference = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderDate = new Date(now);

    reminderDate.setHours(hours, minutes, 0, 0); // Set the selected time

    // If the reminder time is in the past for today, set it for the next day
    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    return reminderDate.getTime() - now.getTime(); // Time difference in milliseconds
  };

  // Function to add a reminder
  const addReminder = () => {
    const timeDifference = calculateTimeDifference(reminderTime);

    if (timeDifference > 0 && Notification.permission === 'granted') {
      const newReminder = { time: reminderTime, message: reminderMessage };

      setReminders((prevReminders) => [...prevReminders, newReminder]);

      setTimeout(() => {
        new Notification('Reminder', {
          body: reminderMessage, // Use the custom message entered by the user
          icon: '/images/2-nobg.png', // Optional: Set an icon here
        });
      }, timeDifference);

      setReminderMessage(''); // Clear the message field after setting reminder
    } else {
      alert('Please set a valid reminder time and allow notifications.');
    }
  };

  // Function to remove a reminder
  const removeReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  // Function to edit a reminder
  const editReminder = (index) => {
    const reminder = reminders[index];
    setReminderTime(reminder.time);
    setReminderMessage(reminder.message);
    setEditingIndex(index);
  };

  // Function to save the edited reminder
  const saveEditedReminder = () => {
    const updatedReminders = reminders.map((reminder, index) =>
      index === editingIndex
        ? { ...reminder, time: reminderTime, message: reminderMessage }
        : reminder
    );
    setReminders(updatedReminders);
    setEditingIndex(null); // Reset editing index
    setReminderMessage(''); // Clear the message field after saving
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Set Multiple Reminders</h2>

        {/* Time input field */}
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-md hover:border-blue-500 hover:shadow-lg transition-all text-lg font-semibold text-gray-700"
        />

        {/* Text input for custom reminder message */}
        <textarea
          value={reminderMessage}
          onChange={(e) => setReminderMessage(e.target.value)}
          placeholder="Enter your custom reminder message"
          className="mt-4 w-full p-2 border border-gray-300 rounded-lg text-gray-700"
        />

        {/* Button to add reminder or save edited reminder */}
        <button
          onClick={editingIndex !== null ? saveEditedReminder : addReminder}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
        >
          {editingIndex !== null ? 'Save Edit' : 'Set Reminder'}
        </button>

        {/* Display list of reminders */}
        <div className="mt-6">
          {reminders.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Upcoming Reminders:</h3>
              <ul>
                {reminders.map((reminder, index) => (
                  <li key={index} className="mt-2 text-gray-800">
                    <strong>{reminder.time}</strong>: {reminder.message}
                    <button
                      onClick={() => editReminder(index)}
                      className="ml-4 text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeReminder(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </li>
                ))} 
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reminders;
