import React, { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "../Ui/LoadingScreen"
import axiosInstance from "../service/axiosInterceptor"
// Import Lucide React icons
import { ArrowRight, Briefcase, MapPin, Star } from "lucide-react"

const PatientProfile = () => {
  const { userId, isLoggedIn, accessToken, logout } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get(`/patient/getPatientById/${userId}`)
        setProfileData(response.data.data)
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchProfileData()
  }, [userId, accessToken])

  const handleLogOut = async () => {
    logout()
    navigate("/")
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">You need to log in to view your profile.</h1>
      </div>
    )
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (!profileData) {
    return <div className="min-h-screen flex items-center justify-center">Error loading profile.</div>
  }

  // Sample skills - replace with actual data from your API if available
  const skills = ["Medical History", "Appointments", "Prescriptions", "Lab Results", "Insurance"]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Colorful gradient header */}
      <div className="h-48 bg-gradient-to-r from-orange-300 via-pink-400 to-cyan-400 rounded-b-lg"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile header section */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Profile image */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage || "/placeholder.svg"}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-4xl font-bold">
                      {profileData.name ? profileData.name.charAt(0).toUpperCase() : ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile info */}
              <div className="md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profileData.name}</h1>
                    <div className="mt-1 flex items-center text-gray-500">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span>{profileData.role || "Patient"}</span>
                    </div>
                    {profileData.address && (
                      <div className="mt-1 flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{profileData.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="ml-auto px-4 py-2 border border-red-300 text-red-500 rounded-full hover:bg-red-50 transition"
                    onClick={handleLogOut}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-blue-500" />
              Medical Information
            </h2>

            {/* Basic Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Blood Type</h3>
                <p className="text-lg font-semibold">O Positive</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Height</h3>
                <p className="text-lg font-semibold">175 cm</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Weight</h3>
                <p className="text-lg font-semibold">68 kg</p>
              </div>
            </div>

            {/* Current Medications */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-2">Current Medications</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medication
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dosage
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Frequency
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Lisinopril</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">10mg</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Once daily</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Metformin</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">500mg</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Twice daily</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Atorvastatin</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">20mg</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Once daily at bedtime</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Vital Signs */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-2">Recent Vital Signs</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Blood Pressure</h4>
                  <p className="text-lg font-semibold">120/80 mmHg</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Heart Rate</h4>
                  <p className="text-lg font-semibold">72 bpm</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Temperature</h4>
                  <p className="text-lg font-semibold">98.6 °F</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Blood Glucose</h4>
                  <p className="text-lg font-semibold">110 mg/dL</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
</div>
            <div className="p-6 hover:bg-gray-50 transition cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Update Information</h3>
                  <p className="text-sm text-gray-500 mt-1">Keep your profile updated for better healthcare service.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientProfile