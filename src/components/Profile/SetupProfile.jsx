import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { MySelect } from "../Auth/FormElements";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../service/baseURL";
import axios from "axios";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  username: Yup.string().required("Username is required"),
  bloodType: Yup.string().required("Blood type is required"),
  height: Yup.number().required("Height is required"),
  weight: Yup.number().required("Weight is required"),
  systolicBP: Yup.number().required("Systolic BP is required"),
  diastolicBP: Yup.number().required("Diastolic BP is required"),
  heartRate: Yup.number().required("Heart rate is required"),
  temperature: Yup.number(),
  bloodGlucose: Yup.number().required("Blood glucose is required"),
});

const SetupProfile = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    userName: "",
    bloodType: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    systolicBP: "",
    diastolicBP: "",
    heartRate: "",
    temperature: "",
    temperatureUnit: "celsius",
    bloodGlucose: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/patient/getPatientById/${userId}`);
        const apiData = response.data.data;

        setInitialValues(prev => ({
          ...prev,
          ...apiData,
          height: apiData.height || "",
          weight: apiData.weight || "",
          systolicBP: apiData.systolicBP || "",
          diastolicBP: apiData.diastolicBP || "",
          heartRate: apiData.heartRate || "",
          temperature: apiData.temperature || "",
          bloodGlucose: apiData.bloodGlucose || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  const handleSubmit = async (values, setSubmitting) => {
    try {
      const response = await axios.patch(
        `${baseURL}/patient/setupProfileById/${userId}`,
        values,
        { headers: { "Content-Type": "application/json" } }
      );
      navigate("/home");
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      setError("An error occurred while updating your profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading profile data...</div>;

  return (
    <div className="container mx-auto px-5 py-10 max-w-7xl">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 pt-6">
          <h2 className="text-2xl font-semibold mb-2">Edit Profile</h2>
          <p className="text-gray-500 mb-4">
            Update your personal and medical information. All data is securely stored.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="p-6">
                {}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                  <hr className="my-3 border-t border-gray-100" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="name" className="block mb-2 font-medium">
                        Full Name
                      </label>
                      <Field
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="userName" className="block mb-2 font-medium">
                        Username
                      </label>
                      <Field
                        name="userName"
                        type="text"
                        placeholder="your username"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Medical Details</h3>
                  <hr className="my-3 border-t border-gray-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <MySelect
                        label="Blood Type"
                        name="bloodType"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </MySelect>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="height" className="block mb-2 font-medium">
                        Height
                      </label>
                      <div className="flex gap-2">
                        <Field
                          name="height"
                          type="number"
                          placeholder="175"
                          className="flex-1 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Field
                          as="select"
                          name="heightUnit"
                          className="w-24 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="cm">cm</option>
                          <option value="ft">feet</option>
                        </Field>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="weight" className="block mb-2 font-medium">
                        Weight
                      </label>
                      <div className="flex gap-2">
                        <Field
                          name="weight"
                          type="number"
                          placeholder="70"
                          className="flex-1 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Field
                          as="select"
                          name="weightUnit"
                          className="w-24 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Vital Signs</h3>
                  <hr className="my-3 border-t border-gray-100" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="systolicBP" className="block mb-2 font-medium">
                        Systolic BP (mmHg)
                      </label>
                      <Field
                        name="systolicBP"
                        type="number"
                        placeholder="120"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="diastolicBP" className="block mb-2 font-medium">
                        Diastolic BP (mmHg)
                      </label>
                      <Field
                        name="diastolicBP"
                        type="number"
                        placeholder="80"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="heartRate" className="block mb-2 font-medium">
                        Heart Rate (bpm)
                      </label>
                      <Field
                        name="heartRate"
                        type="number"
                        placeholder="72"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="bloodGlucose" className="block mb-2 font-medium">
                        Blood Glucose (mg/dL)
                      </label>
                      <Field
                        name="bloodGlucose"
                        type="number"
                        placeholder="100"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSubmit(values)}
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </button>
                </div>
                {error && <div className="text-red-500 mt-4">{error}</div>}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SetupProfile;
