import React, { useState, useEffect } from 'react';

const Reminders = () => {
  const [reminderTime, setReminderTime] = useState('12:00'); 
  const [reminderMessage, setReminderMessage] = useState(''); 
  const [reminders, setReminders] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); 

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }, []);

  const calculateTimeDifference = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const reminderDate = new Date(now);

    reminderDate.setHours(hours, minutes, 0, 0);

    if (reminderDate <= now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }

    return reminderDate.getTime() - now.getTime();
  };

  const addReminder = () => {
    const timeDifference = calculateTimeDifference(reminderTime);

    if (timeDifference > 0 && Notification.permission === 'granted') {
      const newReminder = { time: reminderTime, message: reminderMessage };

      setReminders((prevReminders) => [...prevReminders, newReminder]);

      setTimeout(() => {
        new Notification('Reminder', {
          body: reminderMessage, 
          icon: '/images/2-nobg.png', 
        });
      }, timeDifference);

      setReminderMessage('');
    } else {
      alert('Please set a valid reminder time and allow notifications.');
    }
  };

  const removeReminder = (index) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  const editReminder = (index) => {
    const reminder = reminders[index];
    setReminderTime(reminder.time);
    setReminderMessage(reminder.message);
    setEditingIndex(index);
  };

  const saveEditedReminder = () => {
    const updatedReminders = reminders.map((reminder, index) =>
      index === editingIndex
        ? { ...reminder, time: reminderTime, message: reminderMessage }
        : reminder
    );
    setReminders(updatedReminders);
    setEditingIndex(null); 
    setReminderMessage(''); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Set Multiple Reminders</h2>

        {}
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-md hover:border-blue-500 hover:shadow-lg transition-all text-lg font-semibold text-gray-700"
        />

        {}
        <textarea
          value={reminderMessage}
          onChange={(e) => setReminderMessage(e.target.value)}
          placeholder="Enter your custom reminder message"
          className="mt-4 w-full p-2 border border-gray-300 rounded-lg text-gray-700"
        />

        {}
        <button
          onClick={editingIndex !== null ? saveEditedReminder : addReminder}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all"
        >
          {editingIndex !== null ? 'Save Edit' : 'Set Reminder'}
        </button>

        {}
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
