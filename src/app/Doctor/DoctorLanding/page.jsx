'use client';
// import PatientManagement from '../PatientManagement/page';
import PrescriptionForm from '@/components/PrescriptionForm/page';
import NavBar from '@/components/DoctorNav/page';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Calendar, MessageSquare, PlusCircle, User, UserCircle, Zap } from 'lucide-react';

const conditionColors = {
  Stable: 'bg-green-500',    
  Caution: 'bg-orange-500',  
  Critical: 'bg-red-500'     
};


export default function DoctorDashboard() {
  const [patientList, setPatientList] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [doctorId, setDoctorId] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
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
        console.log('Fetching doctor data with token:', token);
        const response = await fetch('/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          console.error('Failed to fetch doctor data:', errorDetails);
          throw new Error(`Error ${response.status}: ${errorDetails.error || 'Failed to fetch doctor data'}`);
        }
        const data = await response.json();
        console.log('Doctor data fetched:', data);
        setDoctorName(data.name);
        setDoctorId(data.id); 
        setPatientList(data.patients);
        
        if (data.patients.length > 0) {
          const patientIds = data.patients.join(',');
          const patientResponse = await fetch(`/api/authp/getPatientDetails?ids=${patientIds}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (!patientResponse.ok) {
            const errorDetails = await patientResponse.json();
            console.error('Failed to fetch patient details:', errorDetails);
            throw new Error(`Error ${patientResponse.status}: ${errorDetails.error || 'Failed to fetch patient details'}`);
          }
  
          const patientsData = await patientResponse.json();
          console.log('Patient details fetched:', patientsData);
          setPatientList(patientsData); 
        }
        console.log(patientList);
        
      } catch (error) {
        console.error('Error in fetchDoctorData:', error);
        alert(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctorData();
  }, [router]);

  localStorage.setItem('doctorId', doctorId);
  const handleOpenPrescriptionForm = (patientId) => {
    setSelectedPatient(patientId); 
  };
  
  const handlePrescriptionSubmit = async (prescriptionData) => {
    try {
      const updateresponse = await fetch(`/api/prescriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionData),
      });
      if (updateresponse.ok) {
        const updatedPatient = await updateresponse.json();
        console.log('Prescription added successfully:', updatedPatient);
        setPatientList((prevList) =>
          prevList.map((patient) =>
            patient._id === selectedPatient ? { ...patient, prescriptions: [...patient.prescriptions, updatedPatient._id] } : patient
          )
        );
        setSelectedPatient(null); 

      } else {
        console.error('Failed to add prescription:', await updateresponse.text());
        alert('Failed to add prescription. Please try again.');
      }
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  const removePatient = async (id) => {
    if (confirm("Are you sure you want to remove this patient?")) {
        try {
            const response = await fetch('/api/patientData', { 
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ id }), 
            });

            if (response.ok) {
                setPatientList((prevList) => prevList.filter(patient => patient._id !== id));
                console.log("Patient deleted successfully!");
            } else {
                console.error("Failed to delete patient:", await response.text());
                alert("Failed to delete the patient. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting patient:", error);
            alert("An error occurred. Please try again later.");
        }
    }
};

  const handleAddPatientClick = () => {
    router.push(`/Doctor/PatientManagement?doctorId=${doctorId}`);
};


const viewPatient = (patientId) => {
  if (!patientId) {
    console.error("Invalid patient ID:", patientId);
    return;
  }
  router.push(`/Patient/PatientDetail?patientId=${patientId}`);
};

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  

  return (
    <div className="min-h-screen bg-blue-50">
      <NavBar />
      <main className="container mx-auto mt-8 p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-800">Hello, {doctorName}</h2>
          <button 
            onClick={handleAddPatientClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2">
            <PlusCircle size={20} />
            <span>Add Patient</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patientList && patientList.length > 0 ? (
            patientList.map((patient) => (
              <div key={patient._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <img src={patient.image?.src || '/image/img.png'} alt={patient.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">{patient.name}</h3>
                      <p className="text-gray-600">Age: {patient.age}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${conditionColors[patient.condition] || 'bg-gray-500'}`}>
                      {patient.condition ? patient.condition.charAt(0).toUpperCase() + patient.condition.slice(1) : 'Unknown'}
                    </span>
                    {/* <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white ${conditionColors[prescriptionData.condition] || 'bg-gray-500'}`}>
                    {prescriptionData.condition ? prescriptionData.condition.charAt(0).toUpperCase() + prescriptionData.condition.slice(1) : 'Unknown'}
                    </span> */}
                    <p className="mt-2 text-gray-700">Health: {patient.health || 'N/A'}</p>
                  </div>
                </div>
                <div className="bg-gray-100 px-4 py-3 flex justify-between">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => handleOpenPrescriptionForm(patient._id)}>
                  Add Prescription
                  </button>
                  {selectedPatient && (
                    <PrescriptionForm
                      patientId={selectedPatient}
                      doctorId={doctorId}
                      doctorName={doctorName}
                      onClose={() => setSelectedPatient(null)} 
                      onSubmit={handlePrescriptionSubmit}       
                    />
                  )}
                  <button 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => viewPatient(patient._id)}>
                  View Patient
                      </button>
                  <button 
                    className="text-red-600 hover:text-red-800 font-medium"
                    onClick={() => removePatient(patient._id)}>
                    Remove Patient
                  </button>
                </div>
              </div>
            ))
          ) 
          : (
            <div className="text-center text-gray-600 col-span-full">
              No patients found. Use "Add Patient" to get started.
            </div>
          )
          }
        </div>
      </main>
    </div>
    
  );
  
}

