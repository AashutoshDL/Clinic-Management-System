import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextInput, PasswordInput, MySelect } from './Auth/FormElements';
import { ChevronRight, Calendar, Search, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Landing = () => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, checkAuth } = useAuth();

  const registrationSchema = Yup.object({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phoneNumber: Yup.string().required('Phone Number is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const loginSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address')
      .required('Required'),
    password: Yup.string().required('Required'),
    role: Yup.string().required('Required'),
  });

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Find Specialists",
      description: "Access to top healthcare professionals in various specialties"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Scheduling",
      description: "Book appointments instantly at your convenient time"
    },
    {
      icon: <UserPlus className="w-6 h-6" />,
      title: "Family Health",
      description: "Manage healthcare for your entire family in one place"
    }
  ];

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', values, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      const { accessToken, refreshToken } = response.data;
      login(accessToken, refreshToken);
      await checkAuth();
      navigate('/profile');
    } catch (error) {
      console.error('Error during login', error);
      if (error.response) {
        alert(error.response.data.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 lg:px-8 bg-white shadow-sm fixed w-full z-20 top-0">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Clinic Management System
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowLoginForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login
          </button>
          <button
            onClick={() => setShowLoginForm(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Main Content with Animation */}
      <div className="flex flex-col lg:flex-row min-h-screen pt-16 relative">
        {/* Left Side Content */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Your Health, <br />
            <span className="text-blue-600">Our Priority</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Experience healthcare management reimagined. Book appointments, find specialists, and manage your family's health all in one place.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Find Doctors
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium transition-colors">
              Book Appointment
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Registration/Login Forms with Animation */}
        <div className="flex-1 relative">
          {/* Registration Form */}
          <div 
            className={`absolute inset-0 bg-white p-8 lg:p-16 flex flex-col justify-center transform transition-all duration-500 ease-in-out ${
              showLoginForm ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            }`}
          >
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Create Your Account</h2>
              <p className="text-gray-600 mb-8">Join thousands of patients managing their healthcare efficiently.</p>

              <Formik
                initialValues={{
                  fullName: '',
                  email: '',
                  phoneNumber: '',
                  password: '',
                }}
                validationSchema={registrationSchema}
                onSubmit={(values) => console.log(values)}
              >
                <Form className="space-y-4">
                  <TextInput
                    label="Full Name"
                    id="fullName"
                    name="fullName"
                    type="text"
                  />
                  <TextInput
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                  />
                  <TextInput
                    label="Phone Number"
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                  />
                  <PasswordInput
                    label="Password"
                    id="password"
                    name="password"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Create Account
                  </button>
                </Form>
              </Formik>

              <p className="text-center text-gray-600 mt-6">
                Already have an account?{' '}
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div 
            className={`absolute inset-0 bg-white p-8 lg:p-16 flex flex-col justify-center transform transition-all duration-500 ease-in-out ${
              showLoginForm ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
          >
            <div className="max-w-md mx-auto w-full">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mb-8">Please enter your credentials to continue.</p>

              <Formik
                initialValues={{
                  email: '',
                  password: '',
                  role: '',
                }}
                validationSchema={loginSchema}
                onSubmit={handleLoginSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <TextInput 
                      label="Email" 
                      name="email" 
                      type="text" 
                      placeholder="Enter your email" 
                    />
                    <div className="relative">
                      <PasswordInput
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <MySelect 
                      label="Role" 
                      name="role" 
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
                    >
                      <option value="">Select a role</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="lab-technician">Lab Technician</option>
                    </MySelect>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Logging in...' : 'Sign In'}
                    </button>
                  </Form>
                )}
              </Formik>

              <p className="text-center text-gray-600 mt-6">
                Don't have an account?{' '}
                <button
                  onClick={() => setShowLoginForm(false)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
