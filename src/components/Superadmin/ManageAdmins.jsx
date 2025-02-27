import React, { useState } from 'react';
import CreateAdmin from './CreateAdmin';

const ManageAdmins = () => {
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [admins, setAdmins] = useState([
    { id: 1, name: 'Admin One' },
    { id: 2, name: 'Admin Two' },
    { id: 3, name: 'Admin Three' }
  ]);

  const handleDelete = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setShowCreateAdmin(!showCreateAdmin)} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          {showCreateAdmin ? 'Close' : 'Add Admin'}
        </button>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-bold">Total Admins: {admins.length}</h2>
        </div>
      </div>
      
      {showCreateAdmin && <CreateAdmin />}

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Admin List</h2>
        <ul>
          {admins.map(admin => (
            <li key={admin.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2">
              <span>{admin.name}</span>
              <div> 
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(admin.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageAdmins;
