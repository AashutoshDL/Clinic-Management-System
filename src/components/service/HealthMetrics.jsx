import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserCircle } from 'lucide-react';

const HealthMetrics = ({ data, loading, title = "Patient Health Metrics" }) => {
  // Process patient data to include health metrics and only first name for display
  const processedData = data.map(patient => ({
    name: patient.name ? patient.name.split(' ')[0] : 'Unknown', // Only first name for better display
    fullName: patient.name || 'Unknown',
    bloodGlucose: patient.bloodGlucose || 0,
    diastolicBP: patient.diastolicBP || 0,
    heartRate: patient.heartRate || 0,
  }));

  const renderCustomTooltip = ({ active, payload, label }) => {
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <UserCircle className="mr-2 text-blue-600" />
        {title}
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : processedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
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
                { value: 'Heart Rate (bpm)', type: 'square', color: '#ff7300' }
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
  );
};

export default HealthMetrics;