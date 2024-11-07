import React from 'react';
import { User, MessageSquare, Calendar, Zap, UserCircle } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">MediCare</h1>
        <div className="flex space-x-6 items-center">
          <NavItem href="/Doctor/DoctorLanding" icon={<User size={20} />} label="Patients" />
          <NavItem href="/Doctor/DoctorMessage" icon={<MessageSquare size={20} />} label="Messages" />
          <NavItem href="/Doctor/Appointments" icon={<Calendar size={20} />} label="Appointments"/>
          <NavItem href="/Doctor/AIinsight" icon={<Zap size={20} />} label="AI Insights" />
          <NavItem href="/Doctor/DoctorProfile" icon={<UserCircle size={24} />} label="Profile"/>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ href, icon, label }) => (
  <a
    href={href}
    className="flex items-center space-x-2 px-3 py-2 rounded-md transition duration-200 hover:bg-blue-500 hover:text-white"
  >
    {icon}
    <span className="font-medium">{label}</span>
  </a>
);

export default NavBar;
