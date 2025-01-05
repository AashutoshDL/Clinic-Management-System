import React, { useState } from 'react';

const Reminders = () => {
  const [reminderTime, setReminderTime] = useState(0); // Time in minutes
  const [isReminderSet, setIsReminderSet] = useState(false);

  // Request Notification permission on mount
  React.useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }, []);

  // Function to set reminder
  const setReminder = () => {
    if (reminderTime > 0 && Notification.permission === 'granted') {
      setIsReminderSet(true);
      const timeInMs = reminderTime * 10 * 1000; // Convert minutes to milliseconds

      setTimeout(() => {
        new Notification('Reminder', {
          body: 'This is your reminder!',
          icon: 'https://via.placeholder.com/48', // Optional: You can set an icon here
        });
      }, timeInMs);
    } else {
      alert('Please set a valid reminder time and allow notifications.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-80">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4">Set a Reminder</h1>
        <p className="text-gray-600 text-center mb-6">Enter a time in minutes for your reminder.</p>

        <input
          type="number"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Reminder time in minutes"
        />

        <button
          onClick={setReminder}
          disabled={isReminderSet}
          className={`w-full p-3 text-white font-semibold rounded-lg transition-colors duration-300 
            ${isReminderSet ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isReminderSet ? 'Reminder Set' : 'Set Reminder'}
        </button>

        {isReminderSet && (
          <p className="text-green-500 text-center mt-4">Your reminder is set!</p>
        )}
      </div>
    </div>
  );
};

export default Reminders;
