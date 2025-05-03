import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import axios from 'axios';
import { baseURL } from './baseURL';

const PdfViewer = ({ pdfUrl, fileName, summary: summaryProp }) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  
  useEffect(() => {
    if (!pdfUrl) return;
    
    setError(null);
    
    axios
      .get(pdfUrl, { responseType: 'blob' })
      .then((res) => {
        const blobUrl = URL.createObjectURL(res.data);
        setPdfBlobUrl(blobUrl);
      })
      .catch((err) => {
        console.error("Failed to load PDF", err);
        setError("Failed to load PDF. Please try again later.");
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
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="pdf-container border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
      <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b">
        <button 
          onClick={toggleExpand} 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* PDF Viewer with fixed height and scrolling */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'h-screen max-h-screen' : 'h-96'
        }`}
      >
        {error ? (
          <div className="flex items-center justify-center h-full bg-red-50 p-4 text-red-600">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-2">{error}</p>
            </div>
          </div>
        ) : pdfBlobUrl ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div className="h-full overflow-auto">
              <Viewer
                fileUrl={pdfBlobUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={1}
                renderError={(viewerError) => (
                  <div className="flex items-center justify-center h-full bg-red-50 p-4 text-red-600">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="mt-2">
                        Error loading PDF: {viewerError?.message || 'Please try downloading it instead.'}
                      </p>
                    </div>
                  </div>
                )}
              />
            </div>
          </Worker>
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Actions and Summary section */}
      <div className="p-4 bg-gray-50 border-t">
        {/* Show Summarize Button if no summary is passed via props */}
        {!summaryProp && !summary && (
          <div className="mb-4">
            <button
              onClick={handleSummarize}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center"
              disabled={isSummarizing}
            >
              {isSummarizing ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Summarizing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Summarize PDF
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Display summary from prop or from state */}
        {(summaryProp || summary) && (
          <div className="bg-white border rounded-md p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Summary
            </h3>
            <div className="text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
              {summaryProp || summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;