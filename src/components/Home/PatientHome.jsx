import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import PatientProfile from "../Profile/PatientProfile";
import axiosInstance from "../service/axiosInterceptor";
import { Calendar, Bell } from "lucide-react";
import { baseURL } from "../service/baseURL";
import axios from "axios";

const PatientHome = () => {
  const { isLoggedIn, userId } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();

  // Fetch appointments and reminders on load
  useEffect(() => {
    const fetchAppointmentsAndReminders = async () => {
      if (isLoggedIn && userId) {
        try {
          // Fetch appointments
          const appointmentsResponse = await axiosInstance.get(`/appointments/getAppointmentsById/${userId}`);
          setAppointments(appointmentsResponse.data.appointments || []);

          // Fetch reminders
          const remindersResponse = await axios.get(`${baseURL}/reminder/getReminderByPatientId/${userId}`);
          setReminders(remindersResponse.data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchAppointmentsAndReminders();
  }, [isLoggedIn, userId]);

  const handleSetReminder = async (appointmentId) => {
    try {
      // Make the API call to set the reminder
      await axios.post(`${baseURL}/reminder/emailReminder/${appointmentId}`);

      // Update the reminders state by fetching the updated reminders list
      const remindersResponse = await axios.get(`${baseURL}/reminder/getReminderByPatientId/${userId}`);
      setReminders(remindersResponse.data || []);
    } catch (error) {
      console.error("Error setting reminder", error);
    }
  };

  // Check if a reminder exists for a specific appointment
  const hasReminder = (appointmentId) => {
    return reminders.some(reminder => 
      reminder.appointmentId === appointmentId || 
      reminder.appointment_id === appointmentId
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-48 bg-gradient-to-r from-orange-300 via-pink-400 to-cyan-400 rounded-b-lg"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <div className="mb-6">
          <PatientProfile />
        </div>

        {isLoggedIn && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((appointment) => {
                  const appointmentId = appointment._id || appointment.id;
                  const reminderExists = hasReminder(appointmentId);
                  
                  return (
                    <div key={appointmentId} className="p-6 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{appointment.patientName || "Placeholder name"}</h3>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Specialization:</span>{" "}
                            {appointment.specialization || "Placeholder specialization"}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <span className="font-medium">Time:</span> {appointment.time || "Placeholder time"}
                          </p>
                          {/* Display status if appointment is pending */}
                          {appointment.status === "Pending" && (
                            <p className="text-yellow-500 font-medium">Appointment is Pending</p>
                          )}
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                          {!reminderExists && (
                            <button
                              className="px-3 py-1 border border-blue-300 text-blue-500 rounded-full hover:bg-blue-50 transition flex items-center"
                              onClick={() => handleSetReminder(appointmentId)}
                            >
                              <Bell className="w-4 h-4 mr-1" />
                              Set Reminder
                            </button>
                          )}
                          {reminderExists && (
                            <span className="px-3 py-1 text-green-500 flex items-center">
                              <Bell className="w-4 h-4 mr-1" />
                              Reminder Set
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        className="px-4 py-2 m-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                        onClick={() => navigate(`/messages/${appointment.doctorId}`)}
                      >
                        Talk to Doctor
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Appointments</h3>
                  <p className="text-gray-500 mb-4">You don't have any scheduled appointments.</p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                    onClick={() => navigate("/appointment")}
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
  );
};

export default PatientHome;