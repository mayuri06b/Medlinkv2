'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, Award, Users, ChevronRight } from 'lucide-react';
import NavBar from '@/components/DoctorNav/page';

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
  const [doctorData, setDoctorData] = useState(null);  // State to store doctor data
  const [loading, setLoading] = useState(true);  // State to handle loading state

  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');  // Fetch doctor ID from localStorage

    if (doctorId) {
      const fetchDoctorData = async () => {
        try {
          const response = await fetch(`/api/doctor/${doctorId}`);
          const data = await response.json();

          if (response.ok) {
            setDoctorData(data);  // Set doctor data from the API response
          } else {
            console.error("Error fetching doctor data:", data.message);
          }
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        } finally {
          setLoading(false);  // Set loading to false once the data is fetched
        }
      };

      fetchDoctorData();
    } else {
      setLoading(false);
    }
  }, []);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no doctor data found
  if (!doctorData) {
    return <div>No doctor data available.</div>;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-48"
                  src={doctorData.image || '/placeholder.svg?height=200&width=200'}
                  alt={doctorData.name}
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {doctorData.specialty || 'Specialty'}
                </div>
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
              <p className="mt-1 text-gray-600">{doctorData.education || 'Not available'}</p>
            </div>
            <div className="px-8 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
              <ul className="mt-1 list-disc list-inside text-gray-600">
                {doctorData.certifications?.length > 0
                  ? doctorData.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))
                  : 'No certifications available'}
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="mr-2" size={24} /> Patients
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {doctorData.patients?.length > 0 ? (
                doctorData.patients.map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))
              ) : (
                <div>No patients available.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
