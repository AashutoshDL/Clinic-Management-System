import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Checkbox, PasswordInput, TextInput } from './FormElements';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const navigate=useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">Signup</h1>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            userName:'',
            email: '',
            password: '',
            confirmPassword: '',
            acceptedTerms: false,
          }}
          //validation using Yup a library
          validationSchema={Yup.object({
            firstName: Yup.string()
              .max(15, 'Must be 15 characters or less')
              .required('Required'),
            lastName: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .required('Required'),
              userName: Yup.string()
              .max(20, 'Must be 20 characters or less')
              .matches(/[0-9]/, 'Password must contain at least one number')
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
          //making api calls to the backend for registration
          onSubmit={async(values, { setSubmitting }) => {
              try{
                const response= await fetch('backendapi/signup',{
                  method: 'POST',
                  headers:{
                    'Content-Type':'application/json',
                    body:JSON.stringify(values),
                  }
                })
                if(!response.ok){
                  console.log(response);
                  console.log("Error while submitting");
                }
                const data=await response.json();
                alert(`Registration Successful. Welcome, ${data.firstName}`)
              }catch(error){
                console.error("Error during signup",error);
              }finally{
                setSubmitting(false);
              }
          }}
        >
          <Form>
            <TextInput label="First Name" name="firstName" type="text" placeholder="Your First Name" />
            <TextInput label="Last Name" name="lastName" type="text" placeholder="Your Last Name" />
            <TextInput label="userName" name="userName" type="text" placeholder="Enter your username" />
            <TextInput label="Email Address" name="email" type="email" placeholder="youremail@email.com" />
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
            <br />
            <Checkbox name="acceptedTerms">
              I accept the terms and conditions
            </Checkbox>
            <button onClick={()=>{navigate('/termsandconditions')}} className="text-blue-500 text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
            >Check Terms and Conditions</button>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded mt-4 hover:bg-blue-600 transition"
            >
              Submit
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Register;
