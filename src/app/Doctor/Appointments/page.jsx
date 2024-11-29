'use client';

import React, { useState, useEffect } from 'react';
import NavBar from '@/components/DoctorNav/page';

const ReminderCard = ({ reminder, onAccept, onReschedule }) => {
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{reminder.patientName}</h3>
        <span className="text-sm font-medium text-blue-600">
          {reminder.time}
        </span>
      </div>
      <div className="text-sm text-gray-700 mb-4">
        <span className="block">{formatDate(reminder.date)}</span>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => onAccept(reminder.id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition focus:ring focus:ring-green-300">
          Accept
        </button>
        <button
          onClick={() => onReschedule(reminder.id)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition focus:ring focus:ring-yellow-300">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default function DoctorReminderPage() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAppointments = async () => {
      const doctorId = localStorage.getItem('doctorId'); 
      if (!doctorId) {
        console.error('Doctor ID not found in local storage');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/getAppointmentDetails?doctorId=${doctorId}`);
        const data = await response.json();

        if (response.ok) {
          console.log('Fetched appointments:', data.appointments);
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

  const handleAccept = async (appointmentId) => {
    if (!appointmentId) {
      console.error('Invalid appointmentId:', appointmentId);
      alert('Invalid appointment ID. Please try again.');
      return;
    }

    try {
      console.log('Sending appointmentId:', appointmentId);

      const response = await fetch(`/api/auth/acceptAppointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId }),
      });

      if (response.ok) {
        alert('Appointment accepted successfully!');
        setReminders((prev) => prev.filter((reminder) => reminder.id !== appointmentId));
      } else {
        const error = await response.json();
        console.error('Failed to accept appointment:', error);
        alert(`Failed to accept appointment: ${error.message}`);
      }
    } catch (error) {
      console.error('Error accepting appointment:', error);
    }
  };

  const handleReschedule = (appointmentId) => {
    if (!appointmentId) {
      alert('Invalid appointment ID for rescheduling.');
      return;
    }
    alert(`Request to reschedule appointment ${appointmentId} submitted!`);
  };

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
              <ReminderCard
                key={reminder.id || index} 
                reminder={reminder} 
                onAccept={handleAccept}
                onReschedule={handleReschedule}
              />
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
