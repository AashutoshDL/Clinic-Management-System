import React, { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "../Ui/LoadingScreen"
import axiosInstance from "../service/axiosInterceptor"
import { Briefcase, MapPin, Star, Mail, PlusCircle, X } from "lucide-react"

const PatientProfile = () => {
  const { userId, isLoggedIn, accessToken, logout } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newEmail, setNewEmail] = useState("")
  const [sharedEmails, setSharedEmails] = useState([])
  const [emailError, setEmailError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get(`/patient/getPatientById/${userId}`)
        setProfileData(response.data.data)
        
        // Initialize shared emails from profile data if available
        if (response.data.data.sharedEmails && Array.isArray(response.data.data.sharedEmails)) {
          setSharedEmails(response.data.data.sharedEmails)
        }
        
        console.log(response.data.data)
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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleAddEmail = async () => {
    setEmailError("")
  
    // Validate email
    if (!newEmail) {
      setEmailError("Email cannot be empty")
      return
    }
  
    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }
  
    // Check if email already exists
    if (sharedEmails.includes(newEmail)) {
      setEmailError("This email is already in your sharing list")
      return
    }

    const updatedEmails = [...sharedEmails, newEmail];
    setSharedEmails(updatedEmails); // Update the state
    
    console.log("Updated Emails:", updatedEmails);
    
    try {
      // Update the profile with the new shared emails list
      await axiosInstance.patch(`/patient/setupProfileById/${userId}`, { sharedEmails: updatedEmails })
      setNewEmail("");
    } catch (error) {
      console.error("Error adding shared email:", error)
      setEmailError("Failed to add email. Please try again.")
    }
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


  return (
      <div className="max-w-max mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {}
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {}
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

              {}
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

                {}
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

          {/* Side-by-side Medical Info and Shared Emails */}
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Left Side: Medical Information */}
              <div className="pt-6 px-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-blue-500" />
                  Medical Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Age</h3>
                    <p className="text-lg font-semibold">{profileData.age}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Gender</h3>
                    <p className="text-lg font-semibold">{profileData.gender}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Blood Type</h3>
                    <p className="text-lg font-semibold">{profileData.bloodType}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Height</h3>
                    <p className="text-lg font-semibold">{profileData.height} {profileData.heightUnit}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Weight</h3>
                    <p className="text-lg font-semibold">{profileData.weight} {profileData.weightUnit}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Recent Vital Signs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Blood Pressure</h4>
                      <p className="text-lg font-semibold">{profileData.systolicBP}/{profileData.diastolicBP} mmHg</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Heart Rate</h4>
                      <p className="text-lg font-semibold">{profileData.heartRate} bpm</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Temperature</h4>
                      <p className="text-lg font-semibold">{profileData.temperature} {profileData.temperatureUnit}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Blood Glucose</h4>
                      <p className="text-lg font-semibold">{profileData.bloodGlucose} mg/dL</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Shared Emails */}
              <div className="pt-6 px-6 border-t lg:border-t-0 lg:border-l border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  Shared Emails
                </h2>
                <p className="text-gray-600 mb-4">
                  Add email addresses of family members who should receive your medical reports.
                </p>

                {/* Add Email Form */}
                <div className="flex flex-col md:flex-row gap-2 mb-4">
                  <div className="flex-grow">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter family member's email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                  </div>
                  <button
                    onClick={handleAddEmail}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Add Email
                  </button>
                </div>

                {/* Shared Emails List */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-700 mb-2">Current Shared Emails</h3>
                  
                  {sharedEmails.length === 0 ? (
                    <p className="text-gray-500 italic">No shared emails yet. Add family members to share your medical reports.</p>
                  ) : (
                    <ul className="space-y-2">
                      {sharedEmails.map((email, index) => (
                        <li key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-500 mr-2" />
                            <span>{email}</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveEmail(email)}
                            className="text-red-500 hover:text-red-700 p-1"
                            aria-label="Remove email"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>Reports will be automatically sent to these email addresses when new medical reports are generated.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default PatientProfile