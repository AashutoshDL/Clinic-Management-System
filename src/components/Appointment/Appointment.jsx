import React, { useEffect } from 'react';
import PatientAppointment from './PatientAppointment';
import DoctorAppointment from './DoctorAppointment';
import { useAuth } from '../../context/AuthContext';
import LoginWarningPage from '../Ui/LoginWarningPage';

const Appointment = () => {
    const { isLoggedIn, role } = useAuth();

    if(!isLoggedIn){
        return  <LoginWarningPage />
    }

    if (!role || role.length === 0) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {role.includes("patient") ? (
                <PatientAppointment />  
            ) : role.includes("doctor") ? (
                <DoctorAppointment /> 
            ) : (
                <p>Please log in as either a patient or doctor.</p>  
            )}
        </div>
    );
};

export default Appointment;
