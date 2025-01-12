import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Checkbox, PasswordInput, TextInput } from './FormElements';
import axios from 'axios';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1); // Tracks the current step (page)
  const navigate = useNavigate();

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-pink-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl space-y-6">
        <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6">Signup</h1>
        <p className="text-center text-gray-600 mb-4">Create a new account to get started.</p>

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptedTerms: false,
          }}
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(15, 'Must be 15 characters or less')
              .required('Required'),
            lastName: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .required('Required'),
            userName: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .matches(/[0-9]/, 'Username must contain at least one number')
              .required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
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
                  withCredentials: true,
                },
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
            <Form className="space-y-4">
              {/* Step 1 - Personal Information */}
              {currentStep === 1 && (
                <>
                  <TextInput label="First Name" name="firstName" type="text" placeholder="Your First Name" />
                  <TextInput label="Last Name" name="lastName" type="text" placeholder="Your Last Name" />
                  <TextInput label="User Name" name="userName" type="text" placeholder="Choose a username" />
                  <TextInput label="Email Address" name="email" type="email" placeholder="youremail@email.com" />

                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="py-2 px-4 bg-gray-300 text-black rounded-md"
                      disabled={isSubmitting}
                      onClick={nextStep}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
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
                      I accept the terms and conditions
                    </Checkbox>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="py-2 px-4 bg-gray-300 text-black rounded-md"
                      disabled={isSubmitting}
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-buttonGray hover:bg-buttonGrayDark text-white rounded-md"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registering...' : 'Submit'}
                    </button>
                  </div>
                </>
              )}
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
