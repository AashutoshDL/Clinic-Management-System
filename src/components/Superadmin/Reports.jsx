import React from 'react';
import ReportGeneration from '../Report/ReportGeneration'

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>
      <ReportGeneration />
    </div>
  );
};

export default Reports;
