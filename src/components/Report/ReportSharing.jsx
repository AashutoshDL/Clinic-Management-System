import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingScreen from '../Ui/LoadingScreen';
import PdfViewer from '../service/PdfViewer'
import { useAuth } from '../../context/AuthContext';
import { baseURL } from '../service/baseURL';
import {generatePDF} from '../service/generatePDF';

const ReportSharing = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [pdfReports, setPdfReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedPdfReport, setSelectedPdfReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('structured');
  const { userId } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!userId) {
        console.error('User ID is not available');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await axios.get(`${baseURL}/patient/getAllPatients`);
        if (res.data.success && res.data.data.length > 0) {
          const sortedPatients = res.data.data.sort((a, b) => 
            a.name.localeCompare(b.name)
          );
          setPatients(sortedPatients);
          console.log(sortedPatients)
        } else {
          console.error('No patients found');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [userId]);

  // Fetch both types of reports for the selected patient
  useEffect(() => {
    const fetchAllReports = async () => {
      if (!selectedPatient) {
        setReports([]);
        setPdfReports([]);
        return;
      }

      setIsLoading(true);
      
      try {
        // Fetch structured reports
        const structuredRes = await axios.get(`${baseURL}/patient/patientReportById/${selectedPatient._id}`);
        if (structuredRes.data.success && structuredRes.data.data.length > 0) {
          const sortedReports = structuredRes.data.data.sort((a, b) => 
            new Date(b.reportDate) - new Date(a.reportDate)
          );
          setReports(sortedReports);
        } else {
          setReports([]);
        }

        // Fetch PDF reports
        const pdfRes = await axios.get(`${baseURL}/uploads/getPDFByPatientId/${selectedPatient._id}`);
        if (pdfRes.data.reports && pdfRes.data.reports.length > 0) {
          const sortedPdfReports = pdfRes.data.reports.sort((a, b) => 
            new Date(b.uploadedAt) - new Date(a.uploadedAt)
          );
          setPdfReports(sortedPdfReports);
        } else {
          setPdfReports([]);
        }

        // Reset selected reports when changing patients
        setSelectedReport(null);
        setSelectedPdfReport(null);
        
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
        setPdfReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllReports();
  }, [selectedPatient]);


  const generateReportPDF = (report) => {
    generatePDF(report);
  }

  const shareReport = async (report) => {
    if (!report) return;
    console.log(report._id)
    try {
      await axios.post(`${baseURL}/patient/shareReportById/${report._id}`);
      alert('Report shared successfully');
    } catch (error) {
      console.error('Error sharing report:', error);
      alert('Failed to share report');
    }
  };
  

  const filteredPatients = patients.filter(patient => 
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStructuredReports = reports.filter(report => 
    report.templateTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPdfReports = pdfReports.filter(report => 
    report.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedReport(null);
    setSelectedPdfReport(null);
  };

  if (isLoading && patients.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Report Sharing Center</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Patient List */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Patients</h2>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-2 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {patients.length > 0 ? (
                <div className="space-y-2 overflow-y-auto max-h-96">
                  {filteredPatients.map((patient) => (
                    <div 
                      key={patient._id} 
                      className={`p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-blue-50 ${selectedPatient && selectedPatient._id === patient._id ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-50'}`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <p className="font-medium text-blue-700">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.email}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">No patients found</div>
              )}
            </div>
          </div>
          
          {/* Middle Column - Report List with Tabs */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-700">
                {selectedPatient ? `${selectedPatient.name}'s Reports` : 'Select a Patient'}
              </h2>
              
              {selectedPatient && (
                <div className="mb-4">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`py-2 px-4 ${activeTab === 'structured' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleTabChange('structured')}
                    >
                      Structured Reports
                      {reports.length > 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{reports.length}</span>}
                    </button>
                    <button
                      className={`py-2 px-4 ${activeTab === 'pdf' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => handleTabChange('pdf')}
                    >
                      PDF Reports
                      {pdfReports.length > 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{pdfReports.length}</span>}
                    </button>
                  </div>
                </div>
              )}
              
              {selectedPatient ? (
                <>
                  {activeTab === 'structured' ? (
                    reports.length > 0 ? (
                      <div className="space-y-2 overflow-y-auto max-h-96">
                        {filteredStructuredReports.map((report) => (
                          <div 
                            key={report._id} 
                            className={`p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-blue-50 ${selectedReport && selectedReport._id === report._id ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-50'}`}
                            onClick={() => {
                              setSelectedReport(report);
                              setSelectedPdfReport(null);
                            }}
                          >
                            <p className="font-medium text-blue-700">{report.templateTitle}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(report.reportDate).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>No structured reports available</p>
                      </div>
                    )
                  ) : (
                    pdfReports.length > 0 ? (
                      <div className="space-y-2 overflow-y-auto max-h-96">
                        {filteredPdfReports.map((report) => (
                          <div 
                            key={report._id} 
                            className={`p-3 rounded-md cursor-pointer transition-all duration-200 hover:bg-blue-50 ${selectedPdfReport && selectedPdfReport._id === report._id ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-50'}`}
                            onClick={() => {
                              setSelectedPdfReport(report);
                              setSelectedReport(null);
                            }}
                          >
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <p className="font-medium text-blue-700 truncate">{report.fileName}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{new Date(report.uploadedAt).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p>No PDF reports available</p>
                      </div>
                    )
                  )}
                </>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p>Select a patient to view their reports</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Report Details */}
          <div className="lg:col-span-6">
            {selectedReport ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-blue-800">{selectedReport.templateTitle}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => shareReport(selectedReport,'structured')}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
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
            ) : selectedPdfReport ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-blue-800">{selectedPdfReport.fileName}</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => shareReport(selectedPdfReport, 'pdf')}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                    <a
                      href={selectedPdfReport.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={selectedPdfReport.fileName}
                      className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </a>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">File Name</p>
                      <p className="font-medium">{selectedPdfReport.fileName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Upload Date</p>
                      <p className="font-medium">{new Date(selectedPdfReport.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md h-96">
                  <PdfViewer 
                    pdfUrl={selectedPdfReport.url} 
                    fileName={selectedPdfReport.fileName} 
                    summary={selectedPdfReport.summary} 
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center h-full flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Report Selected</h3>
                <p className="text-gray-500">Select a patient and a report to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSharing;