'use client';
//Verified works fine 
//deployment errors in searchParams 
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/DoctorNav/page';
import axios from 'axios';

const PatientManagement = () => {
    //const searchParams = useSearchParams();
    const [doctorId, setDoctorId] = useState('');
    const [activeTab, setActiveTab] = useState('add'); 
    const [patientData, setPatientData] = useState({
        name: '',
        age: '',
        gender: 'Other',
        email: '',
        medicalHistory: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // const doctorIdFromParams = searchParams?.get('doctorId');
        const doctorIdFromParams = localStorage.getItem('doctorId');
        if (doctorIdFromParams) {
            setDoctorId(doctorIdFromParams);
        } else {
            setError('Doctor ID is missing or invalid.');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle search input changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Add new patient
    const handleAddPatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!patientData.name || !patientData.age || !patientData.email) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/authp/patientData', {
                ...patientData,
                doctorId,
            });
            setSuccess('Patient added successfully!');
            setPatientData({
                name: '',
                age: '',
                gender: 'Other',
                email: '',
                medicalHistory: '',
            });
        } catch (error) {
            console.error('Error adding patient:', error);
            setError(error.response?.data?.error || 'Failed to add patient');
        } finally {
            setLoading(false);
        }
    };

    // Search for existing patients
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSearchResults([]);

        try {
            const response = await axios.get(`/api/authp/searchPatient?query=${searchQuery}`);
            console.log('API response:', response.data); 
            setSearchResults(response.data || []); 
        } catch (error) {
            console.error('Error searching patients:', error);
            setError('Failed to fetch patients. Please try again.');
        }
    };

    const handleAddExistingPatient = async (patientId) => {
        setLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const response = await axios.post('/api/auth/assignExistingPatient', {
                doctorId,
                patientId,
            });
    
            if (response.status === 200) {
                setSuccess('Patient added to your list successfully!');
            }
        } catch (error) {
            console.error('Error adding existing patient:', error);
            setError(error.response?.data?.error || 'Failed to add the patient. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    

    if (!doctorId) {
        return <div>Please provide a valid doctor ID to manage patients.</div>;
    }

    return (
        <>
            <div>
                <NavBar />
            </div>
            <div className="container mx-auto my-8 p-6 bg-white shadow-lg rounded-lg max-w-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
                    Patient Management
                </h2>

                {/* Tabs for switching between Add and Search */}
                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'add' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}>
                        Add New Patient
                    </button>
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`px-4 py-2 rounded-lg ${activeTab === 'search' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}>
                        Search Existing Patient
                    </button>
                </div>

                {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
                {success && <div className="text-green-600 mb-4 text-center">{success}</div>}

                {/* Add Patient Form */}
                {activeTab === 'add' && (
                    <form onSubmit={handleAddPatient}>
                        <div className="grid gap-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={patientData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:border-blue-400"
                                />
                            </div>

                            {/* Age */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600" htmlFor="age">
                                    Age
                                </label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={patientData.age}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:border-blue-400"
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600" htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={patientData.gender}
                                    onChange={handleChange}
                                    className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:border-blue-400"
                                >
                                    <option value="Other">Other</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={patientData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:border-blue-400"
                                />
                            </div>

                            {/* Medical History */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600" htmlFor="medicalHistory">Medical History</label>
                                <textarea
                                    id="medicalHistory"
                                    name="medicalHistory"
                                    value={patientData.medicalHistory}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:border-blue-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 mt-4 text-white rounded-lg font-semibold ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}>
                                {loading ? 'Adding Patient...' : 'Add Patient'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Search Existing Patient */}
                {activeTab === 'search' && (
                    <>
                        <form onSubmit={handleSearch} className="mb-4">
                            <input
                                type="text"
                                placeholder="Search by email"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full mt-1 p-2 border rounded-lg shadow-sm focus:border-blue-400"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 mt-4 text-white rounded-lg font-semibold ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                    }`}>
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </form>

                        {/* Search Results */}
                        {searchResults.length > 0 ? (
                            <ul>
                                {searchResults.map((patient) => (
                                    <li
                                        key={patient._id}
                                        className="p-4 border rounded-lg mb-2 flex justify-between items-center"
                                    >
                                        <div>
                                            <h4 className="font-semibold">{patient.name}</h4>
                                            <p className="text-sm text-gray-600">{patient.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddExistingPatient(patient._id)}
                                            className="text-white bg-green-500 px-4 py-2 rounded-lg"
                                        >
                                            Add
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">No results found</p>
                        )}

                    </>
                )}
            </div>
        </>
    );
};

export default PatientManagement;
