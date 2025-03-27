import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PatientAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableTimes, setAvailableTimes] = useState({});
  const { userId, accessToken } = useAuth();
  const [patientData, setPatientData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/doctor/getAllDoctors');
        if (response.status === 200) {
          const data = response.data;

          if (data.message === "Doctors fetched successfully" && data.doctors) {
            setDoctors(data.doctors);

            const allAvailableTimes = {};
            data.doctors.forEach(doctor => {
              const times = doctor.availableTimes.map(timeSlot => {
                if (typeof timeSlot === 'object' && timeSlot.from && timeSlot.to) {
                  return `${timeSlot.from} - ${timeSlot.to}`;
                } else if (typeof timeSlot === 'object' && timeSlot._id) {
                  return "Time Slot";
                } else if (typeof timeSlot === 'string') {
                  return timeSlot;
                }
                return null;
              }).filter(time => time !== null);

              allAvailableTimes[doctor.id] = times;
            });
            setAvailableTimes(allAvailableTimes);
          } else {
            setError(new Error("Invalid data received from server."));
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = (doctorId) => {
    setSelectedDoctor(doctorId);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = async () => {
    if (!selectedTime || !selectedDoctor) {
      alert('Please select a doctor and a time');
      return;
    }

    try {
      const patientResponse = await axios.get(`http://localhost:3001/patient/getPatientById/${userId}`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
        withCredentials: true,
      });
      console.log(patientResponse.data.data)
      if (patientResponse.status === 200 && patientResponse.data.data) {
        const patient = patientResponse.data.data;

        const selectedDoctorData = doctors.find((doc) => doc.id === selectedDoctor);
        if (!selectedDoctorData) {
          alert("Selected doctor not found. Please refresh the page.");
          return;
        }

        const appointmentData = {
          doctorId: selectedDoctorData.id,
          doctorName: selectedDoctorData.name,
          patientId: patient.id,
          patientName: patient.name,
          time: selectedTime,
        };

        console.log(appointmentData);
        const response = await axios.post(`http://localhost:3001/appointments/createAppointment/${userId}`, appointmentData, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          withCredentials: true,
        });

        if (response.status === 201) {
          alert(`Appointment booked with Dr. ${selectedDoctorData.name} at ${selectedTime}`);
          setSelectedDoctor(null);
          setSelectedTime(null);
          setPatientData({
            doctorName: selectedDoctorData.name,
            time: selectedTime,
            patientName: patient.name,
          });
        } else {
          alert(response.data.message || "Failed to book the appointment. Please try again later.");
        }
      } else {
        alert("Error fetching patient details. Please try again.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error booking appointment. Please try again.");
      console.error("Error:", error);
    }
  };

  const handleBackToDoctors = () => {
    setSelectedDoctor(null);
    setSelectedTime(null);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error: {error.message}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">Book an Appointment</h1>

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
                  src={doctor.image || '/images/blankProfile.png'}
                  alt={doctor.name || 'images/blankProfile.png'}
                  className="w-32 h-32 object-cover rounded-full mx-auto mb-6 border-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-gray-500 mt-3 text-center">{doctor.information || "No info available"}</p>
                {doctor.dutyTime ? (
                  <p className="text-sm text-green-500 mt-3 text-center">
                    <strong>Duty Time:</strong> {doctor.dutyTime.from} - {doctor.dutyTime.to}
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
          <button onClick={handleBackToDoctors} className="text-blue-500 hover:underline mb-6">
            &larr; Back to Doctors
          </button>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Available Times with Dr. {doctors.find((doc) => doc.id === selectedDoctor)?.name || "Doctor Name Not Found"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTimes[selectedDoctor]?.map((time, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(time)}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
              >
                {time}
              </button>
            )) || <p>No times available for this doctor.</p>}
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-medium text-gray-700 mb-3">Selected Time: {selectedTime}</h3>
            <button onClick={handleBookAppointment} className="bg-green-500 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200">
              Book Appointment
            </button>
          </div>
        </div>
      )}

      {patientData.doctorName && (
        <div className="mt-8 p-6 bg-green-100 border border-green-200 rounded-lg">
          <h3 className="text-xl font-semibold text-green-600">Appointment Booked</h3>
          <p><strong>Doctor:</strong> Dr. {patientData.doctorName}</p>
          <p><strong>Time:</strong> {patientData.time}</p>
          <p><strong>Patient:</strong> {patientData.patientName}</p>
        </div>
      )}
    </div>
  );
};

export default PatientAppointment;
