import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const DoctorHistory = () => {
  const [treatedPatients, setTreatedPatients] = useState([
    { id: 1, name: 'John Doe', diagnosis: 'Flu', date: '2023-10-20' },
    { id: 2, name: 'Jane Smith', diagnosis: 'High Fever', date: '2023-10-22' },
  ]);

  const [newPatient, setNewPatient] = useState({ name: '', diagnosis: '', date: '' });
  
  const [hospitals, setHospitals] = useState([
    { id: 1, hospitalName: 'City Hospital', startDate: '2022-01-01', endDate: '2023-01-01' },
    { id: 2, hospitalName: 'General Health Clinic', startDate: '2023-02-01', endDate: '2024-02-01' },
  ]);

  const [newHospital, setNewHospital] = useState({ hospitalName: '', startDate: '', endDate: '' });

  const handlePatientInputChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const handleAddPatient = () => {
    if (newPatient.name && newPatient.diagnosis) {
      setTreatedPatients([...treatedPatients, { ...newPatient, id: treatedPatients.length + 1 }]);
      setNewPatient({ name: '', diagnosis: '', date: '' });
    } else {
      alert('Please fill all the fields for the patient.');
    }
  };

  const handleHospitalInputChange = (e) => {
    setNewHospital({ ...newHospital, [e.target.name]: e.target.value });
  };

  const handleAddHospital = () => {
    if (newHospital.hospitalName && newHospital.startDate) {
      setHospitals([...hospitals, { ...newHospital, id: hospitals.length + 1 }]);
      setNewHospital({ hospitalName: '', startDate: '', endDate: '' });
    } else {
      alert('Please fill all the fields for the hospital.');
    }
  };

  const handleDeletePatient = (id) => {
    setTreatedPatients(treatedPatients.filter(patient => patient.id !== id));
  };

  const handleDeleteHospital = (id) => {
    setHospitals(hospitals.filter(hospital => hospital.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Doctor History</h1>

      {/* Treated Patients Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Treated Patients</h2>
        <table className="min-w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Patient Name</th>
              <th className="border px-4 py-2">Diagnosis</th>
              <th className="border px-4 py-2">Date of Treatment</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatedPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="border px-4 py-2">{patient.name}</td>
                <td className="border px-4 py-2">{patient.diagnosis}</td>
                <td className="border px-4 py-2">{patient.date}</td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => handleDeletePatient(patient.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="name"
                  value={newPatient.name}
                  onChange={handlePatientInputChange}
                  className="border rounded p-1 w-full"
                  placeholder="Patient Name"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="diagnosis"
                  value={newPatient.diagnosis}
                  onChange={handlePatientInputChange}
                  className="border rounded p-1 w-full"
                  placeholder="Diagnosis"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  name="date"
                  value={newPatient.date}
                  onChange={handlePatientInputChange}
                  className="border rounded p-1 w-full"
                />
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={handleAddPatient}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  <Plus size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Hospitals Worked At Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Hospitals Worked At</h2>
        <table className="min-w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Hospital Name</th>
              <th className="border px-4 py-2">Start Date</th>
              <th className="border px-4 py-2">End Date</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td className="border px-4 py-2">{hospital.hospitalName}</td>
                <td className="border px-4 py-2">{hospital.startDate}</td>
                <td className="border px-4 py-2">{hospital.endDate}</td>
                <td className="border px-4 py-2 text-center">
                  <button onClick={() => handleDeleteHospital(hospital.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  name="hospitalName"
                  value={newHospital.hospitalName}
                  onChange={handleHospitalInputChange}
                  className="border rounded p-1 w-full"
                  placeholder="Hospital Name"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  name="startDate"
                  value={newHospital.startDate}
                  onChange={handleHospitalInputChange}
                  className="border rounded p-1 w-full"
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="date"
                  name="endDate"
                  value={newHospital.endDate}
                  onChange={handleHospitalInputChange}
                  className="border rounded p-1 w-full"
                />
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={handleAddHospital}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                  <Plus size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorHistory;
