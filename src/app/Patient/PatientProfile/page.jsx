'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '@/components/PatientNav/page';

export default function PatientForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Other',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    changePassword: '',
    image: null,
    height: '',
    weight: '',
    bloodGroup: '',
    allergies: '',
    pastMedicalRecords: '',
    currentBloodReport: null,
    medicalInsurance: false,  // Flag for showing insurance details
    insuranceDetails: {
      company: '',
      policyNumber: '',
      coverage: '',
      validity: '',
      document: null
    }
  });

  const [editMode, setEditMode] = useState(false); // Toggle between view/edit mode

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get('/api/patient/profile'); // Replace with actual API endpoint
        setFormData(response.data); // Populate form with existing data
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle address and insurance nested fields
    if (name.includes('address')) {
      const addressField = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value
        }
      }));
    } else if (name === 'image') {
      setFormData((prevState) => ({
        ...prevState,
        image: e.target.files[0]  // Store the selected image file
      }));
    } else if (name === 'medicalInsurance') {
      setFormData((prevState) => ({
        ...prevState,
        medicalInsurance: !prevState.medicalInsurance // Toggle insurance section visibility
      }));
    } else if (name.includes('insuranceDetails')) {
      const insuranceField = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        insuranceDetails: {
          ...prevState.insuranceDetails,
          [insuranceField]: value
        }
      }));
    } else if (name === 'currentBloodReport') {
      setFormData((prevState) => ({
        ...prevState,
        currentBloodReport: e.target.files[0]  // Handle file uploads
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  // Handle save to update the database
  const handleSave = async () => {
    const form = new FormData();
    for (const key in formData) {
      if (key === 'address') {
        for (const addressKey in formData.address) {
          form.append(`address.${addressKey}`, formData.address[addressKey]);
        }
      } else if (key === 'image' && formData.image) {
        form.append('image', formData.image);  // Append the image file
      } else if (key === 'insuranceDetails' && formData.medicalInsurance) {
        for (const insuranceKey in formData.insuranceDetails) {
          form.append(`insuranceDetails.${insuranceKey}`, formData.insuranceDetails[insuranceKey]);
        }
      } else if (key === 'currentBloodReport' && formData.currentBloodReport) {
        form.append('currentBloodReport', formData.currentBloodReport);
      } else {
        form.append(key, formData[key]);
      }
    }

    try {
      await axios.put('/api/patient/profile', form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile updated successfully!');
      setEditMode(false); // Switch back to view mode
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <>
      <DashboardLayout />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-center">{editMode ? 'Edit Patient Profile' : 'Patient Profile'}</h2>

        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg space-y-4">
          {/* Personal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>

            <div>
              <label htmlFor="changePassword" className="block text-sm font-semibold text-gray-700">Change Password (Optional)</label>
              <input
                type="password"
                id="changePassword"
                name="changePassword"
                value={formData.changePassword}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>
          </div>

          {/* Medical Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="height" className="block text-sm font-semibold text-gray-700">Height (in cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-semibold text-gray-700">Weight (in kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-semibold text-gray-700">Blood Group</label>
              <input
                type="text"
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>

            <div>
              <label htmlFor="allergies" className="block text-sm font-semibold text-gray-700">Allergies</label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
              />
            </div>
          </div>

          {/* Past Medical Records */}
          <div>
            <label htmlFor="pastMedicalRecords" className="block text-sm font-semibold text-gray-700">Past Medical Records</label>
            <textarea
              id="pastMedicalRecords"
              name="pastMedicalRecords"
              value={formData.pastMedicalRecords}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
            />
          </div>

          {/* Blood Report */}
          <div>
            <label htmlFor="currentBloodReport" className="block text-sm font-semibold text-gray-700">Current Blood Report</label>
            <input
              type="file"
              id="currentBloodReport"
              name="currentBloodReport"
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
            />
          </div>

          {/* Medical Insurance */}
          {formData.medicalInsurance && (
            <div>
              <div>
                <label htmlFor="insuranceDetails.company" className="block text-sm font-semibold text-gray-700">Insurance Company</label>
                <input
                  type="text"
                  id="insuranceDetails.company"
                  name="insuranceDetails.company"
                  value={formData.insuranceDetails.company}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
                />
              </div>

              <div>
                <label htmlFor="insuranceDetails.policyNumber" className="block text-sm font-semibold text-gray-700">Policy Number</label>
                <input
                  type="text"
                  id="insuranceDetails.policyNumber"
                  name="insuranceDetails.policyNumber"
                  value={formData.insuranceDetails.policyNumber}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
                />
              </div>

              <div>
                <label htmlFor="insuranceDetails.coverage" className="block text-sm font-semibold text-gray-700">Coverage</label>
                <input
                  type="text"
                  id="insuranceDetails.coverage"
                  name="insuranceDetails.coverage"
                  value={formData.insuranceDetails.coverage}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
                />
              </div>

              <div>
                <label htmlFor="insuranceDetails.validity" className="block text-sm font-semibold text-gray-700">Validity</label>
                <input
                  type="date"
                  id="insuranceDetails.validity"
                  name="insuranceDetails.validity"
                  value={formData.insuranceDetails.validity}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
                />
              </div>

              <div>
                <label htmlFor="insuranceDetails.document" className="block text-sm font-semibold text-gray-700">Insurance Document</label>
                <input
                  type="file"
                  id="insuranceDetails.document"
                  name="insuranceDetails.document"
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`w-full p-3 mt-1 border rounded-md ${editMode ? 'border-gray-300' : 'bg-gray-100'}`}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            {editMode ? (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
