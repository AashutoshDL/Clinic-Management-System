import React, { useEffect, useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import axios from 'axios';

const PdfViewer = ({ pdfUrl }) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
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

    // Cleanup object URL when component unmounts or pdfUrl changes
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="pdf-container border border-gray-300 rounded" style={{ height: '500px' }}>
      {pdfBlobUrl ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
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
    </div>
  );
};

export default PdfViewer;
