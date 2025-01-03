import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faQuestionCircle, faMessage, faUser, faCalendar, faCalculator, faCheck, faPhone, faGears} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <nav className="bg-white-400 shadow-md h-min w-48 flex flex-col p-4 mt-20 font-archivo items-start">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive
            ? "mb-4 bg-blue-950 text-white p-4 pr-8 rounded-lg"
            : "mb-4 hover:text-white-600 p-4 rounded-lg"
        }
      >
        <FontAwesomeIcon icon={faHome} className='mr-4'/>
        Home
      </NavLink>
      <NavLink
        to="/reminders"
        className={({ isActive }) =>
          isActive
        ? "mb-4 bg-blue-950 text-white p-4 pr-8 rounded-lg"
        : "mb-4 hover:text-white-600 p-4 rounded-lg"
      }
      >
      <FontAwesomeIcon icon={faCheck} className='mr-4'/>
        Reminders
      </NavLink>
      <NavLink
        to="/messages"
        className={({ isActive }) =>
          isActive
            ? "mb-4 bg-blue-950 text-white p-4 pr-8 rounded-lg"
            : "mb-4 hover:text-white-600 p-4 rounded-lg"
        }
      >
        <FontAwesomeIcon icon={faMessage} className='mr-4'/>
        Messages
      </NavLink>
      <NavLink
        to="/calendar"
        className={({ isActive }) =>
          isActive
        ? "mb-4 bg-blue-950 text-white p-4 pr-4 rounded-lg"
        : "mb-4  hover:text-white-600 p-4 rounded-lg"
      }
      >
      <FontAwesomeIcon icon={faCalendar} className='mr-4'/>
        Calendar
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive
        ? "mb-4 bg-blue-950 text-white p-4 pr-4 rounded-lg"
        : "mb-4  hover:text-white-600 p-4 rounded-lg"
      }
      >
      <FontAwesomeIcon icon={faGears} className='mr-4'/>
        Settings
      </NavLink>    
      <NavLink
        to="/login"
        className={({ isActive }) =>
          isActive
            ? "bg-blue-950 text-white p-4 pr-4  rounded-lg"
            : "hover:text-white-600 p-4 rounded-lg"
        }
      >
      <FontAwesomeIcon icon={faUser} className='mr-2'/>
        Login/Register
      </NavLink>
    </nav>
  );
};

export default Navbar;