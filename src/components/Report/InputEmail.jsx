import React, { useState } from 'react';

const InputEmail = ({ onClose, onSend }) => {
  const [emails, setEmails] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [fileName, setFileName] = useState('');

  const handleAddEmail = () => {
    if (inputValue && /\S+@\S+\.\S+/.test(inputValue)) {
      setEmails([...emails, inputValue]);
      setInputValue('');
    }
  };

  const handleSend = () => {
    onSend(emails); // Send the list of emails to the parent
    onClose();      // Close popup
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Send Report</h2>

        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Enter email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddEmail}
            className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Emails:</h3>
          <div className="flex flex-wrap gap-2">
            {emails.map((email, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {email}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={handleSend}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default InputEmail;