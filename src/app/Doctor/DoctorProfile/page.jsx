'use client';

import React from 'react';
import { Mail, Phone, Award, Users, ChevronRight } from 'lucide-react';
import NavBar from '@/components/DoctorNav/page';

const doctorData = {
  id: 1,
  name: "Dr. Emily Johnson",
  image: "/placeholder.svg?height=200&width=200",
  email: "emily.johnson@example.com",
  phone: "+1 (555) 123-4567",
  specialty: "Cardiologist",
  experience: "15 years",
  education: "MD from Harvard Medical School",
  certifications: ["American Board of Internal Medicine", "Cardiovascular Disease"],
  patients: [
    { id: 1, name: "John Doe", age: 45, lastVisit: "2023-05-01" },
    { id: 2, name: "Jane Smith", age: 32, lastVisit: "2023-05-10" },
    { id: 3, name: "Mike Brown", age: 58, lastVisit: "2023-04-28" },
    { id: 4, name: "Sarah Davis", age: 29, lastVisit: "2023-05-15" },
  ]
};

const PatientCard = ({ patient }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
    <div>
      <h3 className="font-semibold">{patient.name}</h3>
      <p className="text-sm text-gray-600">Age: {patient.age}</p>
      <p className="text-sm text-gray-600">Last Visit: {patient.lastVisit}</p>
    </div>
    <ChevronRight className="text-gray-400" />
  </div>
);

export default function DoctorProfilePage() {
  return (
    <>
    <NavBar />
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img className="h-48 w-full object-cover md:w-48" src={doctorData.image} alt={doctorData.name} />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{doctorData.specialty}</div>
              <h2 className="mt-1 text-2xl font-semibold text-gray-900">{doctorData.name}</h2>
              <div className="mt-2 text-gray-600">
                <p className="flex items-center"><Mail className="mr-2" size={18} /> {doctorData.email}</p>
                <p className="flex items-center mt-1"><Phone className="mr-2" size={18} /> {doctorData.phone}</p>
                <p className="flex items-center mt-1"><Award className="mr-2" size={18} /> {doctorData.experience} of experience</p>
              </div>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
            <p className="mt-1 text-gray-600">{doctorData.education}</p>
          </div>
          <div className="px-8 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
            <ul className="mt-1 list-disc list-inside text-gray-600">
              {doctorData.certifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="mr-2" size={24} /> Patients
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {doctorData.patients.map(patient => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}