import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportGeneration from '../Report/ReportGeneration';
import {baseURL} from '../baseURL'

const ManageReports = () => {
  const [reportTemplates, setReportTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching the report templates from the API
  useEffect(() => {
    const fetchReportTemplates = async () => {
      try {
        const response = await axios.get(`${baseURL}/report/getAllReportTemplates`, {
          withCredentials: true, // If you need to send cookies
        });
        setReportTemplates(response.data); // Store the fetched templates in state
      } catch (err) {
        setError('Failed to fetch report templates');
        console.error(err);
      } finally {
        setLoading(false);
      }W``
    };

    fetchReportTemplates();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Reports</h1>
      
      {/* Display ReportGeneration Component */}
      <ReportGeneration />
      
      {/* Loading state */}
      {loading && <p>Loading report templates...</p>}

      {/* Error state */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Display Report Templates if available */}
      <div>
        <h2 className="text-xl font-semibold mt-6">Available Report Templates</h2>
        <ul className="mt-4 space-y-2">
          {reportTemplates.length > 0 ? (
            reportTemplates.map((template, index) => (
              <li key={index} className="p-4 border rounded-lg">
                <h3 className="text-lg font-bold">{template.name}</h3>
                <p>{template.description}</p>
                <p className="text-sm text-gray-500">Created on: {template.createdAt}</p>
              </li>
            ))
          ) : (
            <p>No report templates available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageReports;
