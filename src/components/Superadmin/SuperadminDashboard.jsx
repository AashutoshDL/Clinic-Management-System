// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Users, CalendarCheck, FileText, Activity, LogOut } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// const SuperadminDashboard = () => {
//   const { logout } = useAuth();
//   const navigate=useNavigate();

//   const handleLogout= async ()=>{
//       await logout();
//       await navigate('/')
//   }

//   const overviewStats = [
//     { title: 'Total Users', count: 1200, icon: <Users className="w-6 h-6 text-blue-600" />, link: '/users' },
//     { title: 'Doctors', count: 85, icon: <Users className="w-6 h-6 text-green-600" />, link: '/doctors' },
//     { title: 'Appointments Today', count: 36, icon: <CalendarCheck className="w-6 h-6 text-yellow-600" />, link: '/appointments' },
//     { title: 'Reports Generated', count: 15, icon: <FileText className="w-6 h-6 text-red-600" />, link: '/reports' },
//   ];

//   const recentReports = [
//     { id: 1, patient: 'John Doe', type: 'Blood Test', status: 'Completed' },
//     { id: 2, patient: 'Jane Smith', type: 'MRI Scan', status: 'Pending' },
//     { id: 3, patient: 'Michael Brown', type: 'X-Ray', status: 'Completed' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Superadmin Dashboard</h1>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
//         >
//           <LogOut className="w-5 h-5" />
//           Logout
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {overviewStats.map((stat, index) => (
//           <Link
//             key={index}
//             to={stat.link}
//             className="bg-white shadow-md p-6 rounded-lg flex items-center gap-4 hover:shadow-lg transition-all"
//           >
//             {stat.icon}
//             <div>
//               <p className="text-gray-600">{stat.title}</p>
//               <h2 className="text-2xl font-semibold">{stat.count}</h2>
//             </div>
//           </Link>
//         ))}
//       </div>

//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//           <Activity className="w-5 h-5 text-blue-600" />
//           Recent Reports
//         </h2>
//         <table className="w-full border-collapse border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border border-gray-200 p-3 text-left">Patient</th>
//               <th className="border border-gray-200 p-3 text-left">Report Type</th>
//               <th className="border border-gray-200 p-3 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {recentReports.map((report) => (
//               <tr key={report.id} className="border border-gray-200 hover:bg-gray-50">
//                 <td className="p-3">{report.patient}</td>
//                 <td className="p-3">{report.type}</td>
//                 <td className={`p-3 ${report.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
//                   {report.status}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SuperadminDashboard;
