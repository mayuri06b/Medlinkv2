import Appointment from '../../models/Appointment';
import Doctor from '../../models/Doctor';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { patientId, doctorId, date, time } = req.body;
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' });

      const doctorAvailable = doctor.availability.some(
        (day) => day.day === dayOfWeek && day.times.includes(time)
      );

      if (doctorAvailable) {
        return res.status(400).json({ error: 'Doctor is not available at the selected time' });
      }

      // Create the new appointment
      const newAppointment = new Appointment({
        patientId,
        doctorId,
        date: new Date(date),
        time,
      });

      await newAppointment.save();

      // Add the reserved time to the doctor's availability
      const dayEntry = doctor.availability.find(day => day.day === dayOfWeek);

      if (dayEntry) {
        // If the day already exists, add the time to that day
        if (!dayEntry.times.includes(time)) {
          dayEntry.times.push(time);
        }
      } else {
        // If the day does not exist, add a new day entry with the time
        doctor.availability.push({ day: dayOfWeek, times: [time] });
      }

      // Save the updated doctor's availability
      await doctor.save();

      res.status(201).json({ appointment: newAppointment });
    } catch (error) {
      res.status(500).json({ error: 'Failed to book appointment' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
