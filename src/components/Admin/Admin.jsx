import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminCard from './AdminCard';
import AdminTable from './AdminTable';
import UserForm from './UserForm';

const Admin = () => {
  const [showForm, setShowForm] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const cardData = [
    {
      title: 'Patients / Users',
      count: 69,
      images: ['/images/pic1.jpg', '/images/pic2.jpg', '/images/pic3.jpg'],
    },
    {
      title: 'Doctors',
      count: 24,
      images: ['/images/pic2.jpg', '/images/pic1.jpg', '/images/pic3.jpg'],
    },
    {
      title: 'Lab-Technicians',
      count: 12,
      images: ['/images/pic3.jpg', '/images/pic1.jpg', '/images/pic2.jpg'],
    },
  ];

  const fetchTableData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/user/profiles'); // Replace with your backend endpoint
      console.log("Fetched Data:", response.data); // Debug API response
      setTableData(Array.isArray(response.data.users) ? response.data.users : []);
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTableData();
  }, []);

  const handleUserSubmit = (newUser) => {
    setAlertMessage('User added successfully');
    setTimeout(() => setAlertMessage(''), 5000);

    fetchTableData();
  };

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
      </div>
      <div className="flex gap-4">
        {cardData.map((data, index) => (
          <AdminCard
            key={index}
            title={data.title}
            count={data.count}
            images={data.images}
          />
        ))}
      </div>
      <div className="mt-10">
        {loading ? (
          <p>Loading table data...</p>
        ) : tableData.length > 0 ? (
          <AdminTable tableData={tableData} setTableData={setTableData} />
        ) : (
          <p>No data to display</p>
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
