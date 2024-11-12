'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetAvailabilityForm({ doctorId }) {
  const [availability, setAvailability] = useState([
    { day: 'Monday', times: [] },
    { day: 'Tuesday', times: [] },
    { day: 'Wednesday', times: [] },
    { day: 'Thursday', times: [] },
    { day: 'Friday', times: [] },
    { day: 'Saturday', times: [] },
    { day: 'Sunday', times: [] },
  ]);

  const handleTimeChange = (day, time) => {
    setAvailability(prevAvailability =>
      prevAvailability.map(d =>
        d.day === day
          ? { ...d, times: d.times.includes(time) ? d.times.filter(t => t !== time) : [...d.times, time] }
          : d
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, availability }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Availability updated successfully');
      } else {
        alert(`Failed to update availability: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Failed to update availability');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Availability</h2>
      {availability.map((day, index) => (
        <div key={index}>
          <h3>{day.day}</h3>
          <div>
            {['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map((time) => (
              <label key={time}>
                <input
                  type="checkbox"
                  checked={day.times.includes(time)}
                  onChange={() => handleTimeChange(day.day, time)}
                />
                {time}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type="submit">Save Availability</button>
    </form>
  );
}
