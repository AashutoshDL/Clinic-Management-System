import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Checkbox, PasswordInput, TextInput, MySelect } from './FormElements';
import axios from 'axios';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-pink-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full bg-white p-8 rounded-lg shadow-xl space-y-6">
        <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6">Signup</h1>
        <p className="text-center text-gray-600 mb-4">Create a new account to get started.</p>

        <Formik
          initialValues={{
            name: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptedTerms: false,
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .max(15, 'Must be 15 characters or less')
              .required('Required'),
            userName: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .matches(/[0-9]/, 'Username must contain at least one number')
              .required('Required'),
              email: Yup.string()
              .email('Invalid email address')
              .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Invalid email address'
              )
              .required('Required'),
            password: Yup.string()
              .min(5, 'Password must be at least 5 characters')
              .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
              .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
              .matches(/[0-9]/, 'Password must contain at least one number')
              .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
              .required('Required'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password'), null], 'Passwords must match')
              .required('Required'),
            acceptedTerms: Yup.boolean()
              .required('Required')
              .oneOf([true], 'Please accept the terms and conditions before continuing.'),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post('http://localhost:3001/auth/register', values, {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true,
              });
              const data = response.data;
              alert(`Registration Completed. Please Verify your Email`);
              sessionStorage.setItem('email', values.email);
              navigate('/verifyEmail');
            } catch (error) {
              console.error('Error during signup', error);
              if (error.response) {
                console.log('Response error data:', error.response.data);
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex space-x-8">
              {/* Left Side: Personal Information */}
              <div className="w-1/2 space-y-4">
                <TextInput label="Name" name="name" type="text" placeholder="Your Name" />
                <TextInput label="User Name" name="userName" type="text" placeholder="Choose a username" />
                <TextInput label="Email Address" name="email" type="email" placeholder="youremail@email.com" />
              </div>
              {/* Right Side: Password and Terms */}
              <div className="w-1/2 space-y-4">
                <PasswordInput
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-blue-500 text-sm mb-4 hover:underline focus:outline-none"
                >
                  {showPassword ? 'Hide' : 'Show'} Password
                </button>
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-blue-500 text-sm mb-4 hover:underline focus:outline-none"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'} Password
                </button>
  
                <div className="flex items-center mb-4">
                  <Checkbox name="acceptedTerms">
                    I accept the {' '}
                    <Link to='/termsandconditions' className='text-blue-500 hover:text-blue-700' >
                    terms and conditions
                    </Link>
                  </Checkbox>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="py-2 px-24 bg-buttonGray hover:bg-buttonGrayDark text-white rounded-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Submit'}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>

        <p className="pt-4 text-center">
          Already registered?{' '}
          <button
            className="font-bold text-blue-600 hover:text-blue-700"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
