import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicineInput from "../Meds-API/MedicineInput";
import { baseURL } from "../service/baseURL";
import DiseaseInput from "../Meds-API/DiseaseInput";

const CreatePatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [histories, setHistories] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    date: "",
    doctorName: "",
    hospitalName: "",
    medicines: [],
    diseases: [],
    // image: null,
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${baseURL}/patient/getAllPatients`, {
          withCredentials: true,
        });
        setPatients(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        setPatients([]);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setCurrentEntry({ ...currentEntry, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setCurrentEntry({ ...currentEntry, image: e.target.files[0] });
  };

  const handleAddEntry = () => {
    if (!currentEntry.date || !currentEntry.doctorName || !currentEntry.hospitalName) {
      alert("Please fill all fields before adding.");
      return;
    }

    setHistories([...histories, currentEntry]);
    setCurrentEntry({
      date: "",
      doctorName: "",
      hospitalName: "",
      medicines: [],
      diseases: [],
      // image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient?._id && !selectedPatient?.id) {
      alert("No patient selected!");
      return;
    }

    console.log("Submitting all histories for patient:", selectedPatient.name);
    console.log("Histories:", histories);

    // API call will go here
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Patient History</h2>

      {!selectedPatient ? (
        <div className="space-y-2">
          {Array.isArray(patients) && patients.map((p) => (
            <button
              key={p._id || p.id}
              onClick={() => setSelectedPatient(p)}
              className="block w-full text-left bg-gray-100 hover:bg-gray-200 p-2 rounded"
            >
              {p.name}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="text-lg font-medium mb-4">
            Selected Patient: {selectedPatient.name}
          </div>

          {/* Single Entry Form */}
          <div className="space-y-4 border p-4 rounded bg-gray-50 mb-4">
            <h3 className="font-semibold">Add History Entry</h3>

            <input
              type="date"
              name="date"
              value={currentEntry.date}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="doctorName"
              placeholder="Doctor Name"
              value={currentEntry.doctorName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="text"
              name="hospitalName"
              placeholder="Hospital Name"
              value={currentEntry.hospitalName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">Diseases</label>
              <DiseaseInput
                selectedDiseases={currentEntry.diseases}
                setSelectedDiseases={(d) =>
                  setCurrentEntry({ ...currentEntry, diseases: d })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Medicines</label>
              <MedicineInput
                selectedMedicines={currentEntry.medicines}
                setSelectedMedicines={(m) =>
                  setCurrentEntry({ ...currentEntry, medicines: m })
                }
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </div> */}

            <button
              type="button"
              onClick={handleAddEntry}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Entry
            </button>
          </div>

          {/* Preview added histories */}
          {histories.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Entries to Submit</h3>
              {histories.map((entry, idx) => (
                <div
                  key={idx}
                  className="border p-3 mb-2 rounded bg-white shadow-sm"
                >
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Doctor:</strong> {entry.doctorName}</p>
                  <p><strong>Hospital:</strong> {entry.hospitalName}</p>
                  <p><strong>Medicines:</strong> {entry.medicines?.join(", ")}</p>
                  <p><strong>Diseases:</strong> {entry.diseases?.join(", ")}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Submit All Histories
          </button>
        </>
      )}
    </div>
  );
};

export default CreatePatientHistory;