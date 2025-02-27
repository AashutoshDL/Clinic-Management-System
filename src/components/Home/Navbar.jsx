import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Home,
  MessageSquare,
  User,
  Calendar,
  // CheckSquare,
  // Settings,
  // Lock,
  ClipboardPlus,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();


  const userRoles = Array.isArray(role) ? role : [];

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
            className="h-12 w-auto mx-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavItem to="/home" icon={Home}>
            Home
          </NavItem>

          {userRoles.includes("superadmin") ? (
            <>
              <NavItem to="/manageAdmins" icon={Users}>
                Admins
              </NavItem>
              <NavItem to="/manageDoctors" icon={User}>
                Doctors
              </NavItem>
              <NavItem to="/managePatients" icon={User}>
                Patients
              </NavItem>
              <NavItem to="/manageAppointments" icon={Calendar}>
                Appointments
              </NavItem>
              <NavItem to="/manageReports" icon={FileText}>
                Reports
              </NavItem>
            </>
          ) : (
            <>
              <NavItem to="/reports" icon={ClipboardPlus}>
                Reports
              </NavItem>
              <NavItem to="/messages" icon={MessageSquare}>
                Messages
              </NavItem>
              <NavItem to="/appointment" icon={Calendar}>
                Appointment
              </NavItem>
              <NavItem to="/history" icon={Clock}>
                History
              </NavItem>
            </>
          )}
        </div>

        {/* <div className="mt-auto px-4 py-6">
          {isLoggedIn ? (
            <NavItem to="/profile" icon={User}>
              Profile
            </NavItem>
          ) : (
            <NavItem to="/login" icon={Lock}>
              Register
            </NavItem>
          )}
        </div> */}
      </nav>
      <div className="flex-1"></div>
    </div>
  );
};

export default Navbar;
