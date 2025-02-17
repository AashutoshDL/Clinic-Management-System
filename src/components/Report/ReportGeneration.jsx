import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const ReportGeneration = () => {
  const [title, setTitle] = useState('');
  const [customFields, setCustomFields] = useState([{ label: '', value: '' }]);
  const [formValues, setFormValues] = useState({});
  const [templateGenerated, setTemplateGenerated] = useState(false);

  const handleFieldChange = (index, e) => {
    if (templateGenerated) return;
    const newFields = [...customFields];
    newFields[index][e.target.name] = e.target.value;
    setCustomFields(newFields);
  };

  const handleFormValueChange = (index, e) => {
    const newValues = { ...formValues };
    newValues[index] = e.target.value;
    setFormValues(newValues);
  };

  const addField = () => {
    if (templateGenerated) return;
    setCustomFields([...customFields, { label: '', value: '' }]);
  };

  const removeField = (index) => {
    if (templateGenerated) return;
    const newFields = customFields.filter((_, i) => i !== index);
    setCustomFields(newFields);

    const newValues = { ...formValues };
    delete newValues[index];
    setFormValues(newValues);
  };

  const generateTemplate = () => {
    setTemplateGenerated(true);
  };

  const resetTemplate = () => {
    setTemplateGenerated(false);
    setFormValues({});
  };

  const generateReportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 20, 20);

    let y = 30;
    customFields.forEach((field, index) => {
      if (field.label && formValues[index]) {
        doc.setFontSize(12);
        doc.text(`${field.label}: ${formValues[index]}`, 20, y);
        y += 10;
      }
    });

    doc.save('generated_report.pdf');
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">PDF Generator</h1>

        {/* Template Design Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Design Template</h2>
          
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={templateGenerated}
            />
          </div>

          <h3 className="text-lg font-medium mb-2">Custom Fields</h3>
          {customFields.map((field, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="text"
                name="label"
                value={field.label}
                onChange={(e) => handleFieldChange(index, e)}
                placeholder="Field Label"
                className="border border-gray-300 rounded-md px-3 py-2 mr-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={templateGenerated}
              />
              <input
                type="text"
                name="value"
                value={field.value}
                onChange={(e) => handleFieldChange(index, e)}
                placeholder="Default Value (optional)"
                className="border border-gray-300 rounded-md px-3 py-2 mr-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={templateGenerated}
              />
              {!templateGenerated && (
                <button
                  onClick={() => removeField(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {!templateGenerated && (
            <button 
              onClick={addField} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Add Field
            </button>
          )}

          <div className="flex space-x-4 mt-4">
            {!templateGenerated ? (
              <button
                onClick={generateTemplate}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Generate Template
              </button>
            ) : (
              <button
                onClick={resetTemplate}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Reset Template
              </button>
            )}
          </div>
        </div>

        {/* Report Fill Section */}
        {templateGenerated && (
          <>
            <div className="border-t border-gray-300 pt-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Fill Report</h2>
              <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
                {customFields.map((field, index) => (
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

            {/* Template Preview Section */}
            <div className="border-t border-gray-300 pt-6">
              <h2 className="text-xl font-semibold mb-4">Template Preview</h2>
              <div className="p-4 border border-gray-300 rounded-md bg-gray-100">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                {customFields.map((field, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-medium">{field.label}:</span> {formValues[index] || '_______________'}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportGeneration;