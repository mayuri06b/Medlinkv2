'use client'

import Image from 'next/image';
import Link from 'next/link'; 

export default function Navheader() {
    return(
        <>
        <header className="bg-white shadow-md pl-4 pr-4">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src="/image/logo.png"
              alt="MedLink Logo"
              width={200}
              height={100}
            />
          </div>
          <nav>
            <ul className="flex space-x-8 text-blue-600">
              <li>
                <Link href="/" className="hover:text-blue-800 text-lg font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/Navbar/About" className="hover:text-blue-800 text-lg font-medium transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/Navbar/Contact" className="hover:text-blue-800 text-lg font-medium transition-colors">
                Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
        </>
    );
}