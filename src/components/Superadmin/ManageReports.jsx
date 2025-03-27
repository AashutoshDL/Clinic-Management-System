import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportGeneration from '../Report/ReportGeneration';
import { baseURL } from '../service/baseURL';

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

        if (response.data.success && Array.isArray(response.data.data)) {
          setReportTemplates(response.data.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError('Failed to fetch report templates');
        console.error(err);
      } finally {
        setLoading(false);
      }
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
            reportTemplates.map((template) => (
              <li key={template._id} className="p-4 border rounded-lg shadow-md">
                <h3 className="text-lg font-bold">{template.title}</h3>
                <p>{template.description || "No description available"}</p>
                <p className="text-sm text-gray-500">
                  Created on: {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : "N/A"}
                </p>
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
