import React, { useState, useEffect } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css'; // Importing styles for better UI

const Reminders = () => {
  const [reminderTime, setReminderTime] = useState('12:00'); // Default time (hh:mm format)
  const [isReminderSet, setIsReminderSet] = useState(false);

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

  // Function to set reminder
  const setReminder = () => {
    const timeDifference = calculateTimeDifference(reminderTime);

    if (timeDifference > 0 && Notification.permission === 'granted') {
      setIsReminderSet(true);

      setTimeout(() => {
        new Notification('Reminder', {
          body: 'This is your reminder to have the medicine',
          icon: '/images/2-nobg.png', // Optional: Set an icon here
        });
        setIsReminderSet(false); // Reset the reminder state
      }, timeDifference);
    } else {
      alert('Please set a valid reminder time and allow notifications.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Set a Reminder</h2>
        
        {/* TimePicker component */}
        <TimePicker
          onChange={setReminderTime}
          value={reminderTime}
          disableClock={true} // Enabling the clock to be displayed
          hourPlaceholder="hh" // Placeholder for the hour input
          minutePlaceholder="mm" // Placeholder for the minute input
        />
        
        <button
          onClick={setReminder}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Set Reminder
        </button>
        
        {isReminderSet && <p className="mt-4 text-green-500">Reminder is set for {reminderTime}!</p>}
      </div>
    </div>
  );
};

export default Reminders;
