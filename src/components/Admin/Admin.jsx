import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCard from './AdminCard';
import AdminPatientTable from './AdminPatientTable';
import AdminDoctorTable from './AdminDoctorTable';
import UserForm from './UserForm';
import { baseURL } from '../service/baseURL';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginWarningPage from '../Ui/LoginWarningPage';

const Admin = () => {
  const [showForm, setShowForm] = useState(false);
  const [patientData, setPatientData] = useState([]);
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [activeTab, setActiveTab] = useState('patients');
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return <LoginWarningPage />;
  }

  const handleLogOut = async () => {
    logout();
    navigate('/');
  };

  const fetchTableData = async () => {
    try {
      setLoading(true);

      const [patientRes, doctorRes] = await Promise.all([
        axios.get(`${baseURL}/patient/getAllPatients`),
        axios.get(`${baseURL}/doctor/getAllDoctors`),
      ]);

      const patients = Array.isArray(patientRes.data.data) ? patientRes.data.data : [];
      const doctors = Array.isArray(doctorRes.data.doctors) ? doctorRes.data.doctors : [];

      setPatientData(patients);
      setDoctorData(doctors);
      setPatientCount(patients.length);
      setDoctorCount(doctors.length);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  const handleUserSubmit = () => {
    setAlertMessage('User added successfully');
    setTimeout(() => setAlertMessage(''), 5000);
    fetchTableData(); 
  };

  const cardData = [
    {
      title: 'Patients / Users',
      count: patientCount,
      images: ['/images/pic1.jpg', '/images/pic2.jpg', '/images/pic3.jpg'],
      onClick: () => setActiveTab('patients'),
    },
    {
      title: 'Doctors',
      count: doctorCount,
      images: ['/images/pic2.jpg', '/images/pic1.jpg', '/images/pic3.jpg'],
      onClick: () => setActiveTab('doctors'),
    },
  ];

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-5">
        <p className="text-4xl">ADMIN PANEL</p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-buttonGray text-white px-7 py-3 rounded-lg"
        >
          Create User
        </button>
        <button
          onClick={handleLogOut}
          className="bg-buttonGray text-white px-7 py-3 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4">
        {cardData.map((data, index) => (
          <div
            key={index}
            className={`cursor-pointer ${activeTab === data.title.toLowerCase() ? 'bg-blue-100' : ''}`}
            onClick={data.onClick}
          >
            <AdminCard
              title={data.title}
              count={data.count}
              images={data.images}
            />
          </div>
        ))}
      </div>

      <div className="mt-10">
        {loading ? (
          <p>Loading table data...</p> 
        ) : activeTab === 'patients' ? (
          <AdminPatientTable tableData={patientData} setTableData={setPatientData} />
        ) : (
          <AdminDoctorTable tableData={doctorData} setTableData={setDoctorData} />
        )}
      </div>

      {alertMessage && (
        <div className="bg-green-100 text-green-700 p-4 mt-4 rounded">
          {alertMessage}
        </div>
      )}

      {showForm && (
        <UserForm
          onClose={() => setShowForm(false)}
          onSubmit={handleUserSubmit}
        />
      )}
    </div>
  );
};

export default Admin;