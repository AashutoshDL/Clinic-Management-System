import React from 'react';
import { Bed } from 'lucide-react'; 

const AdminCard = ({ title, count, images }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex-1 transition-all hover:shadow-xl transform hover:scale-105">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-gray-700">{title}</h4>
        <Bed className="text-gray-600 text-3xl" />
      </div>
      <p className="text-4xl font-extrabold text-gray-800 mb-5">{count}</p>
      <div className="flex items-center gap-3 mt-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300"
          >
            {image ? (
              <img
                src={image}
                alt={`profile-pic-${index}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-lg font-bold">N/A</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCard;
