import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MedicineInput from "../Meds-API/MedicineInput";
import DiseaseInput from "../Meds-API/DiseaseInput";
import { baseURL } from "../service/baseURL";
import PatientHistory from "./PatientHistory"; // Make sure path is correct

const CreatePatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

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
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

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
      console.log(res.data);

      // Reset form
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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Patient History</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading && !selectedPatient ? (
        <div className="text-center py-4">Loading patients...</div>
      ) : !selectedPatient ? (
        <div className="space-y-2">
          <h3 className="font-semibold mb-2">Select a Patient</h3>
          {Array.isArray(patients) && patients.length > 0 ? (
            patients.map((patient) => (
              <button
                key={patient._id || patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="block w-full text-left bg-gray-100 hover:bg-gray-200 p-2 rounded"
              >
                {patient.name}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No patients available</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium">
              Patient: <span className="font-bold">{selectedPatient.name}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowHistory((prev) => !prev)}
                className="text-green-600 hover:underline"
              >
                {showHistory ? "Hide History" : "View History"}
              </button>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setShowHistory(false);
                }}
                className="text-blue-600 hover:underline"
              >
                Change Patient
              </button>
            </div>
          </div>

          {showHistory && (
            <div className="mb-6">
              <PatientHistory patientId={selectedPatient._id || selectedPatient.id} />
            </div>
          )}

          <div className="space-y-4 border p-4 rounded bg-gray-50 mb-4">
            <h3 className="font-semibold">Add History Entry</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={currentEntry.date}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Doctor Name *</label>
                <input
                  type="text"
                  name="doctorName"
                  placeholder="Doctor Name"
                  value={currentEntry.doctorName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hospital Name *</label>
              <input
                type="text"
                name="hospitalName"
                placeholder="Hospital Name"
                value={currentEntry.hospitalName}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Diseases</label>
              <DiseaseInput
                selectedDiseases={currentEntry.diseases}
                setSelectedDiseases={handleUpdateDiseases}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Medicines</label>
              <MedicineInput
                selectedMedicines={currentEntry.medicines}
                setSelectedMedicines={handleUpdateMedicines}
              />
            </div>

            <button
              type="button"
              onClick={handleAddEntry}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? "Processing..." : "Add Entry"}
            </button>
          </div>

          {/* Preview added histories */}
          {histories.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Entries to Submit ({histories.length})</h3>
              {histories.map((entry, idx) => (
                <div
                  key={idx}
                  className="border p-3 mb-2 rounded bg-white shadow-sm"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{entry.date}</h4>
                    <button
                      onClick={() => handleRemoveEntry(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <p><strong>Doctor:</strong> {entry.doctorName}</p>
                  <p><strong>Hospital:</strong> {entry.hospitalName}</p>
                  <p><strong>Medicines:</strong> {entry.medicines?.length ? entry.medicines.join(", ") : "None"}</p>
                  <p><strong>Diseases:</strong> {entry.diseases?.length ? entry.diseases.join(", ") : "None"}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || histories.length === 0}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Submitting..." : "Submit All Histories"}
          </button>
        </>
      )}
    </div>
  );
};

export default CreatePatientHistory;
