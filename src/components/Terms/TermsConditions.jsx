import React, { useState } from 'react';

const TermsConditions = () => {
  // State to track the current page
  const [currentPage, setCurrentPage] = useState(1);

  // Array of sections, each representing a page
  const termsPages = [
      {
          "title": "1. Acceptance of Terms",
          "content": "By accessing or using the Clinic Management System ('the System'), you agree to comply with and be bound by these terms and conditions. If you do not agree to these terms, you must refrain from using the System. These terms govern all interactions with the System, including, but not limited to, registration, access, and use of its features. The System is designed for healthcare-related purposes, facilitating management of patient information, scheduling, and medical records within a clinic environment. By using the System, you confirm that you have read, understood, and accepted these terms. Additionally, we reserve the right to modify, update, or change these terms and conditions at any time without prior notice. Any changes to these terms will be effective immediately upon posting on the website or within the System, and it is your responsibility to review the terms regularly to stay informed of any changes."
      },
      {
          "title": "2. User Responsibilities",
          "content": "As a user of the System, you agree to provide accurate, current, and complete information during the registration process, including but not limited to your name, contact details, and professional information (if applicable). You are responsible for maintaining the confidentiality and security of your account credentials (username, password, security questions, etc.). Failure to maintain the security of your account may result in unauthorized access, and you acknowledge that you are fully responsible for all activities that occur under your account, whether authorized or not. If you believe your account has been compromised, you must notify us immediately so we can take appropriate action to secure your information. Additionally, you are responsible for keeping your information up to date and for ensuring that it remains true and accurate at all times. You agree not to use the System for any illegal, fraudulent, or unauthorized purposes, including violating privacy laws, and you must comply with all relevant laws and regulations while interacting with the System."
      },
      {
          "title": "3. Data Privacy",
          "content": "The protection of your personal and medical data is of utmost importance to us. The System is designed to handle sensitive medical information in accordance with strict data protection regulations, including HIPAA (Health Insurance Portability and Accountability Act), GDPR (General Data Protection Regulation), and other applicable laws. We are committed to safeguarding your personal health information (PHI) using the latest encryption technologies and security measures. By using the System, you consent to the collection, storage, processing, and sharing of your data as outlined in our Privacy Policy. You have the right to access, update, or delete your personal information at any time, in accordance with applicable laws. However, certain information, such as medical records, may be subject to retention requirements mandated by law. We will make every effort to inform you about the collection and use of your data and to ensure that it is used only for the purposes it was collected. It is also your responsibility to notify us if any of your information changes or if you believe that any personal data held by us is incorrect, in which case we will make reasonable efforts to correct it."
      },
      {
          "title": "4. System Availability",
          "content": "We make every effort to ensure that the Clinic Management System is available at all times, but we do not guarantee uninterrupted access. The System may undergo regular maintenance, updates, or upgrades that could result in temporary unavailability. Additionally, unforeseen technical issues, such as server failures, software bugs, or network outages, could cause periods of downtime. We also reserve the right to temporarily suspend the System for emergency maintenance or upgrades, in which case we will make reasonable efforts to notify users in advance. While we strive to minimize disruption to service, we are not liable for any loss of data, access, or service interruptions that may occur. We recommend that you back up your data regularly to avoid any loss during downtimes. We will provide support in case of technical issues, but we do not guarantee resolution within any specific time frame."
      },
      {
          "title": "5. Intellectual Property",
          "content": "The Clinic Management System, including all of its content, features, and functionality, is owned by us or our licensors and is protected by intellectual property laws, including copyright, trademark, patent, and trade secret laws. This includes, but is not limited to, the software, design, layout, images, graphics, text, audio, and video content. You may not copy, reproduce, distribute, display, modify, or create derivative works of any part of the System or its content without our express written permission. Any use of the System's content for commercial purposes or in a manner that violates these terms is strictly prohibited. Unauthorized use of any content may result in legal action. You acknowledge that all intellectual property rights in the System and its content are retained by us, and your use of the System does not grant you any ownership or rights to such intellectual property. If you wish to use any part of the content in any manner not covered by these terms, you must obtain explicit permission from us. User-generated content, including any medical records or data submitted to the System, remains the property of the user but is subject to our data protection policies."
      }
  ];

  // Function to go to the next page
  const nextPage = () => {
    if (currentPage < termsPages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Current page content based on the state
  const currentContent = termsPages[currentPage - 1];

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl bg-white shadow-lg rounded-2xl p-8 w-full sm:w-3/4 md:w-2/3">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Terms and Conditions</h1>
        <p className="text-gray-600 mb-4 text-center">
          Effective Date: <span className="font-medium">12/24/2024</span>
        </p>
        <p className="text-gray-600 mb-8 text-center">
          Last Updated: <span className="font-medium">12/20/2024</span>
        </p>

        {/* Display the current page's content */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{currentContent.title}</h2>
        <p className="text-gray-600 mb-4">{currentContent.content}</p>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-6">
          <button
            onClick={prevPage}
            className="text-blue-600 hover:underline disabled:text-gray-400"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <button
            onClick={nextPage}
            className="text-blue-600 hover:underline disabled:text-gray-400"
            disabled={currentPage === termsPages.length}
          >
            Next
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-gray-600">
            Page {currentPage} of {termsPages.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
