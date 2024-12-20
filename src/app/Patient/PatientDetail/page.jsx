'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/DoctorNav/page';

function PatientDetailsContent() {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId'); 
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setLoading(false); 
      return;
    }

    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/patients/${patientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPatient(data); 
        } else {
          console.error('Failed to fetch patient data.');
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [patientId]);

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>No patient data found.</div>;

  return (
    <div className="mt-7 patient-detail-container max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 border-b pb-2">Patient Details</h2>
      <div className="text-lg text-gray-700 space-y-2 mb-6">
        <p><strong className="text-gray-800">Name:</strong> {patient.name}</p>
        <p><strong className="text-gray-800">Age:</strong> {patient.age}</p>
        <p><strong className="text-gray-800">Gender:</strong> {patient.gender}</p>
        <p><strong className="text-gray-800">Phone:</strong> {patient.phone}</p>
        <p><strong className="text-gray-800">Email:</strong> {patient.email}</p>
        <p><strong className="text-gray-800">Address:</strong> {patient.address?.street}, {patient.address?.city}, {patient.address?.state} {patient.address?.zip}</p>
        <p><strong className="text-gray-800">Medical History:</strong> {patient.medicalHistory}</p>
      </div>
      <h3 className="text-2xl font-bold text-blue-600 mb-3 border-b pb-2">Prescriptions</h3>
      {patient.prescriptions?.length > 0 ? (
        <ul className="space-y-4">
          {patient.prescriptions.map((prescription) => (
            <li key={prescription._id} className="bg-gray-50 p-4 rounded-md shadow-sm border">
              <p><strong className="text-gray-700">Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
              <p><strong className="text-gray-700">Diagnosis:</strong> {prescription.diagnosis}</p>

              {/* Display Medications */}
              <h4 className="text-lg font-semibold text-gray-800 mt-2">Medications:</h4>
              <ul className="space-y-2">
                {prescription.medications.map((medication, index) => (
                  <li key={index} className="bg-gray-100 p-2 rounded">
                    <p><strong>Drug Name:</strong> {medication.drugName}</p>
                    <p><strong>Dosage:</strong> {medication.dosageAmount} {medication.dosageUnit}</p>
                    <p><strong>Frequency:</strong> {medication.frequency}</p>
                  </li>
                ))}
              </ul>

              <p><strong className="text-gray-700">Allergies:</strong> {prescription.allergies}</p>
              <p><strong className="text-gray-700">Doctor's Signature:</strong> {prescription.signature}</p>
              <p><strong className="text-gray-700">Condition:</strong> {prescription.condition}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 italic">No prescriptions available.</p>
      )}
    </div>
  );
}

export default function PatientDetail() {
  return (
    <>
      <NavBar />
      <Suspense fallback={<div>Loading patient details...</div>}>
        <PatientDetailsContent />
      </Suspense>
    </>
  );
}
