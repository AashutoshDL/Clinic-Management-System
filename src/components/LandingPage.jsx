import { useNavigate } from "react-router-dom"
import { Search, Calendar, UserPlus } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import React from "react"

const Landing = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Find Specialists",
      description: "Access top healthcare professionals",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Scheduling",
      description: "Book appointments instantly",
    },
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: "Family Health",
      description: "Manage healthcare for your family",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <nav className="flex justify-between items-center p-4 lg:px-8 bg-white shadow-sm fixed w-full z-20 top-0">
        <div className="text-2xl font-bold text-blue-600">Clinic Management System</div>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              My Profile
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-screen pt-16">
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Your Health, <br />
            <span className="text-blue-600">Our Priority</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Experience healthcare management reimagined. Book appointments, find specialists, and manage your family's
            health all in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center p-8 lg:p-0">
          <div className="relative w-full max-w-lg">
            {/* Main image */}
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/doctor-with-patient.jpg"
                alt="Healthcare professional with patient"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "../../public/images/clinicPic.png"

                }}
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-6 w-24 h-24 bg-blue-200 rounded-full z-0 opacity-70"></div>
            <div className="absolute bottom-1/4 -right-6 w-32 h-32 bg-blue-100 rounded-full z-0 opacity-70"></div>

            {/* Stats card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-lg shadow-lg z-20">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-blue-600">98%</span>
                <span className="text-sm text-gray-600">Patient Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing

