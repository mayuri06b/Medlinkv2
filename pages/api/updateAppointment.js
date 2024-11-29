import Appointment from '../../models/Appointment';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    try {
      const { appointmentId, status } = req.body;

      if (!['pending', 'accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      appointment.status = status;
      await appointment.save();

      res.status(200).json({ appointment });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
