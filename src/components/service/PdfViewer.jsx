import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import axios from 'axios';
import { baseURL } from './baseURL';

const PdfViewer = ({ pdfUrl, summary: summaryProp }) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!pdfUrl) return;

    axios
      .get(pdfUrl, { responseType: 'blob' })
      .then((res) => {
        const blobUrl = URL.createObjectURL(res.data);
        setPdfBlobUrl(blobUrl);
      })
      .catch((err) => {
        console.error("Failed to load PDF", err);
      });

    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfUrl]);

  const handleSummarize = async () => {
    try {
      setIsSummarizing(true);
      const response = await axios.post(`${baseURL}/uploads/summarizePdf`, { pdfUrl });
      if (response.data && response.data.summary) {
        setSummary(response.data.summary);
      } else {
        setSummary('No summary available.');
      }
    } catch (error) {
      console.error("Failed to fetch summary", error);
      setSummary('Error summarizing PDF.');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="pdf-container border border-gray-300 rounded p-4" style={{ height: 'auto' }}>
      {pdfBlobUrl ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfBlobUrl}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={1}
            renderError={(error) => (
              <div className="text-red-600 p-4">
                Error loading PDF: {error?.message || 'Please try downloading it instead.'}
              </div>
            )}
          />
        </Worker>
      ) : (
        <div className="p-4">Loading PDF...</div>
      )}

      {/* Show Summarize Button if no summary is passed via props */}
      {!summaryProp && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSummarize}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={isSummarizing}
          >
            {isSummarizing ? 'Summarizing...' : 'Summarize PDF'}
          </button>
        </div>
      )}

      {/* Display summary from prop or from state */}
      {(summaryProp || summary) && (
        <div className="mt-4 p-3 bg-gray-100 border rounded">
          <h3 className="text-lg font-semibold mb-2">Summary:</h3>
          <p className="text-gray-800">{summaryProp || summary}</p>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;