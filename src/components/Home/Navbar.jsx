import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMessage, faUser, faCalendar, faCheck, faGears, faLock, faClock} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as needed

const Navbar = () => {
  const { isLoggedIn, user } = useAuth(); // Get the login status and user from context

  return (
    <nav className="bg-white-400 border-r-2 h-min w-48 flex flex-col p-4 mt-20 font-archivo items-start">
      <div>
        <img src='/images/1-nobg1.png' alt='logo' />
      </div>
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
        to="/appointment"
        className={({ isActive }) =>
          isActive
            ? "mb-4 bg-blue-950 text-white p-4 pr-4 rounded-lg"
            : "mb-4  hover:text-white-600 p-4 rounded-lg"
        }
      >
        <FontAwesomeIcon icon={faCalendar} className='mr-4'/>
        Appointment
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          isActive
            ? "mb-4 bg-blue-950 text-white p-4 pr-4 rounded-lg"
            : "mb-4  hover:text-white-600 p-4 rounded-lg"
        }
      >
        <FontAwesomeIcon icon={faClock} className='mr-4'/>
        History
      </NavLink>

      {isLoggedIn ? (
        // Show Profile link if logged in
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "mb-4 bg-blue-950 text-white p-4 pr-8 rounded-lg"
              : "mb-4 hover:text-white-600 p-4 rounded-lg"
          }
        >
          <FontAwesomeIcon icon={faUser} className='mr-4'/>
          Profile
        </NavLink>
      ) : (
        // Show Login/Register link if not logged in
        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "mb-4 bg-blue-950 text-white p-4 pr-8 rounded-lg"
              : "mb-4 hover:text-white-600 p-4 rounded-lg"
          }
        >
          <FontAwesomeIcon icon={faLock} className='mr-4'/>
          Register 
        </NavLink>
      )}
    </nav>
  );
};

export default Navbar;
