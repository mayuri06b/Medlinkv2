'use client'
import { useState } from "react";

export default function PatientForm() {
  const [patientId, setPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });
  // Fetch patient details by ID
  const fetchPatientDetails = async () => {
    try {
      const response = await fetch(`/api/patient/${patientId}`);
      if (!response.ok) throw new Error("Patient not found");

      const data = await response.json();
      setPatientDetails(data.patient);
    } catch (error) {
      console.error(error);
      alert("Error fetching patient details");
    }
  };

  // Update patient details
  const updatePatientDetails = async () => {
    try {
      const response = await fetch(`/api/patient/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientDetails),
      });

      if (!response.ok) throw new Error("Update failed");

      alert("Patient details updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating patient details");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Patient Details Management
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Patient ID:</label>
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          className="w-full p-2 mt-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={fetchPatientDetails}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Fetch Patient Details
        </button>
        <button
          onClick={updatePatientDetails}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Update Patient Details
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePatientDetails();
        }}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name:</label>
          <input
            type="text"
            value={patientDetails.name}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, name: e.target.value })
            }
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Age:</label>
          <input
            type="number"
            value={patientDetails.age}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, age: e.target.value })
            }
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email:</label>
          <input
            type="email"
            value={patientDetails.email}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, email: e.target.value })
            }
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Phone:</label>
          <input
            type="tel"
            value={patientDetails.phone}
            onChange={(e) =>
              setPatientDetails({ ...patientDetails, phone: e.target.value })
            }
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Address:</label>
          <div className="space-y-2 mt-2">
            <input
              type="text"
              value={patientDetails.address.street}
              placeholder="Street"
              onChange={(e) =>
                setPatientDetails({
                  ...patientDetails,
                  address: { ...patientDetails.address, street: e.target.value },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={patientDetails.address.city}
              placeholder="City"
              onChange={(e) =>
                setPatientDetails({
                  ...patientDetails,
                  address: { ...patientDetails.address, city: e.target.value },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={patientDetails.address.state}
              placeholder="State"
              onChange={(e) =>
                setPatientDetails({
                  ...patientDetails,
                  address: { ...patientDetails.address, state: e.target.value },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={patientDetails.address.postalCode}
              placeholder="Postal Code"
              onChange={(e) =>
                setPatientDetails({
                  ...patientDetails,
                  address: {
                    ...patientDetails.address,
                    postalCode: e.target.value,
                  },
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Update Patient Details
        </button>
      </form>
    </div>
  );
}
