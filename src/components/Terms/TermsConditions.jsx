import React, { useState } from 'react';

const TermsConditions = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const termsPages = [
      {
          "title": "1. Acceptance of Terms",
          "content": "By accessing or using MediClinic Management System ('the System'), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must immediately discontinue use of the System. These Terms constitute a legally binding agreement between you (the healthcare provider, administrator, or authorized user) and MediClinic Solutions, Inc. ('we,' 'us,' or 'our'). The System is designed exclusively for authorized healthcare professionals and administrative staff to facilitate patient information management, appointment scheduling, medical record-keeping, billing, and other healthcare-related functions within a clinical setting. We reserve the right to modify these Terms at any time. You will be notified of substantial changes via email or through a notification within the System. Your continued use of the System following any modifications constitutes acceptance of the updated Terms."
      },
      {
          "title": "2. User Registration and Account Security",
          "content": "Access to the System requires registration and verification of your healthcare credentials. You must provide accurate, current, and complete information during registration, including your full legal name, professional license number (if applicable), affiliated healthcare organization, and valid contact details. You are responsible for: (a) Creating a strong password and maintaining its confidentiality; (b) Restricting access to your account and ensuring that you properly log out at the end of each session; (c) Promptly notifying us of any unauthorized access or security breach; and (d) Ensuring that any authorized users under your supervision comply with these Terms. Each user must maintain their own unique login credentials. Sharing of accounts is strictly prohibited and may result in immediate termination of access. You acknowledge that any actions taken through your account will be attributed to you and may create legally binding obligations. We maintain audit logs of all system access and activities for security and compliance purposes."
      },
      {
          "title": "3. Data Privacy and HIPAA Compliance",
          "content": "The System is designed to be HIPAA-compliant and adheres to applicable healthcare privacy regulations. By using the System, you agree to: (a) Only access Protected Health Information (PHI) for authorized healthcare purposes; (b) Comply with all applicable laws and regulations regarding patient privacy, including HIPAA and state-specific requirements; (c) Obtain proper patient consent for the collection, use, and disclosure of their health information; (d) Promptly report any data breaches or unauthorized disclosures; and (e) Complete any required privacy and security training. We implement administrative, physical, and technical safeguards to protect PHI, including encryption at rest and in transit, access controls, automatic timeouts, and regular security assessments. Our complete Privacy Policy and Business Associate Agreement (BAA) documents are incorporated by reference into these Terms. You acknowledge that you bear responsibility as a Covered Entity under HIPAA for maintaining the privacy and security of PHI within your control."
      },
      {
          "title": "4. System Use and Limitations",
          "content": "The System is provided on an 'as is' and 'as available' basis. While we strive for 99.9% uptime, we do not guarantee uninterrupted access. Scheduled maintenance will occur during non-peak hours, typically between 2:00 AM and 5:00 AM local time, with at least 48 hours advance notice for non-emergency updates. The System may be temporarily unavailable due to: (a) Planned maintenance and updates; (b) Emergency repairs or system failures; (c) Telecommunication or internet service provider failures; (d) Force majeure events; or (e) Actions needed to protect the integrity of the System. You acknowledge that: (a) The System is a management tool and not a substitute for professional medical judgment; (b) You are solely responsible for the accuracy of data entered; (c) Clinical decision support features are aids only and do not replace professional assessment; and (d) You must independently verify any critical information. We provide technical support during business hours (8:00 AM to 6:00 PM, Monday through Friday) with emergency support available 24/7 for critical issues."
      },
      {
          "title": "5. Intellectual Property Rights",
          "content": "All aspects of the System, including but not limited to its software code, interface, design, structure, algorithms, documentation, and content created by us, are protected by copyright, trademark, patent, and trade secret laws. We grant you a limited, non-exclusive, non-transferable license to use the System solely for your legitimate healthcare operations. You may not: (a) Copy, modify, or create derivative works; (b) Reverse engineer, decompile, or disassemble any part of the System; (c) Remove or alter any proprietary notices or marks; (d) Sell, rent, lease, or sublicense access; (e) Use automated scripts or bots to access the System; or (f) Attempt to gain unauthorized access to restricted areas. You retain all rights to the patient data and content you input into the System, subject to our limited right to access such data solely to provide and improve the System services. Any feedback, suggestions, or ideas you provide regarding the System may be used by us without obligation to you."
      },
      {
          "title": "6. Data Retention and Backup",
          "content": "We automatically back up all data daily with encrypted off-site storage. However, you acknowledge that you remain responsible for maintaining your own backup systems in accordance with applicable medical record retention requirements. Patient records are retained in the System in accordance with state and federal regulations, typically for a minimum of seven (7) years or as required by applicable law. Upon termination of your subscription, you will have 30 days to export your data in standard formats (CSV, PDF, or CCD/CCDA). After this period, your active access will end, though data will be archived in encrypted form for the legally required retention period. You may request complete data deletion after the mandatory retention period by submitting a formal written request. We maintain audit logs of all data access, modifications, and deletions in compliance with regulatory requirements."
      },
      {
          "title": "7. Prohibited Activities",
          "content": "While using the System, you explicitly agree not to: (a) Use the System for any unlawful purpose or in violation of these Terms; (b) Access patient records without a legitimate medical need-to-know basis; (c) Upload malicious code or attempt to compromise System security; (d) Interfere with other users' access or use of the System; (e) Upload content that infringes intellectual property rights, contains viruses, or violates any laws; (f) Attempt to access parts of the System for which you lack authorization; (g) Use the System to transmit unsolicited communications or advertisements; (h) Impersonate another person or entity or misrepresent your affiliation; (i) Use the System in any manner that could disable, overburden, or impair its functionality; or (j) Facilitate unauthorized access by third-party service providers without prior written approval. Any violation of these prohibitions may result in immediate termination of your access, potential legal action, and reporting to relevant regulatory authorities."
      },
      {
          "title": "8. Fees and Payment",
          "content": "Subscription fees are based on the service tier selected, number of authorized users, and optional modules activated. Fees are charged monthly or annually, with annual subscriptions eligible for a 15% discount. Payment is due upon receipt of invoice, and access may be suspended if payment is more than 15 days overdue. All fees are exclusive of applicable taxes, which will be added to your invoice as appropriate. We reserve the right to modify our fee structure with 60 days' advance notice. If you do not agree to a fee change, you may terminate your subscription before the new rates take effect. There are no refunds for partial subscription periods or unused services. Additional charges may apply for data migration, custom integration development, specialized training, or after-hours support. Late payments incur a 1.5% monthly interest charge or the maximum allowed by law, whichever is lower."
      },
      {
          "title": "9. Limitation of Liability",
          "content": "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, resulting from: (a) Your use or inability to use the System; (b) Unauthorized access to or alteration of your data; (c) Statements or conduct of any third party on or through the System; (d) System outages or performance issues; (e) Errors or inaccuracies in the content or functionality of the System; or (f) Any other matter relating to the System. Our total liability for any claims arising from or relating to these Terms or your use of the System shall not exceed the amount paid by you for the System during the twelve (12) months preceding the claim. Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so these limitations may not apply to you. Nothing in these Terms excludes or limits our liability for gross negligence, willful misconduct, or any other liability that cannot be excluded under applicable law."
      },
      {
          "title": "10. Termination",
          "content": "Either party may terminate this agreement with 30 days' written notice. We may suspend or terminate your access immediately and without notice if: (a) You breach any provision of these Terms; (b) You fail to pay any fees when due; (c) We are required to do so by law or regulatory authority; (d) We cease to offer the System; or (e) We determine, in our sole discretion, that your use poses a security risk. Upon termination: (a) All rights granted to you under these Terms will cease; (b) You must cease all use of the System; (c) You remain liable for any outstanding fees; and (d) Sections regarding intellectual property, limitation of liability, indemnification, and dispute resolution shall survive. You will have access to export your data for 30 days following termination, after which your active access will end, though data will be retained in accordance with our retention policies and applicable laws."
      }
  ];

  const nextPage = () => {
    if (currentPage < termsPages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentContent = termsPages[currentPage - 1];

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl bg-white shadow-lg rounded-2xl p-8 w-full sm:w-3/4 md:w-2/3">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">MediClinic Management System</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Terms and Conditions</h2>
        <p className="text-gray-600 mb-4 text-center">
          Effective Date: <span className="font-medium">April 1, 2025</span>
        </p>
        <p className="text-gray-600 mb-8 text-center">
          Last Updated: <span className="font-medium">March 15, 2025</span>
        </p>

        <div className="p-4 bg-blue-50 text-blue-700 rounded-lg mb-6">
          <p className="font-medium mb-2">Important Notice:</p>
          <p className="text-sm">This agreement contains important information about your legal rights and obligations related to the use of the MediClinic Management System, including provisions regarding patient data privacy, HIPAA compliance, and limitations of liability. Please read carefully before proceeding.</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{currentContent.title}</h2>
        <div className="text-gray-600 mb-4 leading-relaxed">{currentContent.content}</div>

        <div className="flex justify-between mt-8">
          <button
            onClick={prevPage}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span className="self-center text-gray-600">
            Page {currentPage} of {termsPages.length}
          </span>

          <button
            onClick={nextPage}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            disabled={currentPage === termsPages.length}
          >
            Next
          </button>
        </div>

        {currentPage === termsPages.length && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <input type="checkbox" id="agreement" className="mr-3 h-5 w-5" />
              <label htmlFor="agreement" className="text-gray-700">
                I have read, understood, and agree to these Terms and Conditions, including all obligations related to patient privacy and data security.
              </label>
            </div>
            <button className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
              Accept and Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsConditions;