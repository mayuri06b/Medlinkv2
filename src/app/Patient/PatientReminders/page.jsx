'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Pill, X } from 'lucide-react';
import DashboardLayout from '@/components/PatientNav/page';

// Function to fetch patient prescriptions
async function fetchPatientData(patientId) {
    try {
        const response = await fetch(`/api/authp/getPrescription?patientId=${patientId}`, {
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
        return patientData;
    } catch (error) {
        console.error('Error fetching patient data:', error);
        return null;
    }
}

// Function to generate medication reminders
function generateMedicationReminders(prescriptions) {
    let reminders = [];

    prescriptions.forEach((prescription) => {
        const { medications, date, diagnosis, allergies, condition, signature } = prescription;

        medications.forEach((medication) => {
            const { drugName, dosageAmount, dosageUnit, frequency } = medication;

            // Logic to generate reminders based on frequency
            let currentDate = new Date(date);
            const timesPerDay = frequency === 'Once' ? 1 : frequency === 'Twice' ? 2 : frequency === 'Three times' ? 3 : 1; // Once, Twice, or Three times a day

            // Generate reminders for the required times per day
            for (let i = 0; i < timesPerDay; i++) {
                const reminderTime = new Date(currentDate);
                reminderTime.setHours(8 + i * 6); // Set reminder time based on frequency (e.g., 8 AM, 2 PM)

                // Create a unique reminder ID to avoid duplicates
                const reminderId = `${drugName}-${reminderTime.toISOString()}`;

                // Ensure no duplicate reminders are created for the same medication and time
                if (!reminders.some(r => r.id === reminderId)) {
                    reminders.push({
                        id: reminderId,
                        title: `Take ${drugName}`,
                        description: `${dosageAmount} ${dosageUnit}`,
                        time: reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: reminderTime.toLocaleDateString(),
                        diagnosis,
                        allergies,
                        condition,
                        signature,
                    });
                }
            }

            // Move to the next day after generating reminders
            currentDate.setDate(currentDate.getDate() + 1);
        });
    });

    return reminders;
}

// ReminderCard Component to display individual reminder
const ReminderCard = ({ reminder, onDismiss }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start">
                    <div className="mr-3">
                        <Pill className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{reminder.title}</h3>
                        <p className="text-sm text-gray-600">{reminder.description}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {reminder.time}
                            <Calendar className="w-4 h-4 ml-3 mr-1" />
                            {reminder.date}
                        </div>
                    </div>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-gray-500 hover:text-gray-700 mr-2"
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={() => onDismiss(reminder.id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-3 text-sm text-gray-600">
                    <p>Diagnosis: {reminder.diagnosis}</p>
                    <p>Allergies: {reminder.allergies}</p>
                    <p>Condition: {reminder.condition}</p>
                    <p>Doctor's Signature: {reminder.signature}</p>
                </div>
            )}
        </div>
    );
};

export default function PatientReminders() {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientId, setPatientId] = useState(null);

    // Fetch the patient data from localStorage or URL
    useEffect(() => {
        const storedPatientId = localStorage.getItem('patientId');
        if (storedPatientId) {
            setPatientId(storedPatientId);
        } else {
            const searchParams = new URLSearchParams(window.location.search);
            const patientIdFromUrl = searchParams.get('patientId');
            if (patientIdFromUrl) {
                localStorage.setItem('patientId', patientIdFromUrl);
                setPatientId(patientIdFromUrl);
            } else {
                console.error("Patient ID not found in URL or localStorage.");
            }
        }
    }, []);

    useEffect(() => {
        const getPatientData = async () => {
            if (patientId) {
                const data = await fetchPatientData(patientId);
                if (data) {
                    const medicationReminders = generateMedicationReminders(data || []);
                    setReminders(medicationReminders);
                }
                setLoading(false);
            } else {
                setLoading(false);
                console.error("Patient ID is missing.");
            }
        };

        if (patientId) {
            getPatientData();
        }
    }, [patientId]);

    const handleDismiss = (id) => {
        setReminders(reminders.filter(reminder => reminder.id !== id));
    };

    return (
        <>
            <DashboardLayout />
            <div className="min-h-screen bg-gray-100">
                <main className="container mx-auto p-4">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Today's Reminders</h2>
                        {loading ? (
                            <p>Loading reminders...</p>
                        ) : (
                            reminders.filter(r => r.date === new Date().toLocaleDateString()).map(reminder => (
                                <ReminderCard key={reminder.id} reminder={reminder} onDismiss={handleDismiss} />
                            ))
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Upcoming Reminders</h2>
                        {reminders.filter(r => r.date !== new Date().toLocaleDateString()).map(reminder => (
                            <ReminderCard key={reminder.id} reminder={reminder} onDismiss={handleDismiss} />
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
