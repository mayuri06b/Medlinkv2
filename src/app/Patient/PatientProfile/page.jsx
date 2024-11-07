'use client';

import React from 'react';
import { User, Phone, Mail, Calendar, Activity, Pill, FileText, Clock } from 'lucide-react';
import DashboardLayout from '@/components/PatientNav/page';

const patientData = {
  id: 1,
  name: "Sarah Johnson",
  age: 35,
  gender: "Female",
  phone: "+1 (555) 123-4567",
  email: "sarah.johnson@example.com",
  address: "123 Main St, Anytown, USA 12345",
  bloodType: "A+",
  height: "5'6\"",
  weight: "140 lbs",
  allergies: ["Penicillin", "Peanuts"],
  medicalHistory: [
    { condition: "Asthma", diagnosedYear: 2010 },
    { condition: "Hypertension", diagnosedYear: 2018 }
  ],
  currentMedications: [
    { name: "Albuterol", dosage: "2 puffs as needed" },
    { name: "Lisinopril", dosage: "10mg daily" }
  ],
  upcomingAppointments: [
    { date: "2023-06-15", time: "10:00 AM", doctor: "Dr. Emily Brown", type: "Annual Check-up" },
    { date: "2023-07-02", time: "2:30 PM", doctor: "Dr. Michael Lee", type: "Cardiology Follow-up" }
  ]
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center mb-2">
    {icon}
    <span className="font-semibold mr-2">{label}:</span>
    <span>{value}</span>
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-xl font-semibold mb-3 mt-6 border-b pb-2">{children}</h2>
);

export default function PatientProfile() {
  return (
    <>
    <DashboardLayout />
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-50 p-8">
              <div className="text-center mb-4">
                <div className="w-32 h-32 rounded-full bg-blue-200 mx-auto mb-4 flex items-center justify-center">
                  <User size={64} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold">{patientData.name}</h2>
                <p className="text-gray-600">Patient ID: {patientData.id}</p>
              </div>
              <div className="mt-6">
                <InfoItem icon={<User className="mr-2" />} label="Age" value={patientData.age} />
                <InfoItem icon={<User className="mr-2" />} label="Gender" value={patientData.gender} />
                <InfoItem icon={<Phone className="mr-2" />} label="Phone" value={patientData.phone} />
                <InfoItem icon={<Mail className="mr-2" />} label="Email" value={patientData.email} />
                <InfoItem icon={<FileText className="mr-2" />} label="Address" value={patientData.address} />
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <SectionTitle>Basic Health Information</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem icon={<Activity className="mr-2" />} label="Blood Type" value={patientData.bloodType} />
                <InfoItem icon={<Activity className="mr-2" />} label="Height" value={patientData.height} />
                <InfoItem icon={<Activity className="mr-2" />} label="Weight" value={patientData.weight} />
              </div>

              <SectionTitle>Allergies</SectionTitle>
              <ul className="list-disc list-inside mb-4">
                {patientData.allergies.map((allergy, index) => (
                  <li key={index} className="mb-1">{allergy}</li>
                ))}
              </ul>

              <SectionTitle>Medical History</SectionTitle>
              <ul className="mb-4">
                {patientData.medicalHistory.map((item, index) => (
                  <li key={index} className="mb-1">
                    {item.condition} (Diagnosed in {item.diagnosedYear})
                  </li>
                ))}
              </ul>

              <SectionTitle>Current Medications</SectionTitle>
              <ul className="mb-4">
                {patientData.currentMedications.map((med, index) => (
                  <li key={index} className="mb-2 flex items-start">
                    <Pill className="mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-semibold">{med.name}</span> - {med.dosage}
                    </div>
                  </li>
                ))}
              </ul>

              <SectionTitle>Upcoming Appointments</SectionTitle>
              <ul className="mb-4">
                {patientData.upcomingAppointments.map((appointment, index) => (
                  <li key={index} className="mb-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Calendar className="mr-2" />
                      <span className="font-semibold">{appointment.date}</span>
                      <Clock className="ml-4 mr-2" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="ml-6">
                      <p><span className="font-semibold">Doctor:</span> {appointment.doctor}</p>
                      <p><span className="font-semibold">Type:</span> {appointment.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}