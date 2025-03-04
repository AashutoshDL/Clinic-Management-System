import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { TextInput, PasswordInput } from '../Auth/FormElements';
import { baseURL } from '../baseURL';

const superadminSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
});

const Superadmin = () => {
  const [superadmins, setSuperadmins] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchSuperadmins = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/superadmin/getsuperadmins`);
        console.log('API Response:', response.data);
        setSuperadmins(Array.isArray(response.data?.data) ? response.data.data : []);
      } catch (err) {
        console.error('Error fetching superadmins:', err);
        setError('Failed to fetch superadmins');
        setSuperadmins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuperadmins();
  }, []);

  const handleDelete = (admin) => {
    setSelectedAdmin(admin);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${baseURL}/superadmin/deletesuperadmin/${selectedAdmin._id}`);
      setSuperadmins(superadmins.filter((admin) => admin._id !== selectedAdmin._id));
      setShowDeleteModal(false);
      setSelectedAdmin(null);
    } catch (err) {
      console.error('Error deleting superadmin:', err);
      setError('Failed to delete superadmin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Superadmin Management</h1>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={superadminSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              const response = await axios.post(`${baseURL}/superadmin/superadminRegister`, values);
              setSuperadmins([...superadmins, response.data]);
              resetForm();
            } catch (err) {
              console.error('Error adding superadmin:', err);
              setError('Failed to add superadmin');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Name" name="name" type="text" />
                <TextInput label="Email" name="email" type="email" />
                <div className="relative">
                  <PasswordInput label="Password" name="password" type={showPassword ? 'text' : 'password'} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Adding...' : 'Add Superadmin'}
              </button>
            </Form>
          )}
        </Formik>

        {loading ? (
          <div className="text-center py-4">Loading superadmins...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(superadmins) && superadmins.length > 0 ? (
                  superadmins.map((admin) => (
                    <tr key={admin._id}>
                      <td className="py-2 px-4 border">{admin.name}</td>
                      <td className="py-2 px-4 border">{admin.email}</td>
                      <td className="py-2 px-4 border">
                        <button
                          onClick={() => handleDelete(admin)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No superadmins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
              <p>Are you sure you want to delete {selectedAdmin?.name}?</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Superadmin;