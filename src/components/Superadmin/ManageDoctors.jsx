import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../service/baseURL";
import CreateDoctor from "./CreateDoctor";


const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateDoctor, setShowCreateDoctor] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseURL}/doctor/getAllDoctors`);
        setDoctors(response.data.doctors || []);
        console.log(response.data.doctors)
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowCreateDoctor(!showCreateDoctor)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          {showCreateDoctor ? "Close" : "Add Doctor"}
        </button>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-bold">Total Doctors: {doctors.length}</h2>
        </div>
      </div>

      {showCreateDoctor && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h3 className="text-lg font-bold">Create New Doctor</h3>
          <CreateDoctor />
        </div>
      )}

      <h2 className="text-xl font-bold mb-2">Manage Doctors</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id} className="bg-gray-100 p-2 rounded-lg mb-2 flex justify-between items-center">
              <span>{doctor.name}</span>
              <div>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageDoctors;