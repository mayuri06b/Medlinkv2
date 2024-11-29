'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/PatientNav/page';

async function fetchPatientData(patientId) {
    try {
        const response = await fetch(`/api/authp/getPrescription?patientId=${patientId}`);
        if (!response.ok) {
            console.error('Error fetching patient data:', await response.json());
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching patient data:', error);
        return null;
    }
}

async function fetchPatientName(patientId) {
    try {
        const response = await fetch(`/api/authp/getPatient?patientId=${patientId}`);
        if (!response.ok) {
            console.error('Error fetching patient name:', await response.json());
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching patient name:', error);
        return null;
    }
}

export default function PatientDashboard() {
    const [patientId, setPatientId] = useState(null);
    const [patientData, setPatientData] = useState(null);
    const [patientName, setPatientName] = useState(null);
    const [loading, setLoading] = useState(true);

    // Retrieve patientId from localStorage on component mount
    useEffect(() => {
        const storedPatientId = localStorage.getItem('patientId');
        if (storedPatientId) {
            setPatientId(storedPatientId);
        } else {
            console.error('Patient ID not found in localStorage');
        }
    }, []);

    // Fetch data once patientId is available
    useEffect(() => {
        const fetchData = async () => {
            if (patientId) {
                const data = await fetchPatientData(patientId);
                const name = await fetchPatientName(patientId);
                setPatientData(data);
                setPatientName(name);
                setLoading(false);
            }
        };

        fetchData();
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <span className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-blue-600 rounded-full"></span>
            </div>
        );
    }

    return (
        <>
            <DashboardLayout />
            <div className="m-7 p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
                {patientData ? (
                    <div className="text-black">
                        <h1 className="text-3xl font-semibold mb-4 text-blue-700">
                            Welcome, {patientName?.name || 'Patient'}
                        </h1>
                        <p className="mb-6 text-lg">Here are your prescriptions:</p>
                        <div className="prescriptions mb-6">
                            <h2 className="text-2xl font-semibold mb-3 text-blue-700">Prescriptions</h2>
                            {patientData.length > 0 ? (
                                patientData.map((prescription, index) => (
                                    <div key={index} className="border-2 p-6 mb-6 rounded-lg shadow-sm bg-blue-50 border-blue-100">
                                        <p className="text-lg mb-2"><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
                                        <p className="text-lg mb-2"><strong>Diagnosis:</strong> {prescription.diagnosis}</p>
                                        <p className="text-lg mb-2"><strong>Allergies:</strong> {prescription.allergies}</p>
                                        <p className="text-lg mb-2"><strong>Condition:</strong> {prescription.condition}</p>
                                        <p className="text-lg mb-2"><strong>Doctor's Signature:</strong> {prescription.signature}</p>
                                        <div className="medications mt-4">
                                            <h3 className="font-semibold text-lg">Medications:</h3>
                                            {prescription.medications?.length > 0 ? (
                                                <ul className="list-inside list-disc ml-6 text-lg">
                                                    {prescription.medications.map((medication, medIndex) => (
                                                        <li key={medIndex}>
                                                            <strong>{medication.drugName}</strong>: {medication.dosageAmount} {medication.dosageUnit} ({medication.frequency})
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="ml-4 text-sm text-gray-600">No medications listed.</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No prescriptions found.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-red-600">No patient data found.</p>
                )}
            </div>
        </>
    );
}
