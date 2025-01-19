import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const AdminTable = ({ tableData, setTableData }) => {
  const [editingUser, setEditingUser] = React.useState(null);
  const [formData, setFormData] = React.useState({});
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/user/profiles');
      setTableData(response.data); // Update table data with the latest fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/user/deleteProfiles/${userId}`);
      console.log("Deleted user:", response.data);
      setTableData((prevData) => prevData.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/user/updateProfiles/${editingUser.id}`, formData);
      console.log("Updated user:", response.data);

      // Refetch the data to ensure the table has the latest information
      await fetchData();

      setIsModalOpen(false); // Close the modal after saving
      setEditingUser(null); // Clear the current editing user
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
    });
    setIsModalOpen(true); // Open the modal
  };

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <div>
      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">User Name</label>
                <input
                  type="text"
                  value={formData.userName || ''}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-buttonGray text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Username</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Role</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Email</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Date Created</th>
              <th className="px-4 py-2 border border-gray-300 text-center">Edit Account</th>
              <th className="px-4 py-2 border border-gray-300 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-gray-300 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    {data.userName ? data.userName.charAt(0).toUpperCase() : 'N/A'}
                  </div>
                  {data.firstName} {data.lastName}
                </td>
                <td className="px-4 py-2 border border-gray-300">{data.userName || 'N/A'}</td>
                <td className="px-4 py-2 border border-gray-300">{data.role || 'N/A'}</td>
                <td className="px-4 py-2 border border-gray-300">{data.email || 'N/A'}</td>
                <td className="px-4 py-2 border border-gray-300">{data.accountCreated || 'N/A'}</td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  <button
                    className="text-black px-4 py-2 rounded-lg"
                    onClick={() => handleEditClick(data)} // Open the modal with user data
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="mr-4" />
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  <button
                    className="text-black px-4 py-2 rounded-lg"
                    onClick={() => handleDelete(data.id)} // Call handleDelete with user ID
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-4" />
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

export default AdminTable;
