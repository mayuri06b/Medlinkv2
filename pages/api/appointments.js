import connectToDatabase from '../../utils/dbConnect';
import Appointment from '../../models/Appointment';
import Doctor from '../../models/Doctor';
import Patient from '../../models/Patient';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { patientId, doctorId, date, time } = req.body;

    // Ensure required data is provided
    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Find the patient and doctor in the database
      const patient = await Patient.findById(patientId);
      const doctor = await Doctor.findById(doctorId);

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      // Create a new appointment with the status as 'pending'
      const newAppointment = new Appointment({
        patientId,
        doctorId,
        date,
        time,
        status: 'pending', // Initial status set to 'pending'
      });

      await newAppointment.save();

      // Optionally, update the doctor's list of appointments if needed
      doctor.appointments.push(newAppointment._id);
      await doctor.save();

      // Optionally, update the patient's list of appointments if needed
      patient.appointments.push(newAppointment._id);
      await patient.save();

      return res.status(201).json({
        message: 'Appointment request sent successfully',
        appointment: newAppointment,
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      return res.status(500).json({ error: 'Failed to create appointment' });
    }
  } else {
    // Method not allowed
    res.status(405).json({ error: 'Method not allowed' });
  }
}
