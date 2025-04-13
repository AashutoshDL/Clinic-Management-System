import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import LoadingScreen from '../Ui/LoadingScreen';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../service/baseURL';

const ReportViewing = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!userId) {
        console.error('User ID is not available');
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/patient/patientReportById/${userId}`);
        if (res.data.success && res.data.data.length > 0) {
          setReports(res.data.data); 
        } else {
          console.error('No report data found');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [userId]);

  const generateReportPDF = (report) => {
    if (!report) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Report for ${report.patientName}`, 20, 20);
    doc.setFontSize(14);
    doc.text(`Medical Report - ${new Date(report.reportDate).toLocaleDateString()}`, 20, 30);

    let y = 40;

    report.fields.forEach((field, index) => {
      if (field.label && field.value) {
        doc.setFontSize(12);
        doc.text(`${field.label}: ${field.value}`, 20, y);
        y += 10;
      }
    });

    doc.save(`${report.patientName}_report.pdf`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Medical Reports</h1>
      
      {reports.length > 0 ? (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Select a Report to View</h2>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report._id} className="border p-4 bg-white rounded shadow">
                  <p><strong>Patient Name:</strong> {report.patientName}</p>
                  <p><strong>Report Date:</strong> {new Date(report.reportDate).toLocaleDateString()}</p>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Report
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedReport && (
            <div className="border p-4 bg-white rounded shadow mt-6">
              <h2 className="text-xl font-semibold mb-4">Report Details</h2>
              <p><strong>Patient Name:</strong> {selectedReport.patientName}</p>
              <p><strong>Report Date:</strong> {new Date(selectedReport.reportDate).toLocaleDateString()}</p>
              <p><strong>Template Title:</strong> {selectedReport.templateTitle}</p>
              <div className="mt-4">
                {selectedReport.fields && Array.isArray(selectedReport.fields) && selectedReport.fields.length > 0 ? (
                  selectedReport.fields.map((field, index) => (
                    <p key={index}><strong>{field.label}:</strong> {field.value}</p>
                  ))
                ) : (
                  <p>No fields available to display.</p>
                )}
              </div>
              <button
                onClick={() => generateReportPDF(selectedReport)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download as PDF
              </button>
            </div>
          )}
        </>
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
};

export default ReportViewing;