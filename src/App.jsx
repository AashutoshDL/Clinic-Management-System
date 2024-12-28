import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Home/Home';
import TermsConditions from './components/Terms/TermsConditions';
import Navbar from './components/Home/Navbar';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile/Profile';

const App = () => {
  const AppContent = () => {
    const location = useLocation(); // Get the current location

    // Check if the current path is the landing page
    const isLandingPage = location.pathname === '/';

    return (
      <div className="flex">
        {/* Conditionally render Navbar */}
        {!isLandingPage && <Navbar />}
        <div className="flex-1 mt-0"> {/* Content area */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/termsandconditions" element={<TermsConditions />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router> 
  );
};

export default App;
