import Doctor from '../../../models/Doctor';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(req, res) {
  await dbConnect(); 
  if (req.method === 'POST') {
    const { doctorId, availability } = req.body;
    if (!doctorId || !availability) {
      return res.status(400).json({ error: 'Doctor ID and availability are required.' });
    }

    try {
      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { availability },
        { new: true, runValidators: true } 
      );

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      return res.status(200).json({ message: 'Availability updated successfully', doctor });
    } catch (error) {
      console.error('Error updating availability:', error);
      return res.status(500).json({ error: 'Failed to update availability' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
