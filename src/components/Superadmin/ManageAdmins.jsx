import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateAdmin from "./CreateAdmin";
import { baseURL } from "../service/baseURL";

const ManageAdmins = () => {
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/getAllAdmin`); // Replace with your actual API URL
        setAdmins(response.data.data || []);
        console.log(response.data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []); 

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/admin/deleteAdminById/${id}`);
      setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete admin");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowCreateAdmin(!showCreateAdmin)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          {showCreateAdmin ? "Close" : "Add Admin"}
        </button>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-bold">Total Admins: {admins.length}</h2>
        </div>
      </div>

      {showCreateAdmin && <CreateAdmin />}

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Admin List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          <ul>
            {admins.map((admin) => (
              <li
                key={admin.id}
                className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2"
              >
                <span>{admin.name}</span>
                <div>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ManageAdmins;