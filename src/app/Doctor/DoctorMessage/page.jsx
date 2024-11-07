'use client'

import React, { useState } from 'react';
import { User, Send, ChevronLeft, Clock, Phone } from 'lucide-react';
import NavBar from '@/components/DoctorNav/page';

const patients = [
  { id: 1, name: "John Doe", age: 45, lastContact: "2 hours ago", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 2, name: "Jane Smith", age: 32, lastContact: "1 day ago", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 3, name: "Mike Johnson", age: 58, lastContact: "3 days ago", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 4, name: "Emily Brown", age: 27, lastContact: "1 week ago", avatar: "/placeholder.svg?height=50&width=50" },
];

const PatientCard = ({ patient, onSelect, isSelected }) => (
  <div 
    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
      isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
    }`}
    onClick={() => onSelect(patient)}
  >
    <img src={patient.avatar} alt={patient.name} className="w-12 h-12 rounded-full mr-4" />
    <div className="flex-grow">
      <h3 className="font-semibold">{patient.name}</h3>
      <p className="text-sm text-gray-600">Age: {patient.age}</p>
    </div>
    <div className="text-xs text-gray-500 flex items-center">
      <Clock size={12} className="mr-1" />
      {patient.lastContact}
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, isDoctor: true }]);
      setInputMessage('');
      // Simulate patient's response
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
                {patients.map(patient => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onSelect={setSelectedPatient}
                    isSelected={selectedPatient && selectedPatient.id === patient.id}
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
                      <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-10 h-10 rounded-full mr-3" />
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