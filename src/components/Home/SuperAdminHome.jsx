import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { baseURL } from '../service/baseURL';
import { UserCircle, Activity, Heart, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SuperAdminHome = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    // Fetch patients data from the API
    const fetchPatientsData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/patient/getAllPatients`);
        if (response.data.success) {
          setPatientsData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching patients data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsData();
  }, []);

  // Process patient data to include health metrics
  const processPatientData = (patient) => {
    return {
      name: patient.name ? patient.name.split(' ')[0] : 'Unknown',
      fullName: patient.name || 'Unknown',
      bloodGlucose: patient.bloodGlucose || 0,
      diastolicBP: patient.diastolicBP || 0,
      heartRate: patient.heartRate || 0,
    };
  };

  const chartData = patientsData.map(processPatientData);

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-medium text-gray-800">{payload[0]?.payload.fullName}</p>
          <p className="text-purple-600">
            <span className="font-medium">Blood Glucose:</span> {payload[0]?.value} mg/dL
          </p>
          <p className="text-green-600">
            <span className="font-medium">Diastolic BP:</span> {payload[1]?.value} mmHg
          </p>
          <p className="text-orange-600">
            <span className="font-medium">Heart Rate:</span> {payload[2]?.value} bpm
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <BarChart3 className="mr-2 text-blue-600" />
              Dashboard Analytics
            </h1>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
              >
                <LogOut className="mr-2 w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <p className="text-gray-600">
            Overview of patient health metrics across the system. Monitoring{' '}
            {patientsData.length} active patients.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Avg. Blood Glucose</h3>
                <p className="text-2xl font-semibold text-gray-800">
                  {chartData.length > 0
                    ? Math.round(
                        chartData.reduce((sum, patient) => sum + patient.bloodGlucose, 0) /
                          chartData.length
                      )
                    : 0}{' '}
                  mg/dL
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Avg. Diastolic BP</h3>
                <p className="text-2xl font-semibold text-gray-800">
                  {chartData.length > 0
                    ? Math.round(
                        chartData.reduce((sum, patient) => sum + patient.diastolicBP, 0) /
                          chartData.length
                      )
                    : 0}{' '}
                  mmHg
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Heart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Avg. Heart Rate</h3>
                <p className="text-2xl font-semibold text-gray-800">
                  {chartData.length > 0
                    ? Math.round(
                        chartData.reduce((sum, patient) => sum + patient.heartRate, 0) /
                          chartData.length
                      )
                    : 0}{' '}
                  bpm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <UserCircle className="mr-2 text-blue-600" />
            Patient Health Metrics Comparison
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#4a5568' }}
                  tickLine={{ stroke: '#cbd5e0' }}
                  axisLine={{ stroke: '#cbd5e0' }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  tick={{ fill: '#4a5568' }}
                  tickLine={{ stroke: '#cbd5e0' }}
                  axisLine={{ stroke: '#cbd5e0' }}
                />
                <Tooltip content={renderCustomTooltip} />
                <Legend
                  wrapperStyle={{ paddingTop: 20 }}
                  payload={[
                    { value: 'Blood Glucose (mg/dL)', type: 'square', color: '#8884d8' },
                    { value: 'Diastolic BP (mmHg)', type: 'square', color: '#82ca9d' },
                    { value: 'Heart Rate (bpm)', type: 'square', color: '#ff7300' },
                  ]}
                />
                <Bar dataKey="bloodGlucose" fill="#8884d8" name="Blood Glucose" barSize={25} radius={[5, 5, 0, 0]} />
                <Bar dataKey="diastolicBP" fill="#82ca9d" name="Diastolic BP" barSize={25} radius={[5, 5, 0, 0]} />
                <Bar dataKey="heartRate" fill="#ff7300" name="Heart Rate" barSize={25} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-96">
              <UserCircle className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Patient Data Available</h3>
              <p className="text-gray-500">Patient information will appear here once data is available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminHome;
