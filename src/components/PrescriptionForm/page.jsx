// PrescriptionForm.js
'use client'
import React, { useState } from 'react';

export default function PrescriptionForm({ patientId, doctorId, doctorName, onClose, onSubmit }) {
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState([]);
  const [allergies, setAllergies] = useState('');
  const [condition, setCondition] = useState('Stable'); // Default to "Stable" label

  // Common options for allergies, dosage units, and frequencies
  const allergyOptions = ['None', 'Penicillin', 'Aspirin', 'Sulfa', 'Latex', 'Peanuts', 'Shellfish'];
  const dosageUnitOptions = ['mg', 'ml', 'tablets'];
  const frequencyOptions = ['Once a day', 'Twice a day', 'Three times a day', 'Four times a day'];

  // Adds a new medication entry
  const addMedication = () => {
    setMedications([...medications, { drugName: '', dosageAmount: '', dosageUnit: 'mg', frequency: 'Once a day' }]);
  };

  // Updates a specific medication field
  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = medications.map((med, medIndex) =>
      medIndex === index ? { ...med, [field]: value } : med
    );
    setMedications(updatedMedications);
  };

  // Removes a medication entry
  const removeMedication = (index) => {
    setMedications(medications.filter((_, medIndex) => medIndex !== index));
  };

  // Cycle through condition options
  const cycleCondition = () => {
    setCondition((prevCondition) => {
      if (prevCondition === 'Stable') return 'Caution';
      if (prevCondition === 'Caution') return 'Critical';
      return 'Stable';
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const prescriptionData = {
      patient: patientId,
      doctor: doctorId,
      diagnosis,
      medications,
      allergies,
      condition, // Include condition in submitted data
      signature: doctorName
    };
    onSubmit(prescriptionData);
  };

  // Determine button color class based on the condition
  const conditionColorClass = condition === 'Stable' ? 'bg-green-500' : condition === 'Caution' ? 'bg-orange-500' : 'bg-red-500';

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Enter Prescription Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Diagnosis:</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <h3 className="text-lg font-semibold mb-2">Medications</h3>
          {medications.map((med, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-gray-50">
              <div className="mb-2">
                <label className="block text-gray-700">Drug Name:</label>
                <input
                  type="text"
                  value={med.drugName}
                  onChange={(e) => handleMedicationChange(index, 'drugName', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex space-x-2 mb-2">
                <input
                  type="number"
                  value={med.dosageAmount}
                  onChange={(e) => handleMedicationChange(index, 'dosageAmount', e.target.value)}
                  className="w-1/3 p-2 border rounded"
                  placeholder="Amount"
                  required
                />
                <select
                  value={med.dosageUnit}
                  onChange={(e) => handleMedicationChange(index, 'dosageUnit', e.target.value)}
                  className="w-1/3 p-2 border rounded"
                >
                  {dosageUnitOptions.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                <select
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  className="w-1/3 p-2 border rounded"
                >
                  {frequencyOptions.map((freq) => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="text-red-500 text-sm underline"
              >
                Remove Medication
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMedication}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Add Medication
          </button>

          <div className="mb-4">
            <label className="block text-gray-700">Allergies:</label>
            <select
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {allergyOptions.map((allergy) => (
                <option key={allergy} value={allergy}>{allergy}</option>
              ))}
            </select>
          </div>

          {/* Condition Button */}
          <div className="mb-4">
            <label className="block text-gray-700">Condition:</label>
            <button
              type="button"
              onClick={cycleCondition}
              className={`px-4 py-2 mt-2 text-white rounded ${conditionColorClass}`}
            >
              {condition}
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Signature:</label>
            <input type="text" className="w-full p-2 border rounded" value={doctorName} readOnly />
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
