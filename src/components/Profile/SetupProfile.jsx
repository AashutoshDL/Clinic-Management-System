import React ,{ useState } from "react"

const SetupProfile = () => {
  const [formData, setFormData] = useState({
    bloodType: "",
    height: "",
    heightUnit: "cm",
    weight: "",
    weightUnit: "kg",
    medications: [],
    systolicBP: "",
    diastolicBP: "",
    heartRate: "",
    temperature: "",
    temperatureUnit: "celsius",
    bloodGlucose: "",
  })

  const [newMedication, setNewMedication] = useState("")
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const addMedication = () => {
    if (newMedication.trim() !== "") {
      const updatedMedications = [...formData.medications, newMedication]
      setFormData({
        ...formData,
        medications: updatedMedications,
      })
      setNewMedication("")
    }
  }

  const removeMedication = (index) => {
    const updatedMedications = formData.medications.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      medications: updatedMedications,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.bloodType) newErrors.bloodType = "Blood type is required"
    if (!formData.height) newErrors.height = "Height is required"
    if (!formData.weight) newErrors.weight = "Weight is required"
    if (!formData.systolicBP) newErrors.systolicBP = "Systolic BP is required"
    if (!formData.diastolicBP) newErrors.diastolicBP = "Diastolic BP is required"
    if (!formData.heartRate) newErrors.heartRate = "Heart rate is required"
    if (!formData.temperature) newErrors.temperature = "Temperature is required"
    if (!formData.bloodGlucose) newErrors.bloodGlucose = "Blood glucose is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      console.log(formData)
      // Here you would typically send the data to your backend
      alert("Profile saved successfully!")
    }
  }

  return (
    <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <div
        className="card"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div className="card-header" style={{ padding: "24px 24px 0" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px" }}>Medical Profile Setup</h2>
          <p style={{ color: "#666", marginBottom: "16px" }}>
            Please fill in your medical information. This data will be kept private and secure.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-content" style={{ padding: "24px" }}>
            <div className="section" style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px" }}>Basic Information</h3>
              <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label htmlFor="bloodType" style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: errors.bloodType ? "1px solid #f43f5e" : "1px solid #ddd",
                  }}
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
                </select>
                {errors.bloodType && (
                  <p style={{ color: "#f43f5e", fontSize: "14px", marginTop: "4px" }}>{errors.bloodType}</p>
                )}
              </div>

              <div className="form-row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -12px" }}>
                <div
                  className="form-group"
                  style={{ flex: "1 1 50%", padding: "0 12px", minWidth: "250px", marginBottom: "16px" }}
                >
                  <label htmlFor="height" style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Height
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="Height"
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "4px",
                        border: errors.height ? "1px solid #f43f5e" : "1px solid #ddd",
                      }}
                    />
                    <select
                      name="heightUnit"
                      value={formData.heightUnit}
                      onChange={handleChange}
                      style={{
                        width: "80px",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="cm">cm</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                  {errors.height && (
                    <p style={{ color: "#f43f5e", fontSize: "14px", marginTop: "4px" }}>{errors.height}</p>
                  )}
                </div>

                <div
                  className="form-group"
                  style={{ flex: "1 1 50%", padding: "0 12px", minWidth: "250px", marginBottom: "16px" }}
                >
                  <label htmlFor="weight" style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Weight
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Weight"
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "4px",
                        border: errors.weight ? "1px solid #f43f5e" : "1px solid #ddd",
                      }}
                    />
                    <select
                      name="weightUnit"
                      value={formData.weightUnit}
                      onChange={handleChange}
                      style={{
                        width: "80px",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                  {errors.weight && (
                    <p style={{ color: "#f43f5e", fontSize: "14px", marginTop: "4px" }}>{errors.weight}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="section" style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px" }}>Medications</h3>
              <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Current Medications</label>
                <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <input
                    type="text"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Add medication"
                    style={{
                      flex: "1",
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <button
                    type="button"
                    onClick={addMedication}
                    style={{
                      padding: "10px",
                      borderRadius: "4px",
                      backgroundColor: "#0284c7",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                  List all medications you are currently taking
                </p>

                {formData.medications.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    {formData.medications.map((med, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 12px",
                          backgroundColor: "#f5f5f5",
                          borderRadius: "4px",
                          marginBottom: "8px",
                        }}
                      >
                        <span>{med}</span>
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#f43f5e",
                            cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="section" style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "500", marginBottom: "12px" }}>Vital Signs</h3>
              <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />

              <div className="form-row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -12px" }}>
                <div
                  className="form-group"
                  style={{ flex: "1 1 50%", padding: "0 12px", minWidth: "250px", marginBottom: "16px" }}
                >
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Blood Pressure (mmHg)
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="number"
                      name="systolicBP"
                      value={formData.systolicBP}
                      onChange={handleChange}
                      placeholder="Systolic"
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "4px",
                        border: errors.systolicBP ? "1px solid #f43f5e" : "1px solid #ddd",
                      }}
                    />
                    <span>/</span>
                    <input
                      type="number"
                      name="diastolicBP"
                      value={formData.diastolicBP}
                      onChange={handleChange}
                      placeholder="Diastolic"
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "4px",
                        border: errors.diastolicBP ? "1px solid #f43f5e" : "1px solid #ddd",
                      }}
                    />
                  </div>
                  {(errors.systolicBP || errors.diastolicBP) && (
                    <p style={{ color: "#f43f5e", fontSize: "14px", marginTop: "4px" }}>
                      {errors.systolicBP || errors.diastolicBP}
                    </p>
                  )}
                </div>

                <div
                  className="form-group"
                  style={{ flex: "1 1 50%", padding: "0 12px", minWidth: "250px", marginBottom: "16px" }}
                >
                  <label htmlFor="heartRate" style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    id="heartRate"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    placeholder="Heart rate"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: errors.heartRate ? "1px solid #f43f5e" : "1px solid #ddd",
                    }}
                  />
                  {errors.heartRate && (
                    <p style={{ color: "#f43f5e", fontSize: "14px", marginTop: "4px" }}>{errors.heartRate}</p>
                  )}
                </div>
              </div>

              <div className="form-row" style={{ display: "flex", flexWrap: "wrap", margin: "0 -12px" }}>
                <div
                  className="form-group"
                  style={{ flex: "1 1 50%", padding: "0 12px", minWidth: "250px", marginBottom: "16px" }}
                >
                  <label htmlFor="temperature" style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Temperature
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="number"
                      id="temperature"
                      name="temperature"
                      step="0.1"
                      value={formData.temperature}
                      onChange={handleChange}
                      placeholder="Temperature"
                      style={{
                        flex: "1",
                        padding: "10px",
                        borderRadius: "4px",
                        border: errors.temperature ? "1px solid #f43f5e" : "1px solid #ddd",
                      }}
                    />
                    <select
                      name="temperatureUnit"
                      value={formData.temperatureUnit}
                      onChange={handleChange}
                      style={{
                        width: "100px",
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="celsius">°C</option>
                      <option value="fahrenheit">°F</option>
                    </select>
                  </div>
                  {errors.temperature && (
                    <p style={{ color: "#f43f5e", fontSize: "14px", marginTop: "4px" }}>{errors.temperature}</p>
                  )}
                </div>

                <div
                  className="form-group"
                  style={{ flex: "1 1 50%", padding: "0 12px", minWidth: "250px", marginBottom: "16px" }}
                >
                  <label htmlFor="bloodGlucose" style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                    Blood Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    id="bloodGlucose"
                    name="bloodGlucose"
                    value={formData.bloodGlucose}
                    onChange={handleChange}
                    placeholder="Blood glucose"
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "4px",
                      border: errors.bloodGlucose ? "1px solid #f43f5e" : "1px solid #ddd",
                    }}
                  />
                  {errors.bloodGlucose && (
                    <p style={{ color: "#f43f5e", fontSize: "14px", marginTop: "4px" }}>{errors.bloodGlucose}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="card-footer"
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              type="button"
              style={{
                padding: "10px 16px",
                borderRadius: "4px",
                backgroundColor: "white",
                color: "#333",
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                borderRadius: "4px",
                backgroundColor: "#0284c7",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SetupProfile