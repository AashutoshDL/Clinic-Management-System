import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import LoadingScreen from '../Ui/LoadingScreen';
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../service/baseURL';
import { generatePDF } from '../service/generatePDF';

const ReportViewing = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { userId } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!userId) {
        console.error('User ID is not available');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await axios.get(`${baseURL}/patient/patientReportById/${userId}`);
        if (res.data.success && res.data.data.length > 0) {
          // Sort reports by date (newest first)
          const sortedReports = res.data.data.sort((a, b) => 
            new Date(b.reportDate) - new Date(a.reportDate)
          );
          setReports(sortedReports);
        } else {
          console.error('No report data found');
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [userId]);

  const generateReportPDF = (report) => {
    if (!report) return;
    generatePDF(report);
  }
  
  // const generateReportPDF = (report) => {
  //   if (!report) return;

  //   const doc = new jsPDF();
    
  //   // Add header
  //   doc.setFillColor(41, 82, 163);
  //   doc.rect(0, 0, 210, 20, 'F');
  //   doc.setTextColor(255, 255, 255);
  //   doc.setFontSize(16);
  //   doc.text(`Medical Report - ${report.patientName}`, 105, 12, { align: 'center' });
    
  //   // Reset text color
  //   doc.setTextColor(0, 0, 0);
    
  //   // Add report details
  //   doc.setFontSize(14);
  //   doc.text(`Date: ${new Date(report.reportDate).toLocaleDateString()}`, 20, 30);
  //   doc.text(`Template: ${report.templateTitle}`, 20, 40);
    
  //   // Add line
  //   doc.setDrawColor(200, 200, 200);
  //   doc.line(20, 45, 190, 45);
    
  //   let y = 55;
    
  //   // Add fields
  //   report.fields.forEach((field, index) => {
  //     if (field.label && field.value) {
  //       doc.setFontSize(12);
  //       if (y > 270) {
  //         doc.addPage();
  //         y = 20;
  //       }
  //       doc.setFont(undefined, 'bold');
  //       doc.text(`${field.label}:`, 20, y);
  //       doc.setFont(undefined, 'normal');
  //       doc.text(`${field.value}`, 70, y);
  //       y += 10;
  //     }
  //   });
    
  //   // Add footer
  //   const pageCount = doc.internal.getNumberOfPages();
  //   for (let i = 1; i <= pageCount; i++) {
  //     doc.setPage(i);
  //     doc.setFontSize(10);
  //     doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
  //   }

  //   doc.save(`${report.patientName}_report_${new Date().toISOString().split('T')[0]}.pdf`);
  // };

  const filteredReports = reports.filter(report => {
    return report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           report.templateTitle.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Medical Reports</h1>
        
        {reports.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Report List */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-3 text-gray-700">Your Reports</h2>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <div className="space-y-3 overflow-y-auto max-h-96">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <div 
                        key={report._id} 
                        className={`p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-blue-50 ${selectedReport && selectedReport._id === report._id ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-50'}`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <p className="font-medium text-blue-700">{report.patientName}</p>
                        <p className="text-sm text-gray-600">{report.templateTitle}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(report.reportDate).toLocaleDateString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-gray-500">No matching reports found</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Report Details */}
            <div className="lg:col-span-2">
              {selectedReport ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-blue-800">{selectedReport.templateTitle}</h2>
                    <button
                      onClick={() => generateReportPDF(selectedReport)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Patient Name</p>
                        <p className="font-medium">{selectedReport.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Report Date</p>
                        <p className="font-medium">{new Date(selectedReport.reportDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium text-gray-700 mb-3">Report Details</h3>
                    
                    {selectedReport.fields && Array.isArray(selectedReport.fields) && selectedReport.fields.length > 0 ? (
                      <div className="space-y-4">
                        {selectedReport.fields.map((field, index) => (
                          <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                            <p className="text-sm text-gray-500">{field.label}</p>
                            <p className="font-medium">{field.value || "N/A"}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No fields available to display.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center h-full flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Report Selected</h3>
                  <p className="text-gray-500">Select a report from the list to view its details</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No Reports Found</h2>
            <p className="text-gray-500">You don't have any medical reports available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportViewing;