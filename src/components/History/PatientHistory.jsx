import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../service/baseURL';
import { useAuth } from '../../context/AuthContext';
import PdfViewer from '../service/PdfViewer';

const PatientHistory = ({ patientId }) => {
  const { userId } = useAuth();
  const actualpatientId = patientId || userId;

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [reportLinks, setReportLinks] = useState([]);

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

    const fetchReports = async () => {
      try {
        const response = await axios.get(`${baseURL}/uploads/getPDFByPatientId/${actualpatientId}`);
        if (response.data?.reports) {
          setReportLinks(response.data.reports);
        }
      } catch (err) {
        setError('Failed to fetch reports');
      }
    };

    if (actualpatientId) {
      fetchHistory();
      fetchReports();
    }
  }, [actualpatientId]);

  const handlePdfUpload = async () => {
    if (!selectedPdf) return alert("Please select a PDF file");

    const formData = new FormData();
    formData.append("report", selectedPdf);

    try {
      const res = await axios.post(`${baseURL}/uploads/uploadReportByPatientId/${actualpatientId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const response = await axios.get(`${baseURL}/uploads/getPDFByPatientId/${actualpatientId}`);
      if (response.data?.reports) {
        setReportLinks(response.data.reports);
      }
      
      setSelectedPdf(null);
      alert("PDF uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to upload PDF");
    }
  };

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

      {}
      <div className="mb-6">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setSelectedPdf(e.target.files[0])}
          className="block mb-2 text-sm text-gray-600"
        />
        <button
          onClick={handlePdfUpload}
          disabled={!selectedPdf}
          className={`${!selectedPdf ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-4 py-2 rounded transition`}
        >
          Upload PDF Report
        </button>
      </div>

      {}
      {history.length === 0 ? (
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

                {report.reportPdfUrl && (
                  <div className="mt-4">
                    <a
                      href={report.reportPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View PDF Report
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {reportLinks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Uploaded Reports</h3>
          {reportLinks.map((report) => (
            <div key={report._id} className="mb-6 bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700 truncate">{report.fileName || "PDF Report"}</h4>
                <div className="flex space-x-2">
                  <a 
                    href={report.url} 
                    download={report.fileName || "report.pdf"}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                  >
                    Download
                  </a>
                </div>
              </div>
              
              {}
              <PdfViewer pdfUrl={report.url} fileName={report.fileName} />
              
              <p className="text-xs text-gray-500 mt-2">
                Uploaded on: {new Date(report.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHistory;