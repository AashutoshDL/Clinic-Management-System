import React from 'react'
import {Formik, Form } from 'formik';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom'
import {PasswordInput, TextInput , MySelect} from '../Auth/FormElements'
import  axios  from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate=useNavigate();
    const {login}=useAuth();

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">Login</h1>
              <Formik
                initialValues={{
                  email:'',
                  password: '',
                  role: '',
                }}
                //validation using Yup a library
                validationSchema={Yup.object({
                  email: Yup.string().email('Invalid email address').required('Required'),
                })}
                //making api calls to the backend for registration
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    // Make the API call using axios
                    const response = await axios.post('http://localhost:3001/auth/login', values, {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    }); 
                    // Extract response data
                    const data = response.data;
                    // Alert success message
                    alert(`Login Successful. Welcome, ${data.user.firstName}`);
                    login(data.user);
                    navigate('/home')
                  } catch (error) {
                    // Handle errors
                    console.error("Error during signup", error);
                
                    if (error.response) {
                      console.log("Response error:", error.response.data);
                    } else if (error.request) {
                      console.log("Request error: No response received from the server");
                    } else {
                      console.log("Unexpected error:", error.message);
                    }
                  } finally {
                    // Reset submitting state
                    setSubmitting(false);
                  }
                }}
              >
              {({ isSubmitting }) => (
                <Form>
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
                    className="text-blue-500 text-sm mb-4 hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'} Password
                  </button>
                  <MySelect label="Role" name="role" className="w-full px-3 py-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-100"
                  >
                    <option value="">Select a job type</option>
                    <option value="user">User</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="lab-technician">Lab Technician</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </MySelect>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded mt-4 hover:bg-blue-600 transition"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </Form>
              )}
              </Formik>
            <p className='pt-4'>Not Registerd Yet? <button onClick={()=>{navigate('/register')}}>Register</button></p>
            </div>
          </div>
  )
}

export default Login
