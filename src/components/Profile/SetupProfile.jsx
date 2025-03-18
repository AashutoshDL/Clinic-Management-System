import { Formik, Form, Field, FieldArray } from "formik"
import * as Yup from "yup"
import { MySelect } from "../Auth/FormElements"
import React from "react"
import axiosInstance from "../service/axiosInterceptor"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const validationSchema = Yup.object({
  bloodType: Yup.string().required("Blood type is required"),
  height: Yup.number().required("Height is required"),
  weight: Yup.number().required("Weight is required"),
  systolicBP: Yup.number().required("Systolic BP is required"),
  diastolicBP: Yup.number().required("Diastolic BP is required"),
  heartRate: Yup.number().required("Heart rate is required"),
  temperature: Yup.number(),
  bloodGlucose: Yup.number().required("Blood glucose is required"),
})

const SetupProfile = () => {
  const {userId} = useAuth();
  const navigate=useNavigate();
  return (
    <div className="container mx-auto px-5 py-10 max-w-7xl">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 pt-6">
          <h2 className="text-2xl font-semibold mb-2">Medical Profile Setup</h2>
          <p className="text-gray-500 mb-4">
            Please fill in your medical information. This data will be kept private and secure.
          </p>
        </div>

        <Formik
          initialValues={{
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
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const response= axiosInstance(`/profile/setupProfileById/${userId}`)
            console.log(values)
            alert("Profile saved successfully!")
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="p-6">
                {/* Basic Information Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                  <hr className="my-3 border-t border-gray-100" />

                  <div className="mb-4">
                    <MySelect
                      label="Blood Type"
                      name="bloodType"
                      className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    >
                      <option value="">Select your blood type</option>
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

                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3 mb-4">
                      <label htmlFor="height" className="block mb-2 font-medium">
                        Height
                      </label>
                      <div className="flex gap-2">
                        <Field
                          name="height"
                          type="number"
                          placeholder="Height"
                          className="flex-1 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                        <Field
                          as="select"
                          name="heightUnit"
                          className="w-20 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="cm">cm</option>
                          <option value="ft">ft</option>
                        </Field>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-4">
                      <label htmlFor="weight" className="block mb-2 font-medium">
                        Weight
                      </label>
                      <div className="flex gap-2">
                        <Field
                          name="weight"
                          type="number"
                          placeholder="Weight"
                          className="flex-1 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                        <Field
                          as="select"
                          name="weightUnit"
                          className="w-20 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                        </Field>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vital Signs Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Vital Signs</h3>
                  <hr className="my-3 border-t border-gray-100" />

                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3 mb-4">
                      <label className="block mb-2 font-medium">Blood Pressure (mmHg)</label>
                      <div className="flex items-center gap-2">
                        <Field
                          name="systolicBP"
                          type="number"
                          placeholder="Systolic"
                          className="flex-1 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                        <span>/</span>
                        <Field
                          name="diastolicBP"
                          type="number"
                          placeholder="Diastolic"
                          className="flex-1 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-4">
                      <label htmlFor="heartRate" className="block mb-2 font-medium">
                        Heart Rate (bpm)
                      </label>
                      <Field
                        name="heartRate"
                        type="number"
                        placeholder="Heart rate"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full md:w-1/2 px-3 mb-4">
                      <label htmlFor="temperature" className="block mb-2 font-medium">
                        Temperature
                      </label>
                      <div className="flex gap-2">
                        <Field
                          name="temperature"
                          type="number"
                          step="0.1"
                          placeholder="Temperature"
                          className="flex-1 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        />
                        <Field
                          as="select"
                          name="temperatureUnit"
                          className="w-24 p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="celsius">°C</option>
                          <option value="fahrenheit">°F</option>
                        </Field>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-4">
                      <label htmlFor="bloodGlucose" className="block mb-2 font-medium">
                        Blood Glucose (mg/dL)
                      </label>
                      <Field
                        name="bloodGlucose"
                        type="number"
                        placeholder="Blood glucose"
                        className="w-full p-2.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  onClick={()=>(navigate('/home'))}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SetupProfile