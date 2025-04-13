import React from 'react';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react';
import { baseURL } from '../service/baseURL';

const AdminDoctorTable = ({ tableData, setTableData }) => {
  const [editingDoctor, setEditingDoctor] = React.useState(null);
  const [formData, setFormData] = React.useState({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchDoctorData = async () => {
    try {
      const response = await axios.get(`${baseURL}/doctor/getAllDoctors`);
      console.log("Doctors fetched:", response.data.data);
      setTableData(response.data.data);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
    }
  };

  const handleDelete = async (doctorId) => {
    try {
      const response = await axios.delete(`${baseURL}/doctor/deleteDoctorById/${doctorId}`);
      console.log("Deleted doctor:", response.data);
      setTableData((prevData) => prevData.filter(doctor => doctor.id !== doctorId));
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.patch(`${baseURL}/doctor/setupProfileById/${editingDoctor.id}`, formData);
      console.log("Updated doctor:", response.data);
      await fetchDoctorData();
      setIsModalOpen(false);
      setEditingDoctor(null);
    } catch (error) {
      console.error('Error updating doctor:', error);
    }
  };

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      userName: doctor.userName,
      email: doctor.email,
    });
    setIsModalOpen(true);
  };

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <p className="text-center text-gray-600">No doctor data available</p>;
  }

  return (
    <div>
      {}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doctor List</h2>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Doctor</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">User Name</label>
                <input
                  type="text"
                  value={formData.userName || ''}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date Created</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Edit</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Delete</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={index} className="hover:bg-gray-50 transition duration-300">
                <td className="px-6 py-4 text-sm font-medium text-gray-700 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                      {data.userName ? data.userName.charAt(0).toUpperCase() : 'N/A'}
                    </div>
                    {data.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700 border-t border-gray-200">{data.userName || 'N/A'}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700 border-t border-gray-200">{data.role || 'Doctor'}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700 border-t border-gray-200">{data.email || 'N/A'}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700 border-t border-gray-200">{data.accountCreated || 'N/A'}</td>
                <td className="px-6 py-4 text-center border-t border-gray-200">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(data)}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </td>
                <td className="px-6 py-4 text-center border-t border-gray-200">
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(data.id)}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDoctorTable;
