'use client'
import React, { useState } from 'react';
import { User, Send, ChevronLeft } from 'lucide-react';
import NavBar from '@/components/DoctorNav/page';
import DashboardLayout from '@/components/PatientNav/page';

const doctors = [
  { id: 1, name: "Dr. Emily Johnson", specialty: "Cardiologist", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 2, name: "Dr. Michael Lee", specialty: "Dermatologist", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 3, name: "Dr. Sarah Brown", specialty: "Pediatrician", avatar: "/placeholder.svg?height=50&width=50" },
  { id: 4, name: "Dr. David Wilson", specialty: "Neurologist", avatar: "/placeholder.svg?height=50&width=50" },
];

const DoctorCard = ({ doctor, onSelect, isSelected }) => (
  <div 
    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
      isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
    }`}
    onClick={() => onSelect(doctor)}
  >
    <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-full mr-4" />
    <div>
      <h3 className="font-semibold">{doctor.name}</h3>
      <p className="text-sm text-gray-600">{doctor.specialty}</p>
    </div>
  </div>
);

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs md:max-w-md ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
      <p>{message}</p>
    </div>
  </div>
);

export default function DoctorChatPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      setInputMessage('');
      // Simulate doctor's response
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { 
          text: "Thank you for your message. How can I assist you today?", 
          isUser: false 
        }]);
      }, 1000);
    }
  };

  return (
    <>
    <DashboardLayout />
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 border-r">
              <h2 className="text-xl font-semibold p-4 border-b">Select a Doctor</h2>
              <div className="overflow-y-auto h-[calc(100vh-200px)]">
                {doctors.map(doctor => (
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor} 
                    onSelect={setSelectedDoctor}
                    isSelected={selectedDoctor && selectedDoctor.id === doctor.id}
                  />
                ))}
              </div>
            </div>
            <div className="md:w-2/3">
              {selectedDoctor ? (
                <div className="flex flex-col h-[calc(100vh-200px)]">
                  <div className="bg-gray-100 p-4 flex items-center">
                    <button 
                      className="md:hidden mr-2 text-gray-600" 
                      onClick={() => setSelectedDoctor(null)}
                    >
                      <ChevronLeft />
                    </button>
                    <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <h3 className="font-semibold">{selectedDoctor.name}</h3>
                      <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((message, index) => (
                      <ChatMessage key={index} message={message.text} isUser={message.isUser} />
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
                  <p className="text-gray-500">Select a doctor to start chatting</p>
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