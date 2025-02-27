import React, { useState } from 'react';
import { Plus, File, Image, Trash2 } from 'lucide-react';

const PatientHistory = () => {
  const [diagnoses, setDiagnoses] = useState([
    { id: 1, date: '2023-10-26', diagnosis: 'Common Cold', details: 'Mild cold symptoms.' },
    { id: 2, date: '2023-10-20', diagnosis: 'Flu', details: 'High fever and body aches.' },
  ]);

  const [newDiagnosis, setNewDiagnosis] = useState({ date: '', diagnosis: '', details: '' });
  const [medicalReports, setMedicalReports] = useState([]);
  const [medicalImages, setMedicalImages] = useState([]);

  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({ name: '', dosage: '', frequency: '' });

  const handleInputChange = (e) => {
    setNewDiagnosis({ ...newDiagnosis, [e.target.name]: e.target.value });
  };

  const handleAddDiagnosis = () => {
    if (newDiagnosis.date && newDiagnosis.diagnosis) {
      setDiagnoses([...diagnoses, { ...newDiagnosis, id: diagnoses.length + 1 }]);
      setNewDiagnosis({ date: '', diagnosis: '', details: '' });
    } else {
      alert("Please fill the required field");
    }
  };

  const handleReportUpload = (e) => {
    const file = e.target.files[0];
    setMedicalReports([...medicalReports, file]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setMedicalImages([...medicalImages, file]);
  };

  const handleDeleteDiagnosis = (id) => {
    setDiagnoses(diagnoses.filter(item => item.id !== id));
  };

  const handleDeleteReport = (index) => {
    setMedicalReports(medicalReports.filter((_, i) => i !== index));
  };

  const handleDeleteImage = (index) => {
    setMedicalImages(medicalImages.filter((_, i) => i !== index));
  };

  const handleMedicineInputChange = (e) => {
    setNewMedicine({ ...newMedicine, [e.target.name]: e.target.value });
  };

  const handleAddMedicine = () => {
    if (newMedicine.name) {
      setMedicines([...medicines, { ...newMedicine, id: medicines.length + 1 }]);
      setNewMedicine({ name: '', dosage: '', frequency: '' });
    } else {
      alert("Medicine name is required.");
    }
  };

  const handleDeleteMedicine = (id) => {
    setMedicines(medicines.filter(medicine => medicine.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medical History</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Diagnoses</h2>
        <table className="min-w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Diagnosis</th>
              <th className="border px-4 py-2">Details</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {diagnoses.map((item) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{item.date}</td>
                <td className="border px-4 py-2">{item.diagnosis}</td>
                <td className="border px-4 py-2">{item.details}</td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => handleDeleteDiagnosis(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2">
                <input type="date" name="date" value={newDiagnosis.date} onChange={handleInputChange} className="border rounded p-1 w-full" />
              </td>
              <td className="border px-4 py-2">
                <input type="text" name="diagnosis" value={newDiagnosis.diagnosis} onChange={handleInputChange} className="border rounded p-1 w-full" />
              </td>
              <td className="border px-4 py-2">
                <textarea name="details" value={newDiagnosis.details} onChange={handleInputChange} className="border rounded p-1 w-full"></textarea>
              </td>
              <td className="border px-4 py-2 text-center">
                <button onClick={handleAddDiagnosis} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                  <Plus size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Medicines</h2>
        <table className="min-w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Dosage</th>
              <th className="border px-4 py-2">Frequency</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td className="border px-4 py-2">{medicine.name}</td>
                <td className="border px-4 py-2">{medicine.dosage}</td>
                <td className="border px-4 py-2">{medicine.frequency}</td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => handleDeleteMedicine(medicine.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2">
                <input type="text" name="name" value={newMedicine.name} onChange={handleMedicineInputChange} className="border rounded p-1 w-full" placeholder="Medicine Name" />
              </td>
              <td className="border px-4 py-2">
                <input type="text" name="dosage" value={newMedicine.dosage} onChange={handleMedicineInputChange} className="border rounded p-1 w-full" placeholder="Dosage (e.g., 10mg)" />
              </td>
              <td className="border px-4 py-2">
                <input type="text" name="frequency" value={newMedicine.frequency} onChange={handleMedicineInputChange} className="border rounded p-1 w-full" placeholder="Frequency (e.g., Twice daily)" />
              </td>
              <td className="border px-4 py-2 text-center">
                <button onClick={handleAddMedicine} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                  <Plus size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Medical Reports</h2>
        <input type="file" onChange={handleReportUpload} className="mb-2" />
        <ul>
          {medicalReports.map((report, index) => (
            <li key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200">
              <span>{report.name}</span>
              <button onClick={() => handleDeleteReport(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Medical Images</h2>
        <input type="file" onChange={handleImageUpload} className="mb-2" />
        <ul>
          {medicalImages.map((image, index) => (
            <li key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-200">
              <span>{image.name}</span>
              <button onClick={() => handleDeleteImage(index)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientHistory;
