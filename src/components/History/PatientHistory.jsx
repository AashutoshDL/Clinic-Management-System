import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../service/baseURL';
import axios from 'axios';

const PatientHistory = () => {
  const { userId } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${baseURL}/patient/patientReportById/${userId}`);
        setHistory(response.data?.data || []);
        console.log(response);
      } catch (err) {
        setError('Failed to fetch patient history');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchHistory();
    }
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Patient History</h2>
      
      {history && history.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded-lg text-center text-gray-600">
          <p className="text-lg">No history available</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {history?.map((report) => (
            <div key={report._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-blue-500 text-white p-4">
                <h3 className="font-bold text-lg">{report.templateTitle}</h3>
                <p className="text-sm text-blue-100">
                  {new Date(report.reportDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="p-4">
                {report.fields?.map((field) => (
                  <div key={field._id} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-700">{field.label}: </span>
                    <span className="text-gray-600">{field.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistory;