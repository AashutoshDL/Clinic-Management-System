import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { baseURL } from '../service/baseURL';

const DoctorReport = () => {
  const [patients, setPatients] = useState([]);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formValues, setFormValues] = useState({});

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientResponse = await axios.get(`${baseURL}/patient/getAllPatients`);
        if (patientResponse.data.success && Array.isArray(patientResponse.data.data)) {
          setPatients(patientResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  // Fetch report templates
  const fetchReportTemplates = async () => {
    try {
      const reportResponse = await axios.get(`${baseURL}/report/getAllReportTemplates`);
      if (reportResponse.data.success && Array.isArray(reportResponse.data.data)) {
        setReportTemplates(reportResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching report templates:', error);
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSelectedTemplate(null);
    setReportTemplates([]);
    setFormValues({});
    fetchReportTemplates();
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormValues({}); // Reset form values on new template selection
  };

  // Handle form field change
  const handleFormValueChange = (index, e) => {
    const newValues = { ...formValues };
    newValues[index] = e.target.value;
    setFormValues(newValues);
  };

  // Generate PDF report and save to backend
  const generateReportPDF = async () => {
    if (!selectedTemplate || !selectedPatient) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Report for ${selectedPatient.name}`, 20, 20);
    doc.setFontSize(14);
    doc.text(selectedTemplate.title, 20, 30);

    let y = 40;
    selectedTemplate.customFields.forEach((field, index) => {
      if (field.label && formValues[index]) {
        doc.setFontSize(12);
        doc.text(`${field.label}: ${formValues[index]}`, 20, y);
        y += 10;
      }
    });

    // Prepare report data for saving
    const reportData = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      templateTitle: selectedTemplate.title,
      fields: selectedTemplate.customFields.map((field, index) => ({
        label: field.label,
        value: formValues[index] || '',
      })),
    };

    try {
      // Send the report data to the backend API to save medical history
      const response = await axios.post(`${baseURL}/patient/medicalHistory`, { 
        patientId: selectedPatient.id, 
        reportData 
      });

      if (response.data.success) {
        console.log('Report saved successfully');
      } else {
        console.error('Error saving report:', response.data.message);
      }
    } catch (error) {
      console.error('Error saving report to backend:', error);
    }

    // Generate PDF
    doc.save(`${selectedPatient.name}_report.pdf`);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Doctor Report Generation</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Patient</h2>
        <div className="grid grid-cols-3 gap-4">
          {patients?.map((patient) => (
            <div
              key={patient.id}
              onClick={() => handlePatientSelect(patient)}
              className={`p-4 border rounded-lg cursor-pointer ${selectedPatient?.id === patient.id ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-200'}`}
            >
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <p>Age: {patient.age}</p>
              <p>Gender: {patient.gender}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Display selected patient's details */}
      {selectedPatient && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Patient Details:</h2>
          <p><strong>Name:</strong> {selectedPatient.name}</p>
          <p><strong>Age:</strong> {selectedPatient.age}</p>
          <p><strong>Gender:</strong> {selectedPatient.gender}</p>
        </div>
      )}

      {/* Report Template Selection */}
      {selectedPatient && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Report Template</h2>
          <div className="grid grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 border rounded-lg cursor-pointer ${selectedTemplate?.id === template.id ? 'bg-green-600 text-white' : 'bg-white hover:bg-gray-200'}`}
              >
                <h3 className="font-semibold text-lg">{template.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Form */}
      {selectedTemplate && selectedPatient && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">
            {selectedTemplate.title} for {selectedPatient.name}
          </h2>

          <div className="space-y-4">
            {selectedTemplate.customFields.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type="text"
                  value={formValues[index] || ''}
                  onChange={(e) => handleFormValueChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  placeholder={`Enter ${field.label}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={generateReportPDF}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate PDF Report
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorReport;
