import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Home, MessageSquare, User, Calendar, CheckSquare, Settings, Lock, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center w-full px-4 py-3 mb-2 rounded-lg transition-all duration-200 ease-in-out ${
          isActive
            ? "bg-blue-950 text-white shadow-lg"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-950"
        }`
      }
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{children}</span>
    </NavLink>
  );

  return (
    <div className="flex min-h-screen">
      <nav className="bg-white border-r border-gray-200 w-64 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <img 
            src="/images/1-nobg1.png" 
            alt="logo" 
            className="h-12 w-auto mx-auto"
            onClick={() => navigate('/')}
          />
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavItem to="/home" icon={Home}>Home</NavItem>
          <NavItem to="/reminders" icon={CheckSquare}>Reminders</NavItem>
          <NavItem to="/messages" icon={MessageSquare}>Messages</NavItem>
          <NavItem to="/appointment" icon={Calendar}>Appointment</NavItem>
          <NavItem to="/history" icon={Clock}>History</NavItem>
          
          {isLoggedIn ? (
            <NavItem to="/profile" icon={User}>Profile</NavItem>
          ) : (
            <NavItem to="/login" icon={Lock}>Register</NavItem>
          )}
        </div>

        {isLoggedIn && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-950" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="flex-1">
        {/* Main content area */}
      </div>
    </div>
  );
};

export default Navbar;