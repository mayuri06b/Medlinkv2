'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, User } from 'lucide-react';
import DashboardLayout from '@/components/PatientNav/page';

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

const fetchDoctors = async () => {
  try {
    const response = await fetch('/api/fetchDoctors');
    const data = await response.json();
    if (response.ok) {
      return data.doctors;
    } else {
      console.error('Error fetching doctors:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

export default function PatientAppointmentBooking() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [patientId, setPatientId] = useState(''); 
  const temp = localStorage.getItem('patientId');

  useEffect(() => {
    const temp = localStorage.getItem('patientId');
    if (temp) {
      setPatientId(temp);
    }
  }, []);

  useEffect(() => {
    const loadDoctors = async () => {
      const fetchedDoctors = await fetchDoctors();
      setDoctors(fetchedDoctors);
    };
    loadDoctors();
  }, []);

  const handleBookAppointment = async () => {
    if (selectedDoctor && selectedDate && selectedTime && patientId) {
      const appointmentRequest = {
        patientId,
        doctorId: selectedDoctor._id, 
        date: selectedDate,
        time: selectedTime,
      };
      console.log("Appointment Request", appointmentRequest);
      
      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentRequest),
        });

        const data = await response.json();

        if (response.ok) {
          setIsBooked(true);
        } else {
          console.error('Error booking appointment:', data.error);
        }
      } catch (error) {
        console.error('Failed to book appointment:', error);
      }
    }
  };

  return (
    <>
      <DashboardLayout />
      <div className="min-h-screen bg-gray-100 p-4">
        {!isBooked ? (
          <div className="space-y-6">
            {/* Doctor Selection */}
            <div>
              <h2 className="text-xl font-semibold">Select a Doctor</h2>
              <div className="space-y-4">
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <div
                      key={doctor._id}
                      className={`p-4 bg-white rounded-lg shadow cursor-pointer transition-transform ${selectedDoctor?._id === doctor._id ? 'border-2 border-blue-50 scale-105' : 'bg-blue-600'}`}
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <div className="flex items-center">
                        <User className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                          <h3 className="font-semibold">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No doctors available</p>
                )}
              </div>
            </div>

            {/* Date and Time Selection */}
            <div>
              <h2 className="text-xl font-semibold">Choose Date and Time</h2>
              <div className="p-4 bg-white rounded-lg shadow">
                <label className="block mb-2 text-sm font-medium">Select Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded mb-4"
                  value={selectedDate}
                  //is array have that in that slot 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
                {selectedDate && (
                  <div>
                    <label className="block mb-2 text-sm font-medium">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time, index) => (
                        <button
                          key={index}
                          className={`p-2 rounded ${selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="mt-4 w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              onClick={handleBookAppointment}
              disabled={!selectedDoctor || !selectedDate || !selectedTime || !patientId}
            >
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="p-6 bg-white rounded-lg shadow text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Appointment Booked!</h2>
            <p>Your appointment with {selectedDoctor.name} is scheduled for {selectedDate} at {selectedTime}.</p>
            <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={() => setIsBooked(false)}>
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </>
  );
}
