'use client';
//Verified 
// Api used (2) api/doctor/[id] and api/auth/putDetails.js
import React, { useState, useEffect } from 'react';
import { Mail, Phone, Award, ChevronRight } from 'lucide-react';
import NavBar from '@/components/DoctorNav/page';

const DoctorProfilePage = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    certifications: [],
  });

  useEffect(() => {
    const doctorId = localStorage.getItem('doctorId');

    if (doctorId) {
      const fetchDoctorData = async () => {
        try {
          const response = await fetch(`/api/auth/doctor/${doctorId}`);
          const data = await response.json();
          if (response.ok) {
            setDoctorData(data);
            setFormData({
              image: data.image || '',
              email: data.email || '',
              phone: data.phone || '',
              experience: data.experience || '',
              education: data.education || '',
              certifications: Array.isArray(data.certifications) ? data.certifications : [], 
            });
          } else {
            console.error("Error fetching doctor data:", data.message);
          }
        } catch (error) {
          console.error("Error fetching doctor data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDoctorData();
    } else {
      setLoading(false);
    }
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'certifications' ? value.split(',').map((cert) => cert.trim()) : value,
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        image: imageUrl, 
      }));
    }
  };

  const saveChanges = async () => {
    const doctorId = localStorage.getItem('doctorId');
    if (!doctorId) return;

    const certificationsArray = Array.isArray(formData.certifications)
    ? formData.certifications
    : formData.certifications.split(',').map((cert) => cert.trim());

    try {
      const response = await fetch(`/api/auth/putDetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: doctorId, 
          ...formData,
          certifications: certificationsArray, 
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setDoctorData(updatedData);
        setEditing(false);
      } else {
        console.error("Error saving data:", await response.text());
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!doctorData) {
    return <div>No doctor data available.</div>;
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-blue-50">
        <main className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-48 m-5"
                  src={formData.image || '/image/man.webp?height=200&width=auto'}
                  alt={doctorData.name}
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {doctorData.specialty || 'Specialty'}
                </div>
                <h2 className="mt-1 text-2xl font-semibold text-gray-900">{doctorData.name}</h2>

                {editing ? (
                  <div>
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone"
                      className="mt-2 p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Experience"
                      className="mt-2 p-2 border border-gray-300 rounded"
                    />
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="Education"
                      className="mt-2 p-2 border border-gray-300 rounded w-full"
                    />
                    <textarea
                      name="certifications"
                      value={formData.certifications.join(', ')}
                      onChange={handleInputChange}
                      placeholder="Certifications (comma separated)"
                      className="mt-2 p-2 border border-gray-300 rounded w-full"
                    />
                  </div>
                ) : (
                  <div className="mt-2 text-gray-600">
                    <p className="flex items-center"><Mail className="mr-2" size={18} /> {doctorData.email}</p>
                    <p className="flex items-center mt-1"><Phone className="mr-2" size={18} /> {doctorData.phone}</p>
                    <p className="flex items-center mt-1"><Award className="mr-2" size={18} /> {doctorData.experience} of experience</p>
                  </div>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => {
                    if (editing) {
                      saveChanges();
                    } else {
                      setEditing(true);
                    }
                  }}
                >
                  {editing ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              {editing ? (
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="Education"
                  className="mt-2 p-2 border border-gray-300 rounded w-full"
                />
              ) : (
                <p className="mt-1 text-gray-600">{doctorData.education || 'Not available'}</p>
              )}
            </div>
            <div className="px-8 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
              {editing ? (
                <textarea
                name="certifications"
                value={Array.isArray(formData.certifications) ? formData.certifications.join(', ') : ''}
                onChange={handleInputChange}
                placeholder="Certifications (comma separated)"
                className="mt-2 p-2 border border-gray-300 rounded w-full"
              />
              
              ) : (
                <ul className="mt-1 list-disc list-inside text-gray-600">
                  {doctorData.certifications?.length > 0
                    ? doctorData.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))
                    : 'No certifications available'}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DoctorProfilePage;
