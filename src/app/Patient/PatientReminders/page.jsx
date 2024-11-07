'use client'

import React, { useState } from 'react';
import { Bell, Calendar, Clock, Pill, ChevronDown, ChevronUp, X } from 'lucide-react';
import DashboardLayout from '@/components/PatientNav/page';

const reminderData = [
  {
    id: 1,
    type: 'medication',
    title: 'Take Lisinopril',
    description: '10mg, 1 tablet',
    time: '08:00 AM',
    date: '2023-05-20',
  },
  {
    id: 2,
    type: 'appointment',
    title: 'Dr. Emily Brown',
    description: 'Annual Check-up',
    time: '10:00 AM',
    date: '2023-05-22',
  },
  {
    id: 3,
    type: 'medication',
    title: 'Take Metformin',
    description: '500mg, 1 tablet',
    time: '01:00 PM',
    date: '2023-05-20',
  },
  {
    id: 4,
    type: 'notification',
    title: 'Lab Results Available',
    description: 'Your recent blood work results are ready',
    time: '11:30 AM',
    date: '2023-05-19',
  },
  {
    id: 5,
    type: 'medication',
    title: 'Take Aspirin',
    description: '81mg, 1 tablet',
    time: '09:00 PM',
    date: '2023-05-20',
  },
];

const ReminderCard = ({ reminder, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (reminder.type) {
      case 'medication':
        return <Pill className="w-6 h-6 text-blue-500" />;
      case 'appointment':
        return <Calendar className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="mr-3">{getIcon()}</div>
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
          <p>Additional details about this reminder could be displayed here.</p>
          <p>For medications: dosage instructions, side effects, etc.</p>
          <p>For appointments: preparation instructions, location details, etc.</p>
        </div>
      )}
    </div>
  );
};

export default function PatientReminders() {
  const [reminders, setReminders] = useState(reminderData);

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
          {reminders.filter(r => r.date === '2023-05-20').map(reminder => (
            <ReminderCard key={reminder.id} reminder={reminder} onDismiss={handleDismiss} />
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Upcoming Reminders</h2>
          {reminders.filter(r => r.date !== '2023-05-20').map(reminder => (
            <ReminderCard key={reminder.id} reminder={reminder} onDismiss={handleDismiss} />
          ))}
        </div>
      </main>
    </div>
    </>
  );
}