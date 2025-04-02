import React from 'react';
import { Trash2 } from 'lucide-react';

const DeletingScreen = () => {
  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        style={{ pointerEvents: 'none' }}
      />
      
      <div className="relative h-full flex items-center justify-center px-4 pointer-events-none">
        <div 
          className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center
                     animate-fade-in transform transition-all duration-300"
        >
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600 animate-bounce" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Deleting...
          </h2>
          
          <p className="text-gray-600 mb-4">
            Please wait while we remove your content
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeletingScreen;