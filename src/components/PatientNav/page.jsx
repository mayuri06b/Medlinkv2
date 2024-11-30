import React from 'react';
import Image from 'next/image';
import { Clipboard, Bell, MessageSquare, Calendar, UserCircle } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="bg-white p-4 text-blue-600 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Image src="/image/logo.png" alt="Logo" width={180} height={70} />
        </div>
        <div className="flex space-x-6 items-center">
          <NavItem href="/Patient/PatientLanding" icon={<Clipboard size={20} />} label="Prescriptions" />
          <NavItem href="/Patient/PatientReminders" icon={<Bell size={20} />} label="Reminders" />
          <NavItem href="/Patient/PatientMessage" icon={<MessageSquare size={20} />} label="Messages" />
          <NavItem href="/Patient/BookAppointment" icon={<Calendar size={20} />} label="Appointments" />
          {/* <NavItem href="/Patient/PatientProfile" icon={<UserCircle size={24} />} label="Profile" /> */}
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
