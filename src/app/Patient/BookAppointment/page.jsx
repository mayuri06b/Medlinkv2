'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, User } from 'lucide-react';
import DashboardLayout from '@/components/PatientNav/page';

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

// Fetch Doctors
const fetchDoctors = async () => {
  try {
    const response = await fetch('/api/auth/fetchDoctors');
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

// Fetch Booked Appointments
const fetchAppointments = async (patientId) => {
  try {
    const response = await fetch(`/api/authp/putAppointments?patientId=${patientId}`);
    const data = await response.json();
    if (response.ok) {
      return data.appointments;
    } else {
      console.error('Error fetching appointments:', data.error);
      return [];
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
};

export default function PatientAppointmentBooking() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [viewBooked, setViewBooked] = useState(false);
  const [showMore, setShowMore] = useState(false);  // State to toggle show more functionality

  // Get Patient ID from localStorage
  useEffect(() => {
    const temp = localStorage.getItem('patientId');
    if (temp) {
      setPatientId(temp);
    }
  }, []);

  // Fetch doctors and appointments on load
  useEffect(() => {
    const loadDoctors = async () => {
      const fetchedDoctors = await fetchDoctors();
      setDoctors(fetchedDoctors);
    };
    loadDoctors();
  }, []);

  // Fetch appointments when viewBooked is true
  useEffect(() => {
    if (viewBooked && patientId) {
      const loadAppointments = async () => {
        const fetchedAppointments = await fetchAppointments(patientId);
        setAppointments(fetchedAppointments);
      };
      loadAppointments();
    }
  }, [viewBooked, patientId]);

  // Handle Appointment Booking
  const handleBookAppointment = async () => {
    if (selectedDoctor && selectedDate && selectedTime && patientId) {
      const appointmentRequest = {
        patientId,
        doctorId: selectedDoctor._id,
        date: selectedDate,
        time: selectedTime,
      };

      try {
        const response = await fetch('/api/authp/putAppointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

  // Group doctors by specialty
  const groupedDoctors = doctors.reduce((acc, doctor) => {
    const specialty = doctor.specialty || 'Uncategorized';
    if (!acc[specialty]) {
      acc[specialty] = [];
    }
    acc[specialty].push(doctor);
    return acc;
  }, {});

  return (
    <>
      <DashboardLayout />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Appointment Booking</h2>
          <button
            onClick={() => setViewBooked(!viewBooked)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {viewBooked ? 'View Available Appointments' : 'View Booked Appointments'}
          </button>
        </div>

        {!isBooked ? (
          // Appointment Booking Form
          <div className="space-y-6">
            {/* Doctor Selection */}
            {!viewBooked && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Select a Doctor</h3>
                {Object.keys(groupedDoctors).map((specialty) => (
                  <div key={specialty} className="space-y-6 mb-8">
                    <h4 className="text-xl font-semibold text-blue-700">{specialty}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedDoctors[specialty].slice(0, showMore ? groupedDoctors[specialty].length : 3).map((doctor) => (
                        <div
                          key={doctor._id}
                          className={`p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all transform hover:scale-105 ${selectedDoctor?._id === doctor._id ? 'border-2 border-blue-500' : ''}`}
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          <div className="flex items-center">
                            <User className="w-10 h-10 text-blue-600 mr-4" />
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialty}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {groupedDoctors[specialty].length > 3 && (
                      <div className="text-center mt-4">
                        <button
                          onClick={() => setShowMore(!showMore)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                        >
                          {showMore ? 'Show Less' : 'Show More'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Date and Time Selection */}
            {!viewBooked && selectedDoctor && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Choose Date and Time</h3>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <label className="block mb-2 text-sm font-medium text-gray-600">Select Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border rounded-md mb-4 text-gray-700"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {selectedDate && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-600">Select Time</label>
                      <div className="grid grid-cols-3 gap-4">
                        {timeSlots.map((time, index) => (
                          <button
                            key={index}
                            className={`p-3 rounded-md text-sm font-medium transition-all duration-300 ${selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
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
            )}

            {/* Book Appointment Button */}
            {!viewBooked && (
              <button
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 transition-all duration-300"
                onClick={handleBookAppointment}
                disabled={!selectedDoctor || !selectedDate || !selectedTime || !patientId}
              >
                Book Appointment
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Appointment Booked!</h2>
            <p className="text-lg text-gray-700 mb-4">
              Your appointment with <strong>{selectedDoctor.name}</strong> is scheduled for {selectedDate} at {selectedTime}.
            </p>
            <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg" onClick={() => setIsBooked(false)}>
              Book Another Appointment
            </button>
          </div>
        )}

        {/* View Booked Appointments */}
        {viewBooked && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Booked Appointments</h3>
            {appointments.length > 0 ? (
              <div className="space-y-6">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="p-4 bg-white rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-gray-800">{appointment.doctor.name}</h4>
                    <p className="text-sm text-gray-600">Date: {appointment.date}</p>
                    <p className="text-sm text-gray-600">Time: {appointment.time}</p>
                    <p className="text-sm text-gray-600">Status: {appointment.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No booked appointments found.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
