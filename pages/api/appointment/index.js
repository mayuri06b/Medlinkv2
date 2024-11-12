import dbConnect from '../../../utils/dbConnect';
import Appointment from '../../../models/Appointment';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { patientId, doctorId, date, time } = req.body;
    try {
      const appointment = new Appointment({ patientId, doctorId, date, time });
      await appointment.save();
      res.status(201).json({ message: 'Appointment created', appointment });
    } catch (error) {
      res.status(500).json({ message: 'Error creating appointment', error });
    }
  } else if (req.method === 'GET') {
    try {
      const appointments = await Appointment.find().populate('patientId doctorId');
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching appointments', error });
    }
  }
}
