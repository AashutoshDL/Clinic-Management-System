import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import axios from "axios";
import { baseURL } from "../service/baseURL";
import HealthMetricsChart from "../service/HealthMetrics";
import MedicineInput from "../Meds-API/MedicineInput";
import PdfViewer from "../service/PdfViewer";

const DoctorReport = () => {
  const [patients, setPatients] = useState([]);
  const [reportTemplates, setReportTemplates] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [viewStats, setViewStats] = useState(false);
  const [viewReport, setViewReport] = useState(false);
  const [uploadedReport, setUploadedReport] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientResponse = await axios.get(
          `${baseURL}/patient/getAllPatients`
        );
        if (
          patientResponse.data.success &&
          Array.isArray(patientResponse.data.data)
        ) {
          setPatients(patientResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const fetchReportTemplates = async () => {
    try {
      const reportResponse = await axios.get(
        `${baseURL}/report/getAllReportTemplates`
      );
      if (
        reportResponse.data.success &&
        Array.isArray(reportResponse.data.data)
      ) {
        setReportTemplates(reportResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching report templates:", error);
    }
  };

  const handleViewReport = async () => {
    try {
      const [patientReportResponse, uploadedReportResponse] = await Promise.all(
        [
          axios.get(
            `${baseURL}/patient/patientReportById/${selectedPatient._id}`
          ),
          axios.get(
            `${baseURL}/uploads/getPDFByPatientId/${selectedPatient._id}`
          ),
        ]
      );
      if (patientReportResponse.data.success) {
        setViewReport(patientReportResponse.data.data);
      }
      if (uploadedReportResponse.data.reports) {
        console.log(uploadedReportResponse.data.reports);
        setUploadedReport(uploadedReportResponse.data.reports);
      }
    } catch (error) {
      console.error("Error fetching reports", error);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSelectedTemplate(null);
    setReportTemplates([]);
    setFormValues({});
    fetchReportTemplates();
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);

    const preFilledValues = {};
    template.customFields.forEach((field, index) => {
      const label = field.label.toLowerCase();
      if (label.includes("name")) {
        preFilledValues[index] = selectedPatient.name;
      } else if (label.includes("age")) {
        preFilledValues[index] = selectedPatient.age;
      } else if (label.includes("gender")) {
        preFilledValues[index] = selectedPatient.gender;
      } else {
        preFilledValues[index] = "";
      }
    });

    setFormValues(preFilledValues);
  };

  const handleFormValueChange = (index, e) => {
    const newValues = { ...formValues };
    newValues[index] = e.target?.value ?? e;
    setFormValues(newValues);
  };

  const saveMedicalReport = async () => {
    const transformedFields = selectedTemplate.customFields.map(
      (field, index) => {
        if (field.label === "Medicine" && Array.isArray(formValues[index])) {
          // Convert the medicine array into a string, separating values with commas
          return {
            label: field.label,
            value: formValues[index].join(", "), // join array values into a comma-separated string
          };
        } else {
          return {
            label: field.label,
            value: formValues[index] || "",
          };
        }
      }
    );

    const reportData = {
      patientId: selectedPatient._id,
      patientName: selectedPatient.name,
      templateTitle: selectedTemplate.title,
      fields: transformedFields,
    };

    try {
      console.log(reportData);
      const response = await axios.post(
        `${baseURL}/patient/createPatientReport`,
        { reportData }
      );
      if (response.data.success) {
        console.log("Report saved successfully");
        setSelectedPatient(null);
        setSelectedTemplate(null);
        setReportTemplates([]);
        setFormValues({});
      } else {
        console.error("Error saving report:", response.data.message);
        setFormValues({});
      }
    } catch (error) {
      console.error("Error saving report to backend:", error);
      setFormValues({});
    }
  };

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
        const text = Array.isArray(formValues[index])
          ? `${field.label}: ${formValues[index].join(", ")}`
          : `${field.label}: ${formValues[index]}`;
        doc.text(text, 20, y);
        y += 10;
      }
    });

    doc.save(`${selectedPatient.name}_report.pdf`);
  };

  const handleViewStats = () => {
    setViewStats(true);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Doctor Report Generation</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select Patient</h2>
        <div className="grid grid-cols-3 gap-4">
          {patients?.map((patient) => (
            <div
              key={patient._id}
              onClick={() => handlePatientSelect(patient)}
              className={`p-4 border rounded-lg cursor-pointer ${
                selectedPatient?.id === patient.id
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <h3 className="font-semibold text-lg">{patient._id}</h3>
              <p>Age: {patient.age}</p>
              <p>Gender: {patient.gender}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPatient && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold">Patient Details:</h2>
          <p>
            <strong>Name:</strong> {selectedPatient.name}
          </p>
          <p>
            <strong>Age:</strong> {selectedPatient.age}
          </p>
          <p>
            <strong>Gender:</strong> {selectedPatient.gender}
          </p>
          <button
            onClick={handleViewStats}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Stats
          </button>
          <br />
          <button
            onClick={handleViewReport}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Reports
          </button>
        </div>
      )}

      {viewStats && selectedPatient && (
        <HealthMetricsChart data={[selectedPatient]} loading={false} />
      )}

      {uploadedReport.length > 0 && (
        <PdfViewer pdfUrl={uploadedReport[0].url} />
      )}


      {selectedPatient && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Report Template</h2>
          <div className="grid grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <div
                key={template._id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedTemplate?.id === template.id
                    ? "bg-green-600 text-white"
                    : "bg-white hover:bg-gray-200"
                }`}
              >
                <h3 className="font-semibold text-lg">{template.title}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewReport && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Patient Reports</h2>
          {viewReport.map((report, idx) => (
            <div key={idx} className="mb-4 p-2 border rounded">
              <h3 className="font-semibold">{report.templateTitle}</h3>
              {report.fields.map((field, i) => (
                <p key={i}>
                  <strong>{field.label}:</strong> {field.value}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Fill Out Report</h2>
          {selectedTemplate.customFields.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.label.toLowerCase().includes("medicine") ||
              field.label.toLowerCase().includes("medication") ? (
                <MedicineInput
                  selectedMedicines={formValues[index] || []}
                  setSelectedMedicines={(meds) =>
                    handleFormValueChange(index, { target: { value: meds } })
                  }
                />
              ) : (
                <input
                  type="text"
                  value={formValues[index] || ""}
                  onChange={(e) => handleFormValueChange(index, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
                  placeholder={`Enter ${field.label}`}
                />
              )}
            </div>
          ))}

          <button
            onClick={saveMedicalReport}
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Data
          </button>

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
