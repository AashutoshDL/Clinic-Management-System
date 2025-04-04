import React,{ useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PatientProfile from "../Profile/PatientProfile";
import axiosInstance from "../service/axiosInterceptor";
import { Calendar, Bell } from "lucide-react";
import { baseURL } from "../service/baseURL";
import axios from 'axios';

const PatientHome = () => {
  const { isLoggedIn, userId } = useAuth()
  const [appointments, setAppointments] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAppointments = async () => {
      if (isLoggedIn && userId) {
        try {
          const response = await axiosInstance.get(`/appointments/getAppointmentsById/${userId}`)
          setAppointments(response.data.appointments || [])
        } catch (error) {
          console.error("Error fetching appointments:", error)
        }
      }
    }

    fetchAppointments()
  }, [isLoggedIn, userId])

  const handleSetReminder = async (appointmentId) => {
      try{
        console.log(appointmentId)
        const response= await axios.post(`${baseURL}/reminder/emailReminder/${appointmentId}`)
        console.log(response)
      }catch(error){
        console.error("Error setting reminder",error);
      }
    }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Colorful gradient header */}
      <div className="h-48 bg-gradient-to-r from-orange-300 via-pink-400 to-cyan-400 rounded-b-lg"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        {/* Profile section */}
        <div className="mb-6">
          <PatientProfile />
        </div>

        {/* Appointments Section */}
        {isLoggedIn && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  onClick={() => navigate("/book-appointment")}
                >
                  Book New
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {appointments && appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div key={appointment._id || appointment.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{appointment.patientName || "Placeholder name"}</h3>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Specialization:</span>{" "}
                          {appointment.specialization || "Placeholder specilization"}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Time:</span> {appointment.time || "Placeholder timme"}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex space-x-3">
                        <button
                          className="px-3 py-1 border border-blue-300 text-blue-500 rounded-full hover:bg-blue-50 transition flex items-center"
                          onClick={() => handleSetReminder(appointment._id || appointment.id)}
                        >
                          <Bell className="w-4 h-4 mr-1" />
                          Remind
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mb-4">You don't have any scheduled appointments.</p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                    onClick={() => navigate("/book-appointment")}
                  >
                    Book an Appointment
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientHome