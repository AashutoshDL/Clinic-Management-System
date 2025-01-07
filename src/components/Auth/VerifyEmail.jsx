import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = sessionStorage.getItem('email');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Verification Code:', verificationCode);
    console.log("Email",email)

    try {
      const response = await axios.post('http://localhost:3001/auth/verifyEmail', {
        email,
        verificationCode,
      });

      console.log(response.data.message || 'Email verified successfully!');
      navigate('/login');
    } catch (error) {
      if (error.response) {
        console.error('Error while verifying email:', error.response.data.message || 'Verification failed.');
        alert(error.response.data.message || 'Verification failed. Please try again.');
      } else if (error.request) {
        console.error('No response received from server. Please try again later.');
        alert('No response from server. Please try again later.');
      } else {
        console.error('Unexpected error occurred:', error.message);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-80">
        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the verification code sent to your email: <b>{email}</b>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
