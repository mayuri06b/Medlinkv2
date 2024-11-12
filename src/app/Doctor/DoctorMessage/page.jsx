'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, ChevronLeft, Phone } from 'lucide-react';
import NavBar from '@/components/DoctorNav/page';
import avatar from '../../../../public/image/img.png'

const PatientCard = ({ patient, onSelect, isSelected }) => (
  <div 
    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
      isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
    }`}
    onClick={() => onSelect(patient)}
  >
    <img src="/" alt={patient.name} className="w-12 h-12 rounded-full mr-4" />
    <div className="flex-grow">
      <h3 className="font-semibold">{patient.name}</h3>
      <p className="text-sm text-gray-600">Age: {patient.age}</p>
    </div>
  </div>
);

const ChatMessage = ({ message, isDoctor }) => (
  <div className={`flex ${isDoctor ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs md:max-w-md ${isDoctor ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
      <p>{message}</p>
    </div>
  </div>
);

export default function DoctorChatInterface() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [patientList, setPatientList] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctorData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found; redirecting to login.');
        router.push('/Doctor/DoctorSignUp');
        return;
      }

      try {
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }

        const data = await response.json();
        setDoctorName(data.name);

        if (data.patients && data.patients.length > 0) {
          await fetchPatientDetails(data.patients, token);
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    const fetchPatientDetails = async (patientIds, token) => {
      try {
        const response = await fetch(`/api/authp/getPatientDetails?ids=${patientIds.join(',')}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient details');
        }

        const patientsData = await response.json();
        setPatientList(patientsData); // Ensures state update after data is fetched
      } catch (error) {
        console.error('Error fetching patient details:', error);
        alert(`Error: ${error.message}`);
      }
    };

    fetchDoctorData();
  }, [router]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, isDoctor: true }]);
      setInputMessage('');
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { 
          text: "Thank you, doctor. I understand your advice.", 
          isDoctor: false 
        }]);
      }, 1000);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 border-r">
                <h2 className="text-xl font-semibold p-4 border-b">Patients</h2>
                <div className="overflow-y-auto h-[calc(100vh-200px)]">
                  {patientList.map(patient => (
                    <PatientCard 
                      key={patient._id}
                      patient={patient} 
                      onSelect={setSelectedPatient}
                      isSelected={selectedPatient && selectedPatient._id === patient._id}
                    />
                  ))}
                </div>
              </div>
              <div className="md:w-2/3">
                {selectedPatient ? (
                  <div className="flex flex-col h-[calc(100vh-200px)]">
                    <div className="bg-gray-100 p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <button 
                          className="md:hidden mr-2 text-gray-600" 
                          onClick={() => setSelectedPatient(null)}
                        >
                          <ChevronLeft />
                        </button>
                        <img src={selectedPatient.avatar || "/placeholder.svg"} alt={selectedPatient.name} className="w-10 h-10 rounded-full mr-3" />
                        <div>
                          <h3 className="font-semibold">{selectedPatient.name}</h3>
                          <p className="text-sm text-gray-600">Age: {selectedPatient.age}</p>
                        </div>
                      </div>
                      <button className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
                        <Phone size={16} className="mr-1" />
                        Call
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {messages.map((message, index) => (
                        <ChatMessage key={index} message={message.text} isDoctor={message.isDoctor} />
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="border-t p-4 flex">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Send size={20} />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <p className="text-gray-500">Select a patient to start chatting</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
