import React from 'react';

const TermsConditions = () => {
  return (
    <div className="bg-gray-100 py-10 px-5 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms and Conditions</h1>
        <p className="text-gray-600 mb-4">
          Effective Date: <span className="font-medium">12/24/2024</span>
        </p>
        <p className="text-gray-600 mb-8">
          Last Updated: <span className="font-medium">12/20/2024</span>
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-600 mb-4">
          By using the Clinic Management System ("the System"), you agree to these terms and conditions. If you do not agree, you must refrain from using the System.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. User Responsibilities</h2>
        <p className="text-gray-600 mb-4">
          <strong>2.1 Account Registration:</strong> You must provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your account credentials.
        </p>
        <p className="text-gray-600 mb-4">
          <strong>2.2 Usage Compliance:</strong> You agree to use the System solely for lawful purposes and in compliance with all applicable laws and regulations.
        </p>
        <p className="text-gray-600 mb-4">
          <strong>2.3 Prohibited Activities:</strong> You are prohibited from:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Sharing patient information without proper authorization.</li>
          <li>Using the System for fraudulent or malicious activities.</li>
          <li>Attempting to breach the security of the System.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Privacy</h2>
        <p className="text-gray-600 mb-4">
          <strong>3.1 Patient Data:</strong> The System is designed to handle sensitive medical information. You must ensure compliance with applicable data protection regulations (e.g., HIPAA, GDPR).
        </p>
        <p className="text-gray-600 mb-4">
          <strong>3.2 User Data:</strong> We collect and process user data in accordance with our <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. System Availability</h2>
        <p className="text-gray-600 mb-4">
          While we strive to ensure that the System is available at all times, we do not guarantee uninterrupted access. Maintenance, upgrades, or unforeseen technical issues may result in temporary outages.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
        <p className="text-gray-600 mb-4">
          The System and its content (excluding user-generated content) are protected by intellectual property laws. You may not reproduce, distribute, or modify any content without prior written permission from [Your Company Name].
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitations of Liability</h2>
        <p className="text-gray-600 mb-4">
          To the extent permitted by law:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>[Your Company Name] is not liable for any loss or damage resulting from the misuse of the System.</li>
          <li>We are not responsible for errors or omissions in user-provided data.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Termination</h2>
        <p className="text-gray-600 mb-4">
          We reserve the right to suspend or terminate your access to the System if you breach these terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Amendments</h2>
        <p className="text-gray-600 mb-4">
          We may revise these terms from time to time. Continued use of the System after changes are posted constitutes your acceptance of the revised terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Governing Law</h2>
        <p className="text-gray-600 mb-4">
          These terms shall be governed by the laws of [Your Jurisdiction]. Any disputes will be subject to the exclusive jurisdiction of the courts in [Your Jurisdiction].
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions about these terms, please contact us:  
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Email: [Your Email Address]</li>
          <li>Phone: [Your Phone Number]</li>
          <li>Address: [Your Address]</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsConditions;
