import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { PasswordInput, TextInput, MySelect } from '../Auth/FormElements';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  const {checkAuth}=useAuth();
``
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-pink-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl space-y-6">
        <h1 className="text-center text-3xl font-semibold text-gray-800 mb-4">Login</h1>
        <p className="text-center text-gray-600 mb-6">Please enter your credentials to log in.</p>
        <Formik
          initialValues={{
            email: '',
            password: '',
            role: '',
          }}
          validationSchema={Yup.object({
                        email: Yup.string()
                          .email('Invalid email address')
                          .matches(
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            'Invalid email address'
                          )
                          .required('Required'),
            password: Yup.string().required('Required'),
            role: Yup.string().required('Required'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post('http://localhost:3001/auth/login', values, {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true, // Include cookies with the request
              });
              const { accessToken, refreshToken } = response.data;
              login(accessToken,refreshToken);
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
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <TextInput label="Email" name="email" type="text" placeholder="Enter your email" />
              <PasswordInput
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-blue-500 text-sm hover:underline focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'} Password
              </button>
              <MySelect label="Role" name="role" className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50">
                <option value="">Select a job type</option>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="lab-technician">Lab Technician</option>
              </MySelect>
              <div className="flex justify-between items-center">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-buttonGray text-white font-semibold rounded-md mt-4 hover:bg-buttonGrayDark transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Submit'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-center text-sm text-gray-600 mt-4">
          Not Registered Yet?{' '}
          <button
            className="font-bold text-blue-500 hover:text-blue-600"
            onClick={() => {
              navigate('/register');
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
