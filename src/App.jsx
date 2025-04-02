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
import { AuthProvider } from './context/AuthContext';
import LoadingScreen from './components/Ui/LoadingScreen';
import EmailReminders from './components/Reminders/EmailReminders';
import Appointment from './components/Appointment/Appointment';
import DoctorProfile from './components/Profile/DoctorProfile';
import ReportSharing from './components/Report/ReportSharing';
import History from './components/History/History';
import Chat from './components/chat/Chat';
import CreateSuperadmin from './components/Superadmin/CreateSuperadmin';
import Reports from './components/Report/Reports';
import ManageAdmins from './components/Superadmin/ManageAdmins';
import ManageReports from './components/Superadmin/ManageReports';
import ManageDoctors from './components/Superadmin/ManageDoctors';
import SetupProfile from './components/Profile/SetupProfile';
import MedicineForm from './components/Meds-API/MedicineForm';
import DeletingScreen from './components/Ui/DeletingScreen';

const App = () => {
  const AppContent = () => {
    const location = useLocation();

    const isLoginOrRegisterPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname==='/' || location.pathname==='/verifyEmail' || location.pathname==='/superadmin';

    return (
      <div className="flex font-figtree">
        {!isLoginOrRegisterPage && <Navbar />}
        <div className="flex-1 mt-0">
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
            <Route path='/create-superadmin' element={<CreateSuperadmin />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/manageAdmins' element={<ManageAdmins />} />
            <Route path='/manageReports' element={<ManageReports />} />
            <Route path='/manageDoctors' element={<ManageDoctors />} />
            <Route path='/edit-profile' element={<SetupProfile />} />
            <Route path='/medicineForm' element={<MedicineForm />} />
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
