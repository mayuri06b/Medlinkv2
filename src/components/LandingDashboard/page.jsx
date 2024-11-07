'use client'
import Image from 'next/image';
import Link from 'next/link'; 
import { Button } from "@/components/ui/button"; 
import Navheader from '../Navheader/page';

export default function LandingDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navheader />
      {/* Main Dashboard */}
      <main className="container mx-auto ml-4 px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left side: Text and Buttons */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-4xl lg:text-5xl font-bold text-blue-800 mb-6 leading-tight">
              Revolutionizing Healthcare with Cloud Technology
            </h2>
            <p className="text-xl text-blue-600 mb-8">
              MedLink is a cutting-edge, cloud-based platform that connects patients with healthcare providers seamlessly. Experience the future of digital healthcare today.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
              <Link href="/Doctor/DoctorSignUp">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105">
                Doctor Sign Up
              </Button>
              </Link>
              <Link href="/Patient/PatientSignUp">
              <Button className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105">
                Patient Sign Up
              </Button>
              </Link>
            </div>
          </div>

          {/* Right side: Image */}
          <div className="mr-6 lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-square">
              <Image
                src="/image/landing_illustration.jpg"
                alt="MedLink Platform Illustration"
                layout="fill"
                objectFit="contain"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
