import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextInput, PasswordInput, MySelect } from '../Auth/FormElements';
import axios from 'axios';
import {baseURL} from '../service/baseURL';

const CreateAdmin = () => {
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Admin</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={Yup.object({
          name: Yup.string().required('Name is required'),
          email: Yup.string().email('Invalid email address').required('Email is required'),
          password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          try {
            await axios.post(`${baseURL}/admin/createAdmin`, values, {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: true,
            });
            alert('Admin created successfully!');
            resetForm();
          } catch (error) {
            console.error('Error creating admin:', error);
            alert('Failed to create admin');
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <TextInput label="Full Name" name="name" type="text" placeholder="Enter admin's name" />
            <TextInput label="Email" name="email" type="email" placeholder="Enter admin's email" />
            <PasswordInput label="Password" name="password" type="password" placeholder="Enter a password" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Admin...' : 'Create Admin'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateAdmin;
