'use client'

import React, { useState, useCallback } from 'react';
import { Search, User, Brain, ChevronDown } from 'lucide-react';
import NavBar from '@/components/DoctorNav/page';

// Mock patient data (expanded for demonstration)
const allPatients = [
  { id: 1, name: "John Doe", age: 45, gender: "Male" },
  { id: 2, name: "Jane Smith", age: 32, gender: "Female" },
  { id: 3, name: "Mike Johnson", age: 58, gender: "Male" },
  { id: 4, name: "Emily Brown", age: 27, gender: "Female" },
  { id: 5, name: "Robert Wilson", age: 52, gender: "Male" },
  { id: 6, name: "Sarah Davis", age: 39, gender: "Female" },
  { id: 7, name: "David Lee", age: 61, gender: "Male" },
  { id: 8, name: "Lisa Taylor", age: 29, gender: "Female" },
  // Add more patients as needed
];

const PatientCard = ({ patient, onSelect }) => (
  <div 
    className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
    onClick={() => onSelect(patient)}
  >
    <div className="flex items-center">
      <User className="w-8 h-8 text-blue-500 mr-3" />
      <div>
        <h3 className="font-semibold">{patient.name}</h3>
        <p className="text-sm text-gray-600">{patient.age} years old, {patient.gender}</p>
      </div>
    </div>
  </div>
);

export default function AIInsightPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [aiInsight, setAiInsight] = useState('');
  const [displayedPatients, setDisplayedPatients] = useState(4);

  const filteredPatients = allPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientSelect = useCallback((patient) => {
    setSelectedPatient(patient);
    // Simulate AI insight generation
    setAiInsight(`AI-generated insight for ${patient.name}: Based on the patient's age and gender, 
    recommend a comprehensive health check-up focusing on common age-related conditions. 
    Suggest lifestyle modifications if necessary.`);
  }, []);

  const loadMore = () => {
    setDisplayedPatients(prevCount => Math.min(prevCount + 4, filteredPatients.length));
  };

  return (
    <>
    <NavBar />
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-4">
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search for a patient..."
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Patient List</h2>
            <div className="space-y-4">
              {filteredPatients.slice(0, displayedPatients).map(patient => (
                <PatientCard key={patient.id} patient={patient} onSelect={handlePatientSelect} />
              ))}
            </div>
            {displayedPatients < filteredPatients.length && (
              <button
                onClick={loadMore}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                Load More <ChevronDown className="ml-2 w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">AI Insight</h2>
            {selectedPatient ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Insight for {selectedPatient.name}</h3>
                <p className="text-gray-700">{aiInsight}</p>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
                <p className="text-gray-500">Select a patient to get AI insights</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
}