import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../service/baseURL';
import PdfViewer from '../service/PdfViewer';

const ReportSharing = () => {
  const [patients, setPatients] = useState([]);
  const [patientReports, setPatientReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [emailInputs, setEmailInputs] = useState(['']);
  const [isSending, setIsSending] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all patients
        const patientsResponse = await axios.get(`${baseURL}/patient/getAllPatients`);
        
        const patientData = Array.isArray(patientsResponse.data) 
          ? patientsResponse.data 
          : (patientsResponse.data?.patients || patientsResponse.data?.data || []);
        
        setPatients(patientData);
        
        // Handle case where no patients are found
        if (!patientData || patientData.length === 0) {
          setPatientReports([]);
          setLoading(false);
          return;
        }
        
        // Create an array to store reports and PDFs
        const reportsData = [];
        
        // Fetch reports and PDFs for each patient sequentially to avoid overwhelming the server
        for (const patient of patientData) {
          if (!patient || !patient._id) {
            console.error("Invalid patient data:", patient);
            continue;
          }

          try {
            // Fetch patient report
            const reportResponse = await axios.get(`${baseURL}/patient/patientReportById/${patient._id}`);
            
            // Fetch PDF by patient ID
            const pdfResponse = await axios.get(`${baseURL}/uploads/getPDFByPatientId/${patient._id}`);
            
            reportsData.push({
              patientId: patient._id,
              patientName: patient.name || 'Unknown Patient',
              report: reportResponse.data,
              pdfUrl: pdfResponse.data?.url || null,
              hasError: false
            });
          } catch (err) {
            console.error(`Error fetching data for patient ${patient._id}:`, err);
            reportsData.push({
              patientId: patient._id,
              patientName: patient.name || 'Unknown Patient',
              hasError: true,
              errorMessage: `Unable to fetch report or PDF for this patient`
            });
          }
        }
        
        setPatientReports(reportsData);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patient data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFieldValue = (report, fieldLabel) => {
    if (!report || !report.fields) return 'N/A';
    const field = report.fields.find(field => field.label === fieldLabel);
    return field ? field.value : 'N/A';
  };

  const handleShareClick = (patientId) => {
    setSelectedPatientId(patientId);
    setEmailInputs(['']);
    setShareSuccess(false);
    setShareError(null);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setSelectedPatientId(null);
  };

  const handleEmailChange = (index, value) => {
    const newEmailInputs = [...emailInputs];
    newEmailInputs[index] = value;
    setEmailInputs(newEmailInputs);
  };

  const addEmailInput = () => {
    setEmailInputs([...emailInputs, '']);
  };

  const removeEmailInput = (index) => {
    if (emailInputs.length > 1) {
      const newEmailInputs = emailInputs.filter((_, i) => i !== index);
      setEmailInputs(newEmailInputs);
    }
  };

  const validateEmails = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailInputs.every(email => email.trim() === '' || emailRegex.test(email));
  };

  const handleSendReport = async () => {
    if (!validateEmails()) {
      setShareError("One or more email addresses are invalid");
      return;
    }
    
    // Filter out empty email inputs
    const validEmails = emailInputs.filter(email => email.trim() !== '');
    
    if (validEmails.length === 0) {
      setShareError("Please enter at least one email address");
      return;
    }
    
    setIsSending(true);
    setShareError(null);
    
    try {
      // Find the selected patient report
      const selectedPatient = patientReports.find(p => p.patientId === selectedPatientId);
      
      if (!selectedPatient) {
        throw new Error("Patient data not found");
      }
      
      // Construct the sharing payload
      const sharingData = {
        patientId: selectedPatientId,
        patientName: selectedPatient.patientName,
        emailRecipients: validEmails,
        reportData: selectedPatient.report,
        pdfUrl: selectedPatient.pdfUrl
      };
      
      // Send the sharing request to the backend
      await axios.post(`${baseURL}/patient/shareReport`, sharingData);
      
      setShareSuccess(true);
      
      // Close the modal after a short delay
      setTimeout(() => {
        closeShareModal();
      }, 2000);
      
    } catch (err) {
      console.error("Error sharing report:", err);
      setShareError("Failed to share the report. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading Patient Reports</h2>
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  const selectedPatient = patientReports.find(p => p.patientId === selectedPatientId);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Patient Reports</h2>
      
      {patientReports.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No patient reports available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {patientReports.map((patientData) => (
            <div 
              key={patientData.patientId} 
              className="border rounded-lg shadow-md p-6 bg-white relative"
            >
              <h3 className="text-xl font-semibold mb-4">{patientData.patientName}</h3>
              
              {patientData.hasError ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{patientData.errorMessage}</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h4 className="font-medium text-lg mb-2">Patient Information</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex">
                        <span className="font-medium w-48">Patient Name:</span>
                        <span>{patientData.report?.patientName || 'N/A'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-48">Age:</span>
                        <span>{getFieldValue(patientData.report, 'Age')}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-48">Diagnosis:</span>
                        <span>{getFieldValue(patientData.report, 'Diagnosis')}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-48">Prescribed Medication:</span>
                        <span>{getFieldValue(patientData.report, 'Prescribed Medication')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-lg mb-2">Documents</h4>
                    {patientData.pdfUrl ? (
                      <PdfViewer pdfUrl={patientData.pdfUrl} />
                    ) : (
                      <p className="text-gray-500">PDF report not available</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() => handleShareClick(patientData.patientId)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                      </svg>
                      Share Report
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Share Report: {selectedPatient?.patientName}
              </h3>
              <button 
                onClick={closeShareModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email Recipients
              </label>
              
              {emailInputs.map((email, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter email address"
                    className="flex-grow border rounded px-3 py-2 mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeEmailInput(index)}
                    disabled={emailInputs.length === 1}
                    className={`px-2 py-1 rounded ${
                      emailInputs.length === 1 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addEmailInput}
                className="text-blue-500 hover:text-blue-700 mt-1 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add another email
              </button>
            </div>
            
            {shareError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{shareError}</p>
              </div>
            )}
            
            {shareSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p>Report shared successfully!</p>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={closeShareModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendReport}
                disabled={isSending}
                className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center ${
                  isSending ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'
                }`}
              >
                {isSending ? (
                  <>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportSharing;