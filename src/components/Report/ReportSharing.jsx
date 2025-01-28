import React, { useState } from "react";

const ReportSharing = () => {
  const [emails, setEmails] = useState(""); // Store emails as a string
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emails || !file) {
      alert("Please provide both emails and a file.");
      return;
    }

    const emailList = emails.split(",").map((email) => email.trim()); // Split emails by comma and trim any extra spaces

    setIsSubmitting(true);

    // Create FormData object to send the emails and file
    const formData = new FormData();
    formData.append("emails", JSON.stringify(emailList)); // Convert email array to JSON string
    formData.append("file", file);

    try {
      // Replace this with your API endpoint
      const response = await fetch("/api/send-email", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Email(s) sent successfully!");
      } else {
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
      setEmails("");
      setFile(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 shadow-lg bg-white rounded-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Report Sharing</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
              Email Addresses (separate with commas)
            </label>
            <input
              id="emails"
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter recipient emails"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload File
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none"
          >
            {isSubmitting ? "Sending..." : "Send Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportSharing;
