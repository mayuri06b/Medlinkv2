'use client';

import { useState, useEffect } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import DashboardLayout from '@/components/PatientNav/page';

const DoctorCard = ({ doctor, onSelect, isSelected }) => (
  <div
    className={`flex items-center p-4 rounded-lg cursor-pointer transition-colors ${
      isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'
    }`}
    onClick={() => onSelect(doctor)}
  >
    <img src="/image/img.png" alt={doctor.name} className="w-12 h-12 rounded-full mr-4" />
    <div>
      <h3 className="font-semibold">{doctor.name}</h3>
      <p className="text-sm text-gray-600">{doctor.specialty}</p>
    </div>
  </div>
);

const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs md:max-w-md ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
      <p>{message.content}</p>
    </div>
  </div>
);

const LinkedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch messages for both directions (patient -> doctor and doctor -> patient)
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedDoctor) {
        const patientId = localStorage.getItem('patientId');
        const conversationId = `${patientId}-${selectedDoctor._id}`;
        console.log('Fetching messages for conversationId:', conversationId);

        try {
          const response = await fetch(`/api/message/getMessage?conversationId=${conversationId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch messages: ${response.statusText}`);
          }
          const data = await response.json();
          console.log('Fetched messages:', data);

          // Update messages state with the data fetched
          setMessages(data.messages.length > 0 ? data.messages : []);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setError(`Failed to fetch messages: ${error.message}`);
        }
      }
    };

    if (selectedDoctor) fetchMessages();
  }, [selectedDoctor]);

  // Fetch linked doctors for the patient
  useEffect(() => {
    const fetchLinkedDoctors = async () => {
      setLoading(true);
      try {
        const patientId = localStorage.getItem('patientId');
        if (!patientId) {
          setError('Patient ID not found');
          return;
        }
        const response = await fetch(`/api/authp/getDoctors?patientId=${patientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        if (data.length === 0) {
          setError('No doctors found for this patient');
        } else {
          setDoctors(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLinkedDoctors();
  }, []);

  // Handle message sending (patient -> doctor, doctor -> patient)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() !== '') {
      const patientId = localStorage.getItem('patientId');
      const conversationId = `${patientId}-${selectedDoctor._id}`;

      const messageData = {
        senderId: patientId,
        receiverId: selectedDoctor._id,
        senderModel: 'Patient', // Patient is sending the message
        receiverModel: 'Doctor', // Doctor is the recipient
        content: inputMessage,
        conversationId,
      };

      try {
        // Send the message from the patient to the doctor
        const response = await fetch('/api/message/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(messageData),
        });

        const data = await response.json();
        // Update messages state with the sent message
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: inputMessage, senderModel: 'Patient' },
        ]);
        setInputMessage('');

        // Fetch updated messages (including doctor responses)
        const messageResponse = await fetch(`/api/message/getMessage?conversationId=${conversationId}`);
        if (messageResponse.ok) {
          const updatedMessages = await messageResponse.json();
          setMessages(updatedMessages.messages);
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading doctors...</div>;
  }

  if (doctors.length === 0) {
    return <div>No doctors found for this patient</div>;
  }

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
                  {doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor._id}
                      doctor={doctor}
                      onSelect={setSelectedDoctor}
                      isSelected={selectedDoctor && selectedDoctor._id === doctor._id}
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
                      <img src="/image/img.png" alt={selectedDoctor.name} className="w-10 h-10 rounded-full mr-3" />
                      <div>
                        <h3 className="font-semibold">{selectedDoctor.name}</h3>
                        <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {messages.length > 0 ? (
                        messages.map((message, index) => (
                          <ChatMessage key={index} message={message} isUser={message.senderModel === 'Patient'} />
                        ))
                      ) : (
                        <p className="text-gray-500">No messages yet. Start chatting!</p>
                      )}
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
};

export default LinkedDoctors;
