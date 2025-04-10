import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Checkbox, PasswordInput, TextInput, MySelect } from '../Auth/FormElements';
import axios from 'axios';
import { baseURL } from '../service/baseURL';

const UserForm = ({ onClose, onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        <Formik
          initialValues={{
            name: '',
            userName: '',
            role: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptedTerms: false,
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .max(30, 'Must be 30 characters or less')
              .required('Required'),
            userName: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .matches(/[0-9]/, 'Username must contain at least one number')
              .required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            role: Yup.string().required("Required"),
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
              console.log(values);
              const response = await axios.post(
                `${baseURL}/auth/register`,
                values,
                {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  withCredentials: true,
                }
              );
              console.log(response);
              onSubmit('User added successfully');
              onClose();
            } catch (error) {
              console.error('Error during user creation:', error);
              if (error.response) {
                console.error('Response error data:', error.response.data);
              }
              onSubmit('Error during user creation');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput label="Full Name" name="name" type="text" placeholder="Your Full Name" />
              <TextInput label="User Name" name="userName" type="text" placeholder="Enter your username" />
              <TextInput label="Email Address" name="email" type="email" placeholder="youremail@email.com" />
              <MySelect label="Role" name="role" className="w-full px-3 py-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 bg-gray-100">
                <option value="">Select a job type</option>
                <option value="patient">Patient</option>
              </MySelect>
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
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="text-blue-500 text-sm mb-4 hover:underline"
              >
                {showConfirmPassword ? 'Hide' : 'Show'} Password
              </button>
              <Checkbox name="acceptedTerms">
                I accept the terms and conditions
              </Checkbox>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2 px-4 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                  disabled={isSubmitting}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserForm;