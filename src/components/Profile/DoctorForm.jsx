// import React, { useState } from 'react';
// import axios from 'axios';

// const DoctorForm = ({ userId, accessToken }) => {
//   const [specialization, setSpecialization] = useState('');
//   const [description, setDescription] = useState('');
//   const [dutyTimeFrom, setDutyTimeFrom] = useState('');
//   const [dutyTimeTo, setDutyTimeTo] = useState('');
//   const [error, setError] = useState(null);  // To track any errors

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const doctorData = {
//       specialization,
//       description,
//       dutyTime: {
//         from: dutyTimeFrom,
//         to: dutyTimeTo,
//       },
//     };

//     try {
//       // Send doctor data to the backend API
//       const response = await axios.post(
//         `http://localhost:3001/doctor/editProfile/${userId}`, 
//         doctorData,
//         {
//           headers: { 'Authorization': `Bearer ${accessToken}` },
//         }
//       );
//       console.log('Doctor Data Saved:', response.data);
//       alert('Doctor information updated successfully!');
//     } catch (error) {
//       console.error('Error saving doctor data:', error);
//       setError('Failed to save doctor data. Please try again later.');
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Doctor Information</h2>

//       {error && <p className="text-red-500">{error}</p>}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="specialization" className="block text-gray-700">Specialization</label>
//           <input
//             type="text"
//             id="specialization"
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter specialization"
//             value={specialization}
//             onChange={(e) => setSpecialization(e.target.value)}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="description" className="block text-gray-700">Description</label>
//           <textarea
//             id="description"
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter doctor description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="duty-time" className="block text-gray-700">Duty Time</label>
//           <div className="flex space-x-4">
//             <input
//               type="time"
//               className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={dutyTimeFrom}
//               onChange={(e) => setDutyTimeFrom(e.target.value)}
//             />
//             <input
//               type="time"
//               className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={dutyTimeTo}
//               onChange={(e) => setDutyTimeTo(e.target.value)}
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
//         >
//           Save Doctor
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DoctorForm;
