import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PdfViewer = ({ pdfUrl, fileName }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div
      className="pdf-container border border-gray-300 rounded"
      style={{ height: "500px" }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[defaultLayoutPluginInstance]}
          defaultScale={1}
          renderError={() => (
            <div className="text-red-600 p-4">
              Unable to load the PDF. Please try downloading it instead.
            </div>
          )}
        />
      </Worker>
    </div>
  );
};

export default PdfViewer;