import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicineInput from "../Meds-API/MedicineInput"; // Make sure this file exists
import { baseURL } from "../service/baseURL"; // Replace with your actual baseURL
import DiseaseInput from "../Meds-API/DiseaseInput";

const CreatePatientHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    doctorName: "",
    hospitalName: "",
  });
  const [Medicines, setMedicines] = useState([]);
  const [Diseases, setDiseases] = useState([]);
  const [image, setImage] = useState(null);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${baseURL}/patient/getAllPatients`, {
          withCredentials: true,
        });
        console.log("Fetched Patients:", res.data);
        setPatients(res.data?.data || []); // Safely extract patients
      } catch (error) {
        console.error("Failed to fetch patients:", error);
        setPatients([]); // Fallback to empty array
      }
    };

    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatient?._id && !selectedPatient?.id) {
      alert("No patient selected!");
      return;
    }

    const form = new FormData();
    form.append("patientId", selectedPatient._id || selectedPatient.id);
    form.append("date", formData.date);
    form.append("doctorName", formData.doctorName);
    form.append("hospitalName", formData.hospitalName);
    form.append("Medicines", JSON.stringify(Medicines));
    if (image) form.append("image", image);

    try {
      await axios.post(`${baseURL}/history/saveHistory`, form);
      alert("History saved successfully!");
      // Reset
      setFormData({ date: "", doctorName: "", hospitalName: "" });
      setMedicines([]);
      setImage(null);
      setSelectedPatient(null);
    } catch (err) {
      console.error("Error submitting history:", err);
      alert("Failed to save history.");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-lg font-medium">
            Selected Patient: {selectedPatient.name}
          </div>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="doctorName"
            placeholder="Doctor Name"
            value={formData.doctorName}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="hospitalName"
            placeholder="Hospital Name"
            value={formData.hospitalName}
            onChange={handleInputChange}
            className="w-full border p-2 rounded"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Diseases
            </label>
            <DiseaseInput
              selectedDiseases={Diseases}
              setSelectedDiseases={setDiseases}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Medicines
            </label>
            <MedicineInput
              selectedMedicines={Medicines}
              setSelectedMedicines={setMedicines}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save History
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatePatientHistory;