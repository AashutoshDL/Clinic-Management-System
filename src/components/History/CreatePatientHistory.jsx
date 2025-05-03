import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MedicineInput from "../Meds-API/MedicineInput";
import DiseaseInput from "../Meds-API/DiseaseInput";
import PatientHistory from "./PatientHistory";
import PdfViewer from "../service/PdfViewer"; 
import { baseURL } from "../service/baseURL";

const CreatePatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPdfs, setIsLoadingPdfs] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [pdfReports, setPdfReports] = useState([]);

  const [currentEntry, setCurrentEntry] = useState({
    date: "",
    doctorName: "",
    hospitalName: "",
    medicines: [],
    diseases: [],
  });

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${baseURL}/patient/getAllPatients`, {
        withCredentials: true,
      });
      setPatients(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setError("Failed to load patients. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const fetchPdfReports = useCallback(async (patientId) => {
    setIsLoadingPdfs(true);
    setPdfReports([]); // Clear previous PDF reports when fetching new ones
    try {
      const response = await axios.get(`${baseURL}/uploads/getPDFByPatientId/${patientId}`, {
        withCredentials: true,
      });
      if (response.data?.reports) {
        setPdfReports(response.data.reports);
      }
    } catch (err) {
      console.error("Failed to fetch PDF reports:", err);
      setPdfReports([]); // Ensure reports are cleared on error
    } finally {
      setIsLoadingPdfs(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPatient?._id || selectedPatient?.id) {
      fetchPdfReports(selectedPatient._id || selectedPatient.id);
    } else {
      // Clear PDF reports when no patient is selected
      setPdfReports([]);
    }
  }, [selectedPatient, fetchPdfReports]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry((prev) => ({ ...prev, [name]: value }));
  };

  const validateEntry = () => {
    const { date, doctorName, hospitalName } = currentEntry;
    if (!date || !doctorName || !hospitalName) {
      return "Please fill all required fields before adding.";
    }
    return null;
  };

  const handleAddEntry = () => {
    const validationError = validateEntry();
    if (validationError) {
      alert(validationError);
      return;
    }

    setHistories((prev) => [...prev, currentEntry]);
    setCurrentEntry({
      date: "",
      doctorName: "",
      hospitalName: "",
      medicines: [],
      diseases: [],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient?._id && !selectedPatient?.id) {
      alert("No patient selected!");
      return;
    }

    if (histories.length === 0) {
      alert("Please add at least one history entry before submitting.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `${baseURL}/history/saveHistory`,
        {
          patientId: selectedPatient._id || selectedPatient.id,
          entries: histories,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Histories saved successfully!");
      setHistories([]);
      setCurrentEntry({
        date: "",
        doctorName: "",
        hospitalName: "",
        medicines: [],
        diseases: [],
      });
      setSelectedPatient(null);
      setShowHistory(false);
      setPdfReports([]);
    } catch (error) {
      console.error("Error saving histories:", error);
      setError("Failed to save patient history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveEntry = (index) => {
    setHistories((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateMedicines = (medicines) => {
    setCurrentEntry((prev) => ({ ...prev, medicines }));
  };

  const handleUpdateDiseases = (diseases) => {
    setCurrentEntry((prev) => ({ ...prev, diseases }));
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setHistories([]);
    setPdfReports([]);
    setShowHistory(false);
  };

  return (
    <div className="p-4 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b pb-2">Create Patient History</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading && !selectedPatient ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p>Loading patients...</p>
        </div>
      ) : !selectedPatient ? (
        <div className="space-y-2">
          <h3 className="font-semibold mb-3 text-gray-700">Select a Patient</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.isArray(patients) && patients.length > 0 ? (
              patients.map((patient) => (
                <button
                  key={patient._id || patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="text-left bg-gray-50 hover:bg-blue-50 p-3 rounded-md border border-gray-200 transition-colors duration-200"
                >
                  <p className="font-medium">{patient.name}</p>
                  {patient.age && <p className="text-sm text-gray-600">Age: {patient.age}</p>}
                </button>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-8">No patients available</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-blue-50 p-3 rounded-md">
            <div className="text-lg font-medium mb-2 md:mb-0">
              Patient: <span className="font-bold text-blue-700">{selectedPatient.name}</span>
              {selectedPatient.age && <span className="text-sm ml-2 text-gray-600">(Age: {selectedPatient.age})</span>}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowHistory((prev) => !prev)}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                {showHistory ? "Hide History" : "View History"}
              </button>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setShowHistory(false);
                  setPdfReports([]);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Change Patient
              </button>
            </div>
          </div>

          {showHistory && (
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Patient History</h3>
              <PatientHistory patientId={selectedPatient._id || selectedPatient.id} />
            </div>
          )}

          {isLoadingPdfs ? (
            <div className="mb-6 text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p>Loading PDF reports...</p>
            </div>
          ) : pdfReports.length > 0 ? (
            <div className="mb-6 bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Uploaded PDF Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {pdfReports.map((report) => (
                  <div key={report._id} className="bg-white p-3 rounded-md shadow-sm border border-gray-200">
                    <p className="font-medium text-blue-700 mb-2">{report.fileName}</p>
                    <PdfViewer pdfUrl={report.url} fileName={report.fileName} summary={report.summary} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="space-y-4 border p-5 rounded-md bg-gray-50 mb-6 shadow-sm">
            <h3 className="font-semibold text-lg text-gray-800">Add History Entry</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={currentEntry.date}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Doctor Name *</label>
                <input
                  type="text"
                  name="doctorName"
                  value={currentEntry.doctorName}
                  onChange={handleChange}
                  placeholder="Doctor Name"
                  className="w-full border p-2 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Hospital Name *</label>
              <input
                type="text"
                name="hospitalName"
                value={currentEntry.hospitalName}
                onChange={handleChange}
                placeholder="Hospital Name"
                className="w-full border p-2 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Diseases</label>
              <DiseaseInput
                selectedDiseases={currentEntry.diseases}
                setSelectedDiseases={handleUpdateDiseases}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Medicines</label>
              <MedicineInput
                selectedMedicines={currentEntry.medicines}
                setSelectedMedicines={handleUpdateMedicines}
              />
            </div>

            <button
              type="button"
              onClick={handleAddEntry}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200 font-medium"
            >
              {isLoading ? "Processing..." : "Add Entry"}
            </button>
          </div>

          {histories.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-800 flex items-center">
                <span>Entries to Submit</span>
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{histories.length}</span>
              </h3>
              <div className="space-y-3">
                {histories.map((entry, idx) => (
                  <div
                    key={idx}
                    className="border p-4 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-blue-700">{new Date(entry.date).toLocaleDateString()}</h4>
                      <button
                        onClick={() => handleRemoveEntry(idx)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p><span className="font-semibold">Doctor:</span> {entry.doctorName}</p>
                      <p><span className="font-semibold">Hospital:</span> {entry.hospitalName}</p>
                    </div>
                    <div className="mt-2 text-sm">
                      <p><span className="font-semibold">Medicines:</span> {entry.medicines?.length > 0 ? entry.medicines.join(", ") : "None"}</p>
                      <p><span className="font-semibold">Diseases:</span> {entry.diseases?.length > 0 ? entry.diseases.join(", ") : "None"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || histories.length === 0}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200 font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Submitting...
              </span>
            ) : (
              "Submit All Histories"
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default CreatePatientHistory;  