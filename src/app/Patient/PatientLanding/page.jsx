'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/PatientNav/page';

async function fetchPatientData(patientId) {
    try {
        const response = await fetch(`/api/authp/getPatient?patientId=${patientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching patient data:', errorData.message);
            return null;
        }
        const patientData = await response.json();
        console.log('Fetched patient data:', patientData);
        return patientData;
    } catch (error) {
        console.error('Error fetching patient data:', error);
        return null;
    }
}

export default function PatientDashboard() {
    const searchParams = useSearchParams(); // Get query parameters
    const patientId = searchParams.get('patientId'); // Extract the patientId
    const [patientData, setPatientData] = useState(null); // Store patient data
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const getPatientData = async () => {
            if (patientId) {
                const data = await fetchPatientData(patientId); // Fetch patient data
                setPatientData(data); 
            } else {
                console.error("Patient ID not found in URL");
            }
            setLoading(false); 
        };

        
        if (patientId) {
            getPatientData();
        } else {
            setLoading(false); 
        }
    }, [patientId]); 

    return (
        <>
            <DashboardLayout />
            <div className="patient-dashboard-container">
                {loading ? (
                    <p>Loading patient data...</p> // Show loading message
                ) : patientData ? (
                    <div className='text-black'>
                        <h1 className="text-2xl font-semibold mb-4">Patient Dashboard</h1>
                        <div className="patient-info mb-6">
                            <p><strong>Patient ID:</strong> {patientData._id}</p>
                            <p><strong>Name:</strong> {patientData.name}</p>
                            <p><strong>Email:</strong> {patientData.email}</p>
                            <p><strong>Age:</strong> {patientData.age}</p>
                        </div>
                        {/* Display additional patient details if needed */}
                    </div>
                ) : (
                    <p>No patient data found.</p> // Show message if patient data is not available
                )}
            </div>
        </>
    );
}
