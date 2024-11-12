'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/DoctorNav/page';
import axios from 'axios';

const PatientManagement = () => {
    const searchParams = useSearchParams(); 
    const [doctorId, setDoctorId] = useState('');
    const [patientData, setPatientData] = useState({
        name: '',
        age: '',
        gender: 'Other',
        email: '',
        medicalHistory: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (searchParams?.has('doctorId')) {
            setDoctorId(searchParams.get('doctorId'));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setPatientData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('/api/patientData', {
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

    if (!doctorId) {
        return <div>Please provide a valid doctor ID to add patients.</div>;
    }
    
    return (
        <>
        <div>
            <NavBar />
        </div>
        <div className="container mx-auto my-8 p-6 bg-white shadow-lg rounded-lg max-w-lg">
            <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">Add New Patient</h2>
            
            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
            {success && <div className="text-green-600 mb-4 text-center">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="name">Name</label>
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
                        <label className="block text-sm font-medium text-gray-600" htmlFor="age">Age</label>
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

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 mt-4 text-white rounded-lg font-semibold ${
                            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Adding Patient...' : 'Add Patient'}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default PatientManagement;
