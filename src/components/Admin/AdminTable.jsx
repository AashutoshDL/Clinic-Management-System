import React from 'react';

const AdminTable = ({tableData}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border border-gray-300 text-left">Client</th>
            <th className="px-4 py-2 border border-gray-300 text-left">Role</th>
            <th className="px-4 py-2 border border-gray-300 text-left">Account Created</th>
            <th className="px-4 py-2 border border-gray-300 text-center">Edit Account</th>
            <th className="px-4 py-2 border border-gray-300 text-center">Delete</th>
          </tr>
        </thead>
        <tbody>
    
          {tableData.map((data,index)=>(
            <tr key={index}>
            <td className="px-4 py-2 border border-gray-300 flex items-center gap-2">
              <img
                src={data.imgSrc}
                alt={data.name}
                className="w-10 h-10 rounded-full object-cover"
                />
              {data.name}
            </td>
            <td className="px-4 py-2 border border-gray-300">{data.role}</td>
            <td className="px-4 py-2 border border-gray-300">{data.date}</td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Edit</button>
            </td>
            <td className="px-4 py-2 border border-gray-300 text-center">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Delete</button>
            </td>
          </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
