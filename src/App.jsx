import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Home/Home';
import TermsConditions from './components/Terms/TermsConditions';
import Navbar from './components/Home/Navbar';
import LandingPage from './components/LandingPage';
import Profile from './components/Profile/Profile';
import Reminders from './components/Reminders/Reminders';
import VerifyEmail from './components/Auth/VerifyEmail';
import Admin from './components/Admin/Admin';
import { AuthProvider } from './components/context/AuthContext';
import LoadingScreen from './components/Ui/LoadingScreen';
import EmailReminders from './components/Reminders/EmailReminders';

const App = () => {
  const AppContent = () => {
    const location = useLocation(); // Get the current location

    // Check if the current path is the landing page
    const isLandingPage = location.pathname === '/';

    return (
      <div className="flex font-figtree">
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
            <Route path="/emailReminders" element={<Reminders />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/loading' element={<LoadingScreen />} />
            <Route path='/reminders' element={<EmailReminders />} />
          </Routes>
        </div>
      </div>
    );
  };

  return (
    <AuthProvider>
    <Router>
      <AppContent />
    </Router> 
    </AuthProvider>
  );
};

export default App;
