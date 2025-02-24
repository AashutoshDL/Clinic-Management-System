import React, { useContext, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Use `useNavigate` instead of `useHistory`

const Appointment = () => {
  const { isLoggedIn } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');  // State for search query
  const navigate = useNavigate();  // For navigation

  // Static doctors data with images and duty info
  const doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      specialization: 'Cardiologist',
      info: 'Experienced in heart surgery and treatment.',
      image: '/images/pic1.jpg', // Example image URL
      duty: { from: '1:00 PM', to: '4:00 PM' }, // Duty time for Dr. John Doe
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      specialization: 'Dermatologist',
      info: 'Specializes in skin treatments and care.',
      image: '/images/pic2.jpg', // Example image URL
      duty: { from: '7:00 AM', to: '11:00 AM' }, // No duty for Dr. Jane Smith
    },
    {
      id: 3,
      name: 'Dr. Alex Johnson',
      specialization: 'Orthopedic',
      info: 'Expert in joint and bone health.',
      image: '/images/pic3.jpg', // Example image URL
      duty: { from: '4:00 PM', to: '8:00 PM' }, // Duty time for Dr. Alex Johnson
    },
  ];

  // Static available times for each doctor
  const availableTimes = {
    1: ['9:00 AM', '11:00 AM', '2:00 PM'],
    2: ['10:00 AM', '12:00 PM', '3:00 PM'],
    3: ['8:00 AM', '1:00 PM', '4:00 PM'],
  };

  const handleDoctorClick = (doctorId) => {
    setSelectedDoctor(doctorId);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (selectedTime) {
      alert(`Appointment booked with Dr. ${doctors.find((doc) => doc.id === selectedDoctor).name} at ${selectedTime}`);
    } else {
      alert('Please select a time');
    }
  };

  const handleBackToDoctors = () => {
    setSelectedDoctor(null);  // Reset doctor selection
    setSelectedTime(null);     // Reset selected time
    navigate('/appointment'); // Navigate back to the doctors list or appointment page
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Book an Appointment</h1>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search by doctor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-10 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-3 text-gray-500">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>

      {selectedDoctor === null ? (
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Our Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => handleDoctorClick(doctor.id)}
                className="cursor-pointer border rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-6 border-4 border-blue-500"
                />
                <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-gray-500 mt-3 text-center">{doctor.info}</p>
                {doctor.duty ? (
                  <p className="text-sm text-green-500 mt-3 text-center">
                    <strong>Duty Time:</strong> {doctor.duty.from} - {doctor.duty.to}
                  </p>
                ) : (
                  <p className="text-sm text-red-500 mt-3 text-center">No duty hours available</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={handleBackToDoctors}
            className="text-blue-500 hover:underline mb-6"
          >
            &larr; Back to Doctors
          </button>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Available Times with Dr. {doctors.find((doc) => doc.id === selectedDoctor).name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTimes[selectedDoctor].map((time, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(time)}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
              >
                {time}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-700 mb-3">Selected Time: {selectedTime}</h3>
            <button
              onClick={handleBookAppointment}
              className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
