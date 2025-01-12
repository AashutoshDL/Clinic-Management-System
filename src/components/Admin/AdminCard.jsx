import React from 'react';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminCard = ({ title, count, images }) => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md flex-1">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-semibold">{title}</h4>
        <FontAwesomeIcon icon={faBed} className="text-gray-600 text-4xl" />
      </div>
      <p className="text-5xl font-extrabold mb-5">{count}</p>
      <div className="flex items-center gap-2 mt-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-gray-700"
          >
            {image ? (
              <img
                src={image}
                alt={`profile-pic-${index}`}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-500">N/A</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCard;
