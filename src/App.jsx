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
import Appointment from './components/Appointment/Appointment';
import DoctorProfile from './components/Profile/DoctorProfile';
import ReportSharing from './components/Report/ReportSharing';
import History from './components/History/History';
import Chat from './components/chat/Chat';

const App = () => {
  const AppContent = () => {
    const location = useLocation(); // Get the current location

    // Check if the current path is the login or register page
    const isLoginOrRegisterPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname==='/' || location.pathname==='/verifyEmail';

    return (
      <div className="flex font-figtree">
        {/* Conditionally render Navbar */}
        {!isLoginOrRegisterPage && <Navbar />}
        <div className="flex-1 mt-0"> {/* Content area */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/termsandconditions" element={<TermsConditions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/emailReminders" element={<Reminders />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/loading' element={<LoadingScreen />} />
            <Route path='/doctorProfile' element={<DoctorProfile/>} />
            <Route path='/reminders' element={<EmailReminders />} />
            <Route path='/reportSharing' element={<ReportSharing />} />
            <Route path='/messages' element={<Chat />} />
            <Route path='/history' element={<History />} />
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
