import dbConnect from '../../../utils/dbConnect';
import Appointment from '../../../models/Appointment';

export default async function handler(req, res) {
  const { id } = req.query;
  await dbConnect();

  if (req.method === 'PUT') {
    const { date, time } = req.body;
    try {
      const appointment = await Appointment.findByIdAndUpdate(id, { date, time }, { new: true });
      if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
      res.status(200).json({ message: 'Appointment updated', appointment });
    } catch (error) {
      res.status(500).json({ message: 'Error updating appointment', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const appointment = await Appointment.findByIdAndDelete(id);
      if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
      res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting appointment', error });
    }
  }
}
