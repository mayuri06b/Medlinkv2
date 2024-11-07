'use client'
import React, { useState } from 'react';
import NavBar from '@/components/DoctorNav/page';

//Sample Data is added for instance 
const reminderData = [
  { id: 1, patientName: "John Doe", message: "Please review my latest test results", date: "2023-05-10", time: "14:30" },
  { id: 2, patientName: "Jane Smith", message: "Need to reschedule my appointment", date: "2023-05-11", time: "09:15" },
  { id: 3, patientName: "Mike Johnson", message: "Question about my prescription", date: "2023-05-11", time: "11:45" },
  { id: 4, patientName: "Emily Brown", message: "Follow-up on my last visit", date: "2023-05-12", time: "16:00" },
];

const ReminderCard = ({ reminder }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">{reminder.patientName}</h3>
    <p className="text-gray-600 mb-2">{reminder.message}</p>
    <div className="text-sm text-gray-500">
      <span>{reminder.date}</span> | <span>{reminder.time}</span>
    </div>
  </div>
);

export default function DoctorReminderPage() {
  const [reminders, setReminders] = useState(reminderData);

  return (
    <>
    <NavBar />
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">Patient Reminders</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reminders.map(reminder => (
            <ReminderCard key={reminder.id} reminder={reminder} />
          ))}
        </div>
        {reminders.length === 0 && (
          <p className="text-center text-gray-500">No reminders at the moment.</p>
        )}
      </main>
    </div>
    </>
  );
}