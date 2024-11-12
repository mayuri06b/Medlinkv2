'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/DoctorNav/page';

const ReminderCard = ({ reminder }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">{reminder.patientName}</h3>
    <div className="text-sm text-gray-500">
      <span>{reminder.date}</span> | <span>{reminder.time}</span>
    </div>
  </div>
);

export default function DoctorReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorId = localStorage.getItem('doctorId'); // Get doctorId from local storage

      if (!doctorId) {
        console.error('Doctor ID not found in local storage');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/getAppointmentDetails?doctorId=${doctorId}`);
        const data = await response.json();

        if (response.ok) {
          setReminders(data.appointments);
        } else {
          console.error('Failed to fetch appointments:', data.error);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Patient Reminders</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reminders.map((reminder, index) => (
              <ReminderCard key={index} reminder={reminder} />
            ))}
          </div>
          {reminders.length === 0 && (
            <p className="text-center text-gray-500">No Appointments at the moment.</p>
          )}
        </main>
      </div>
    </>
  );
}
