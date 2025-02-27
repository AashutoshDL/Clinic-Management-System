import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportGeneration = () => {
  const [title, setTitle] = useState('');
  const [customFields, setCustomFields] = useState([{ label: '', value: '' }]);
  const [templateCreated, setTemplateCreated] = useState(false);
  const [savedTemplate, setSavedTemplate] = useState(null);
  const [fetchedReport, setFetchedReport] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchReportTemplate();
  }, []);

  const fetchReportTemplate = async () => {
    try {
      const response = await axios.get('http://localhost:3001/report/getReportTemplateById/67bf9c9dcb2b6866bd231bd5');
      setFetchedReport(response.data.data);
    } catch (error) {
      console.error('Error fetching report template:', error.response?.data || error.message);
    }
  };

  const handleFieldChange = (index, e) => {
    const newFields = [...customFields];
    newFields[index][e.target.name] = e.target.value;
    setCustomFields(newFields);
  };

  const addField = () => {
    setCustomFields([...customFields, { label: '', value: '' }]);
  };

  const removeField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const generateTemplate = async () => {
    try {
      const response = await axios.post('http://localhost:3001/report/createReportTemplate', {
        title,
        customFields
      });

      console.log('Template Created:', response.data);

      setSavedTemplate({
        title: response.data.data.title,
        customFields: response.data.data.customFields
      });

      setTemplateCreated(true);
    } catch (error) {
      console.error('Error creating template:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Report Template Creator</h1>

        {!templateCreated ? (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Title"
                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                />
                <button
                  onClick={() => removeField(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={addField}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Add Field
            </button>

            <div className="mt-4">
              <button
                onClick={generateTemplate}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Generate Template
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <h2 className="text-xl font-semibold">Template Saved!</h2>
            <p className="text-gray-700 mt-2">Title: <strong>{savedTemplate.title}</strong></p>
            <ul className="list-disc pl-5 mt-2">
              {savedTemplate.customFields.map((field, index) => (
                <li key={index} className="text-gray-700">{field.label}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Display the fetched report template BELOW the creation form */}
      {fetchedReport && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2
            className="text-xl font-semibold text-blue-600 cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            {fetchedReport.title}
          </h2>
          {showDetails && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">Report Details:</h3>
              <div className="border border-gray-300 rounded-md p-4 mt-2 bg-gray-50">
                {fetchedReport.customFields.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {fetchedReport.customFields.map((field, index) => (
                      <li key={index} className="mb-2">
                        <strong className="text-gray-800">{field.label}:</strong> {field.value || 'N/A'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No custom fields available.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportGeneration;