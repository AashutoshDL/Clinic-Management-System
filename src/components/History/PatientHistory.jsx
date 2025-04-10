import React, { useEffect, useState } from 'react';
import { baseURL } from '../service/baseURL';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PatientHistory = ({ patientId }) => {
  const { userId } = useAuth();
  const actualpatientId = patientId || userId;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${baseURL}/history/getHistoryByPatientId/${actualpatientId}`);
        if (response.data?.data) {
          setHistory(response.data.data);
        } else {
          setHistory([]);
        }
      } catch (err) {
        setError('Failed to fetch patient history');
      } finally {
        setLoading(false);
      }
    };

    if (actualpatientId) {
      fetchHistory();
    }
  }, [actualpatientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Patient History</h2>

      {history && history.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-600">
          <p className="text-lg">No history available</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {history.map((report) => (
            <div key={report._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-500 text-white p-4">
                <h3 className="font-bold text-lg">Dr. {report.doctorName}</h3>
                <p className="text-sm text-blue-100">
                  {new Date(report.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700">Diseases:</h4>
                  <ul className="list-disc pl-6 text-gray-600">
                    {report.diseases?.map((disease, index) => (
                      <li key={index}>{disease}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700">Medicines:</h4>
                  <ul className="list-disc pl-6 text-gray-600">
                    {report.medicines?.map((medicine, index) => (
                      <li key={index}>{medicine}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistory;