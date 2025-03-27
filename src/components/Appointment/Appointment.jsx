import React, { useEffect } from 'react';
import PatientAppointment from './PatientAppointment';
import DoctorAppointment from './DoctorAppointment';
import { useAuth } from '../../context/AuthContext';

const Appointment = () => {
    const { role } = useAuth();

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
