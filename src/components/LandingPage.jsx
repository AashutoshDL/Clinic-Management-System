import { useNavigate } from "react-router-dom";
import { Search, Calendar, UserPlus, Shield, Award, PhoneCall, Clock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState("patients");

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Find Specialists",
      description: "Access top healthcare professionals based on specialty, location, and availability.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Easy Scheduling",
      description: "Book appointments instantly with our intuitive calendar system.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Records",
      description: "Your medical information is protected with enterprise-grade security.",
    },
  ];

  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Patient",
      image: "/images/patient1.jpg",
      content: "The clinic management system has made scheduling appointments so much easier. I love the reminders and the ability to see my entire medical history in one place.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      image: "/images/doctor1.jpg",
      content: "As a physician, this system has streamlined my workflow and reduced administrative burden. Patient records are well-organized and accessible when I need them.",
      rating: 4,
    },
    {
      name: "Emma Thompson",
      role: "Healthcare Administrator",
      image: "/images/admin1.jpg",
      content: "Managing our clinic operations has never been more efficient. The reporting tools give us valuable insights to improve patient care and operational efficiency.",
      rating: 5,
    },
  ];

  const stats = [
    { value: "50,000+", label: "Registered Patients" },
    { value: "1,200+", label: "Healthcare Providers" },
    { value: "98%", label: "Patient Satisfaction" },
    { value: "24/7", label: "Support Available" },
  ];

  const tabContent = {
    patients: {
      title: "For Patients",
      description: "Take control of your healthcare journey with our intuitive patient portal.",
      features: [
        "Easy appointment scheduling with any specialist",
        "Secure access to your complete medical records",
        "Medication reminders and prescription renewal requests",
        "Direct messaging with your healthcare providers",
        "Online bill payment and insurance management"
      ],
      cta: "Sign Up as Patient"
    },
    doctors: {
      title: "For Providers",
      description: "Streamline your practice and focus on what matters most - your patients.",
      features: [
        "Efficient appointment management and scheduling",
        "Comprehensive patient records and medical history",
        "E-prescribing and lab order management",
        "Billing integration and insurance verification",
        "Clinical decision support tools"
      ],
      cta: "Join as Provider"
    },
    clinics: {
      title: "For Clinics",
      description: "Optimize your clinic operations with our comprehensive management solution.",
      features: [
        "Complete practice management system",
        "Staff scheduling and resource allocation",
        "Inventory management and supply tracking",
        "Financial reporting and analytics dashboard",
        "Regulatory compliance and audit support"
      ],
      cta: "Schedule Demo"
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {}
      <nav className="flex justify-between items-center p-4 lg:px-8 bg-white shadow-sm fixed w-full z-20 top-0">
        <div className="text-2xl font-bold text-blue-600">Medisys</div>
        <div className="hidden md:flex gap-6">
          <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
          <a href="#solutions" className="text-gray-600 hover:text-blue-600">Solutions</a>
          <a href="#reviews" className="text-gray-600 hover:text-blue-600">Reviews</a>
          <a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a>
        </div>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              My Profile
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="text-blue-600 hover:text-blue-700 font-medium">
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </nav>

      {}
      <div className="flex flex-col lg:flex-row min-h-screen pt-16" id="home">
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Your Health, <br />
            <span className="text-blue-600">Our Priority</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-xl">
            Experience healthcare management reimagined. Book appointments, find specialists, and manage your family's
            health all in one place.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center p-8 lg:p-0">
          <div className="relative w-full max-w-lg">
            {}
            <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
              <img
                src="/images/doctor-with-patient.jpg"
                alt="Healthcare professional with patient"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.currentTarget.src = "../../public/images/clinicPic.png";
                }}
              />
            </div>

            {}
            <div className="absolute top-1/4 -left-6 w-24 h-24 bg-blue-200 rounded-full z-0 opacity-70"></div>
            <div className="absolute bottom-1/4 -right-6 w-32 h-32 bg-blue-100 rounded-full z-0 opacity-70"></div>

            {}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-lg shadow-lg z-20">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-blue-600">98%</span>
                <span className="text-sm text-gray-600">Patient Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="py-16 bg-white" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive healthcare management system is designed to make healthcare accessible, 
              efficient, and personalized for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="text-blue-600 mb-4 bg-white p-3 rounded-full inline-block">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-xl">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="py-16 bg-gray-50" id="solutions">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Solutions For Everyone</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to serve the unique needs of patients, healthcare providers, and clinical facilities.
            </p>
          </div>

          <div className="flex flex-wrap justify-center mb-8">
            <div className="bg-white rounded-lg shadow-md inline-flex p-1 mb-8">
              <button 
                className={`px-6 py-2 rounded-lg ${activeTab === 'patients' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                onClick={() => setActiveTab('patients')}
              >
                For Patients
              </button>
              <button 
                className={`px-6 py-2 rounded-lg ${activeTab === 'doctors' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                onClick={() => setActiveTab('doctors')}
              >
                For Providers
              </button>
              <button 
                className={`px-6 py-2 rounded-lg ${activeTab === 'clinics' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                onClick={() => setActiveTab('clinics')}
              >
                For Clinics
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{tabContent[activeTab].title}</h3>
                <p className="text-gray-600 mb-6">{tabContent[activeTab].description}</p>
                
                <ul className="space-y-3 mb-8">
                  {tabContent[activeTab].features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2">
                  {tabContent[activeTab].cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src={`/images/${activeTab}-illustration.png`} 
                  alt={tabContent[activeTab].title}
                  className="max-w-full h-auto rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/api/placeholder/500/350";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="py-16 bg-white" id="reviews">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. See what patients, doctors, and administrators 
              have to say about our healthcare management platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={review.image} 
                      alt={review.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/48/48";
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-gray-500 text-sm">{review.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-600 italic">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      <footer className="bg-gray-900 text-white pt-16 pb-8" id="contact">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">HealthConnect</h3>
              <p className="text-gray-400 mb-4">
                Revolutionizing healthcare management for patients and providers alike.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Training</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <PhoneCall className="w-5 h-5 text-gray-400 mt-1" />
                  <span className="text-gray-400">+1 (800) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-400">support@healthconnect.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-400">123 Health Street<br />San Francisco, CA 94158</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-800 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              &copy; 2025 HealthConnect. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;