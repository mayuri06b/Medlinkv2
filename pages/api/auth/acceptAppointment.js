import dbConnect from '../../../utils/dbConnect';
import AppointmentModel from '../../../models/Appointment';
import DoctorModel from '../../../models/Doctor';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { appointmentId } = req.body;

  if (!appointmentId) {
    return res.status(400).json({ message: 'Appointment ID is required.' });
  }

  try {
    await dbConnect();

    const appointment = await AppointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Mark the appointment as accepted
    appointment.status = 'Accepted';
    await appointment.save();

    // Add the appointment to the doctor's current appointments
    const doctor = await DoctorModel.findById(appointment.doctorId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    doctor.patients.push(appointment.patientId);
    await doctor.save();

    res.status(200).json({ message: 'Appointment accepted successfully!' });
  } catch (error) {
    console.error('Error accepting appointment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
