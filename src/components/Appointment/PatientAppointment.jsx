import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Calendar, Clock, Search, ArrowLeft, CheckCircle, X, User, Briefcase, MapPin } from "lucide-react"
import axios from "axios"
import { baseURL } from "../service/baseURL"

const PatientAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [availableTimes, setAvailableTimes] = useState({})
  const [bookingStatus, setBookingStatus] = useState({ status: "", message: "" })
  const [isBooking, setIsBooking] = useState(false)
  const { userId, accessToken } = useAuth()
  const [patientData, setPatientData] = useState({})
  const navigate = useNavigate()

  const today = new Date()
  const minDate = today.toISOString().split('T')[0] 

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${baseURL}/doctor/getAllDoctors`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        console.log(response)
        if (response.status === 200) {
          const data = response.data

          if (data.message === "Doctors fetched successfully" && data.doctors) {
            setDoctors(data.doctors)

            const allAvailableTimes = {}
            data.doctors.forEach((doctor) => {
              const times = doctor.availableTimes
              .map((timeSlot) => {
                if (typeof timeSlot === "object" && timeSlot.from && timeSlot.to) {
                  return `${timeSlot.from} - ${timeSlot.to}`
                } else if (typeof timeSlot === "object" && timeSlot._id) {
                  return "Time Slot"
                } else if (typeof timeSlot === "string") {
                  return timeSlot
                }
                return null
              })
              .filter((time) => time !== null)
              console.log(times)

              allAvailableTimes[doctor.id] = times
            })
            setAvailableTimes(allAvailableTimes)
          } else {
            setError("Invalid data received from server.")
          }
        }
      } catch (err) {
        setError(err.message || "Failed to fetch doctors")
        console.error("Error fetching doctors:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [accessToken])

  const handleDoctorClick = (doctorId) => {
    setSelectedDoctor(doctorId)
    setSelectedTime(null)

    setBookingStatus({ status: "", message: "" })
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  const handleBookAppointment = async () => {
    if (!selectedTime || !selectedDoctor || !selectedDate) {
      setBookingStatus({
        status: "error",
        message: !selectedDate 
          ? "Please select a date for your appointment" 
          : "Please select a doctor and a time",
      })
      return
    }

    //add payment here send the data like 
    /*
    {
      "return_url": "http://localhost:5173/payment/successful",
      "amount": 12000,
      "purchase_order_id": "ORDER-123456",
      "product_name": "IPHONE 16 PRO",
      "customer_name": "John Doe",
      "customer_email": "john.doe@example.com",
      "customer_phone": "9812345678"
    } 
    */
   //to the <AppointmentPayment /> and handle the response

    try {
      setIsBooking(true)
      setBookingStatus({ status: "loading", message: "Booking your appointment..." })

      const patientResponse = await axios.get(`${baseURL}/patient/getPatientById/${userId}`)

      if (patientResponse.status === 200 && patientResponse.data.data) {
        const patient = patientResponse.data.data
        const selectedDoctorData = doctors.find((doc) => doc.id === selectedDoctor)

        if (!selectedDoctorData) {
          setBookingStatus({
            status: "error",
            message: "Selected doctor not found. Please refresh the page.",
          })
          return
        }
        
        const appointmentData = {
          doctorId: selectedDoctorData.id,
          doctorName: selectedDoctorData.name,
          patientId: patient._id,
          patientName: patient.name,
          time: selectedTime,
          date: selectedDate,
          specialization: selectedDoctorData.specialization || "General",
        }

        console.log(appointmentData);
        
        const response = await axios.post(`${baseURL}/appointments/createAppointment/${userId}`, appointmentData)

        if (response.status === 201) {
          setBookingStatus({
            status: "success",
            message: `Appointment booked successfully with Dr. ${selectedDoctorData.name}`,
          })

          setPatientData({
            doctorName: selectedDoctorData.name,
            time: selectedTime,
            date: selectedDate,
            patientName: patient.name,
            specialization: selectedDoctorData.specialization || "General",
          })

          setTimeout(() => {
            setSelectedDoctor(null)
            setSelectedTime(null)
            setSelectedDate("")
          }, 3000)
        } else {
          setBookingStatus({
            status: "error",
            message: response.data.message || "Failed to book the appointment. Please try again later.",
          })
        }
      } else {
        setBookingStatus({
          status: "error",
          message: "Error fetching patient details. Please try again.",
        })
      }
    } catch (error) {
      setBookingStatus({
        status: "error",
        message: error.response?.data?.message || "Error booking appointment. Please try again.",
      })
      console.error("Error:", error)
    } finally {
      setIsBooking(false)
    }
  }

  const handleBackToDoctors = () => {
    setSelectedDoctor(null)
    setSelectedTime(null)
    setBookingStatus({ status: "", message: "" })
  }

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.specialization && doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading doctors...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Doctors</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">Book an Appointment</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a doctor, date, and available time slot to schedule your appointment
          </p>
        </div>

        {}
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by doctor name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {bookingStatus.status && (
          <div
            className={`mb-8 p-4 rounded-lg ${
              bookingStatus.status === "success"
                ? "bg-green-50 border border-green-200"
                : bookingStatus.status === "error"
                  ? "bg-red-50 border border-red-200"
                  : "bg-blue-50 border border-blue-200"
            }`}
          >
            <div className="flex items-center">
              {bookingStatus.status === "success" && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
              {bookingStatus.status === "error" && <X className="w-5 h-5 text-red-500 mr-2" />}
              {bookingStatus.status === "loading" && (
                <div className="w-5 h-5 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin mr-2"></div>
              )}
              <p
                className={`${
                  bookingStatus.status === "success"
                    ? "text-green-700"
                    : bookingStatus.status === "error"
                      ? "text-red-700"
                      : "text-blue-700"
                }`}
              >
                {bookingStatus.message}
              </p>
            </div>
          </div>
        )}

        {selectedDoctor === null ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select a Doctor</h2>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => handleDoctorClick(doctor.id)}
                    className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    <div className="h-40 bg-gradient-to-r from-blue-500 to-cyan-400 relative">
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                        <div className="w-24 h-24 rounded-full bg-white p-1">
                          <img
                            src={doctor.image || "/images/doctor.png"}
                            alt={doctor.name}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "Image"
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-14 pb-6 px-6">
                      <h3 className="text-xl font-semibold text-gray-800 text-center mb-1">Dr. {doctor.name}</h3>

                      <div className="flex items-center justify-center text-gray-600 mb-4">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <p>{doctor.specialization || "General Physician"}</p>
                      </div>

                      {doctor.address && (
                        <div className="flex items-center justify-center text-gray-500 text-sm mb-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          <p>{doctor.address}</p>
                        </div>
                      )}

                      <p className="text-gray-500 text-sm text-center mb-4 line-clamp-2">
                        {doctor.information || "Experienced healthcare professional dedicated to patient care."}
                      </p>

                      <div className="flex items-center justify-center text-sm">
                        <Clock className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="text-blue-600 font-medium">
                          {doctor.dutyTime
                            ? `${doctor.dutyTime.from} - ${doctor.dutyTime.to}`
                            : "Available for appointments"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <button
              onClick={handleBackToDoctors}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Doctors
            </button>

            {}
            <div className="flex items-center mb-8">
              <img
                src={
                  doctors.find((doc) => doc.id === selectedDoctor)?.image ||
                  "/images/doctor.png"
                }
                alt="Doctor"
                className="w-16 h-16 rounded-full object-cover mr-4"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "Image"
                }}
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Dr. {doctors.find((doc) => doc.id === selectedDoctor)?.name || "Doctor"}
                </h2>
                <p className="text-gray-600">
                  {doctors.find((doc) => doc.id === selectedDoctor)?.specialization || "General Physician"}
                </p>
              </div>
            </div>

            {}
            <div className="mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Select Appointment Date
              </h3>
              
              <div className="max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    min={minDate}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                {selectedDate && (
                  <p className="mt-2 text-blue-600 font-medium">
                    Appointment Date: {formatDate(selectedDate)}
                  </p>
                )}
              </div>
            </div>

            <h3 className="text-xl font-medium text-gray-700 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Available Time Slots
            </h3>

            {availableTimes[selectedDoctor]?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                {availableTimes[selectedDoctor].map((time, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSelect(time)}
                    className={`py-3 px-4 rounded-lg border text-center transition-colors ${
                      selectedTime === time
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-500"
                    }`}
                  >
                    <Clock
                      className={`w-4 h-4 inline-block mr-1 ${selectedTime === time ? "text-white" : "text-blue-500"}`}
                    />
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
                <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No available time slots for this doctor</p>
              </div>
            )}

            {}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <div className="mb-2">
                    <h3 className="text-lg font-medium text-gray-700">Selected Date:</h3>
                    {selectedDate ? (
                      <p className="text-blue-600 font-semibold">{formatDate(selectedDate)}</p>
                    ) : (
                      <p className="text-gray-500 italic">Please select a date</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Selected Time:</h3>
                    {selectedTime ? (
                      <p className="text-blue-600 font-semibold">{selectedTime}</p>
                    ) : (
                      <p className="text-gray-500 italic">Please select a time slot</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedTime || !selectedDate || isBooking}
                  className={`px-6 py-3 rounded-lg shadow-sm font-medium ${
                    !selectedTime || !selectedDate || isBooking
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  } transition-colors`}
                >
                  {isBooking ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-t-white border-white/20 rounded-full animate-spin mr-2 align-middle"></span>
                      Booking...
                    </>
                  ) : (
                    "Book Appointment"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {}
        {patientData.doctorName && bookingStatus.status === "success" && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Appointment Confirmed</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-green-700 mb-1">
                      <span className="font-medium">Doctor:</span> Dr. {patientData.doctorName}
                    </p>
                    <p className="text-green-700 mb-1">
                      <span className="font-medium">Specialization:</span> {patientData.specialization}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 mb-1">
                      <span className="font-medium">Patient:</span> {patientData.patientName}
                    </p>
                    <p className="text-green-700 mb-1">
                      <span className="font-medium">Date:</span> {formatDate(patientData.date)}
                    </p>
                    <p className="text-green-700">
                      <span className="font-medium">Time:</span> {patientData.time}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => navigate("/appointments")}
                    className="text-green-700 hover:text-green-800 text-sm font-medium"
                  >
                    View All Appointments
                  </button>
                  <button
                    onClick={() => {
                      setPatientData({})
                      setBookingStatus({ status: "", message: "" })
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientAppointment