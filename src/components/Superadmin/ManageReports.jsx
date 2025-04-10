import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReportGeneration from '../Report/ReportGeneration';
import { baseURL } from '../service/baseURL';
import DeletingScreen from '../Ui/DeletingScreen';

const ManageReports = () => {
  const [reportTemplates, setReportTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editedTemplate, setEditedTemplate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReportTemplates = async () => {
      try {
        const response = await axios.get(`${baseURL}/report/getAllReportTemplates`, { withCredentials: true });
        if (response.data.success && Array.isArray(response.data.data)) {
          setReportTemplates(response.data.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        setError('Failed to fetch report templates');
      } finally {
        setLoading(false);
      }
    };
    fetchReportTemplates();
  }, []);

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setEditedTemplate({ ...template });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleLabelChange = (index, e) => {
    const { value } = e.target;
    const updatedFields = [...editedTemplate.customFields];
    updatedFields[index].label = value;
    setEditedTemplate((prev) => ({ ...prev, customFields: updatedFields }));
  };

  const handleUpdateTemplate = async () => {
    try {
      const response = await axios.patch(`${baseURL}/report/updateReportTemplate/${selectedTemplate._id}`, editedTemplate, { withCredentials: true });
      if (response.data.success) {
        setReportTemplates((prev) => prev.map((template) =>
          template._id === selectedTemplate._id ? response.data.data : template
        ));
        setSelectedTemplate(null);
        setEditedTemplate(null);
      } else {
        setError('Failed to update template');
      }
    } catch (err) {
      setError('Error updating template');
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`${baseURL}/report/deleteReportTemplate/${templateId}`, { withCredentials: true });
      if (response.data.success) {
        setReportTemplates((prev) => prev.filter((template) => template._id !== templateId));
        setIsDeleting(false);
      } else {
        setError('Failed to delete template');
        setIsDeleting(false);
      }
    } catch (err) {
      setError('Error deleting template');
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Reports</h1>
      <ReportGeneration />
      {loading && <p>Loading report templates...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <h2 className="text-xl font-semibold mt-6">Available Report Templates</h2>
        <ul className="mt-4 space-y-2">
          {reportTemplates.length > 0 ? (
            reportTemplates.map((template) => (
              <li key={template._id} className="p-4 border rounded-lg shadow-md">
                <h3 className="text-lg font-bold">{template.title}</h3>
                <p>{template.description || 'No description available'}</p>
                <p className="text-sm text-gray-500">
                  Created on: {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <div className="flex mt-2">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="mr-4 text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p>No report templates available.</p>
          )}
        </ul>
      </div>

      {editedTemplate && (
        <div className="mt-8 p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Edit Report Template</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={editedTemplate.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={editedTemplate.description || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-lg">Custom Fields</h3>
            {editedTemplate.customFields.map((field, index) => (
              <div key={field._id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Label: {field.label}</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => handleLabelChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  placeholder={`Edit label for ${field.label}`}
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleUpdateTemplate}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Template
          </button>
        </div>
      )}

      {isDeleting && <DeletingScreen />}
    </div>
  );
};

export default ManageReports;
