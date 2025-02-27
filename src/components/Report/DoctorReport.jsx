import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

const DoctorReport = () => {
  const [reportTemplates, setReportTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('http://localhost:3001/report/getAllReportTemplates');
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setReportTemplates(result.data);
        } else {
          console.error('Invalid data format:', result);
          setReportTemplates([]); // Ensure it's an array to prevent map() errors
        }
      } catch (error) {
        console.error('Error fetching report templates:', error);
        setReportTemplates([]); // Set an empty array to prevent crashes
      }
    };
    fetchTemplates();
  }, []);
  

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const initialValues = {};
    template.customFields.forEach((field, index) => {
      initialValues[index] = field.value || '';
    });
    setFormValues(initialValues);
  };

  const handleFormValueChange = (index, e) => {
    const newValues = { ...formValues };
    newValues[index] = e.target.value;
    setFormValues(newValues);
  };

  const generateReportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(selectedTemplate.title, 20, 20);

    let y = 30;
    selectedTemplate.customFields.forEach((field, index) => {
      if (field.label && formValues[index]) {
        doc.setFontSize(12);
        doc.text(`${field.label}: ${formValues[index]}`, 20, y);
        y += 10;
      }
    });

    doc.save('report.pdf');
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Select a Report Template</h1>
      <div className="mb-4">
        {reportTemplates.map((template, index) => (
          <button
            key={index}
            onClick={() => handleTemplateSelect(template)}
            className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
          >
            {template.title}
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Fill Report: {selectedTemplate.title}</h2>
          <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
            {selectedTemplate.customFields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">{field.label}:</label>
                <input
                  type="text"
                  value={formValues[index] || ''}
                  onChange={(e) => handleFormValueChange(index, e)}
                  placeholder={field.value || `Enter ${field.label}`}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <button
            onClick={generateReportPDF}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Generate PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorReport;