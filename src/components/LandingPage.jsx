import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextInput, PasswordInput, MySelect } from './Auth/FormElements';
import { ChevronRight, Calendar, Search, UserPlus, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Landing = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login, checkAuth, logout, role } = useAuth();

  const loginSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
    password: Yup.string().required('Required'),
    role: Yup.string().required('Required'),
  });

  const features = [
    {
      icon: <Search className="w-6 h-6" />, title: "Find Specialists", description: "Access top healthcare professionals"
    },
    {
      icon: <Calendar className="w-6 h-6" />, title: "Easy Scheduling", description: "Book appointments instantly"
    },
    {
      icon: <UserPlus className="w-6 h-6" />, title: "Family Health", description: "Manage healthcare for your family"
    }
  ];

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    try {
      console.log(values)
      const response = await axios.post('http://localhost:3001/auth/login', values, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const { id, role } = response.data;
      login(id, role);
      await checkAuth();
      navigate('/home');
    } catch (error) {
      console.error('Error during login', error);
      if (error.response) alert(error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <nav className="flex justify-between items-center p-4 lg:px-8 bg-white shadow-sm fixed w-full z-20 top-0">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Clinic Management System
        </div>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <User className="w-6 h-6 text-blue-600 cursor-pointer" onClick={() => navigate('/profile')} />
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-screen pt-16">
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Your Health, <br /><span className="text-blue-600">Our Priority</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Experience healthcare management reimagined. Book appointments, find specialists, and manage your family's health all in one place.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            {/* <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
              Find Doctors <ChevronRight className="w-4 h-4" />
            </button> */}
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-black-600 border-2 border-gray-600 px-6 py-3 rounded-lg font-medium" onClick={() => navigate('/appointment')}>
              Book Appointment <Calendar className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md">
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {!isLoggedIn && (
          <div className="flex-1 flex justify-center items-center p-8">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">Welcome Back</h2>
              <p className="text-gray-600 mb-8 text-center">Please enter your credentials to continue.</p>
              <Formik initialValues={{ email: '', password: '', role: '' }} validationSchema={loginSchema} onSubmit={handleLoginSubmit}>
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    <TextInput label="Email" name="email" type="text" placeholder="Enter your email" />
                    <div className="relative">
                      <PasswordInput label="Password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <MySelect label="Role" name="role" className="w-full px-4 py-2 mt-2 border rounded-md">
                      <option value="">Select a role</option>
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="lab-technician">Lab Technician</option>
                    </MySelect>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg" disabled={isSubmitting}>
                      {isSubmitting ? 'Logging in...' : 'Sign In'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;