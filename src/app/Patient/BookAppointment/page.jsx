'use client'

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, User } from 'lucide-react';
import DashboardLayout from '@/components/PatientNav/page';

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

// Fetch doctors from the API
const fetchDoctors = async () => {
  try {
    const response = await fetch('/api/fetchDoctors');
    const data = await response.json();
    if (response.ok) {
      return data.doctors; // Return the list of doctors
    } else {
      console.error('Error fetching doctors:', data.error);
      return []; // Return an empty array if there's an error
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return []; // Return an empty array if there's a fetch error
  }
};

const DoctorCard = ({ doctor, onSelect, isSelected }) => (
  <div 
    className={`bg-white p-4 rounded-lg shadow-md cursor-pointer transition-colors ${isSelected ? 'border-2 border-blue-500' : 'hover:bg-gray-50'}`}
    onClick={() => onSelect(doctor)} // Select the doctor when clicked
  >
    <div className="flex items-center">
      <User className="w-8 h-8 text-blue-500 mr-3" />
      <div>
        <h3 className="font-semibold">{doctor.name}</h3>
        <p className="text-sm text-gray-600">{doctor.specialty}</p>
      </div>
    </div>
  </div>
);

// Send appointment request to API
async function sendAppointmentRequest(patientId, doctorId, date, time) {
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        doctorId,
        date,
        time,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error('Error:', result.error);
      return null;
    }

    console.log('Appointment request sent successfully:', result);
    return result.appointment;
  } catch (error) {
    console.error('Failed to send appointment request:', error);
    return null;
  }
}

export default function PatientAppointmentBooking() {
  const [doctors, setDoctors] = useState([]); // State to hold the doctors list
  const [selectedDoctor, setSelectedDoctor] = useState(null); // State to hold the selected doctor
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  // Fetch doctors when the component mounts
  useEffect(() => {
    const loadDoctors = async () => {
      const fetchedDoctors = await fetchDoctors();
      setDoctors(fetchedDoctors);
    };

    loadDoctors();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime('');
  };

  const handleBookAppointment = async () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      // You need to pass patientId, which could come from your session or context
      const patientId = 'patient-id'; // Replace with actual patient ID
      const appointment = await sendAppointmentRequest(patientId, selectedDoctor.id, selectedDate, selectedTime);
      if (appointment) {
        setIsBooked(true);
      }
    }
  };

  return (
    <>
      <DashboardLayout />
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto p-4">
          {!isBooked ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Select a Doctor</h2>
                <div className="space-y-4">
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <DoctorCard 
                        key={doctor.id} 
                        doctor={doctor} 
                        onSelect={setSelectedDoctor} // Updates the selected doctor state
                        isSelected={selectedDoctor && selectedDoctor.id === doctor.id} // Marks the selected doctor
                      />
                    ))
                  ) : (
                    <p>No doctors available</p>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Choose Date and Time</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        id="date"
                        className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time, index) => (
                          <button
                            key={index}
                            className={`p-2 rounded-md text-sm ${selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                            onClick={() => setSelectedTime(time)} // Set the selected time
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    className={`mt-6 w-full py-2 px-4 rounded-md text-white font-medium ${
                      selectedDoctor && selectedDate && selectedTime
                        ? 'bg-blue-500 hover:bg-blue-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    onClick={handleBookAppointment}
                    disabled={!selectedDoctor || !selectedDate || !selectedTime}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Appointment Booked!</h2>
              <p className="text-gray-600">
                Your appointment with {selectedDoctor.name} is scheduled for {selectedDate} at {selectedTime}.
              </p>
              <button
                className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setIsBooked(false)}
              >
                Book Another Appointment
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
