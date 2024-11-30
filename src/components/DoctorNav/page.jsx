import React, { useState } from 'react';
import Image from 'next/image';
import { User, MessageSquare, Calendar, Zap, UserCircle, Menu } from 'lucide-react';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white p-4 text-blue-600 shadow-lg max-w-full">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center">
          <Image 
            src="/image/v.png" 
            alt="Logo" 
            width={150} 
            height={60} 
            className="w-[150px] h-[60px] object-contain"
          />
        </div>

        {/* Hamburger Button for Mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md focus:outline-none hover:bg-blue-100"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Nav Items */}
        <div
          className={`lg:flex items-center space-x-6 transition-all duration-300 ease-in-out ${isMenuOpen ? "block" : "hidden"} lg:block lg:static w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none`}
        >
          <NavItem href="/Doctor/DoctorLanding" icon={<User size={20} />} label="Patients" />
          <NavItem href="/Doctor/DoctorMessage" icon={<MessageSquare size={20} />} label="Messages" />
          <NavItem href="/Doctor/Appointments" icon={<Calendar size={20} />} label="Appointments" />
          <NavItem href="/Doctor/AIinsight" icon={<Zap size={20} />} label="AI Insights" />
          <NavItem href="/Doctor/DoctorProfile" icon={<UserCircle size={24} />} label="Profile" />
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
