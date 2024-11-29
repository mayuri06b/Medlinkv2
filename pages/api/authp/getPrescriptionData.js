import connectToDatabase from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      // Get the patientId from the Authorization header
      const patientId = req.headers.authorization?.split(' ')[1];
      if (!patientId) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      // Fetch patient data and populate prescriptions
      const patient = await Patient.findById(patientId)
        .populate({
          path: 'prescriptions',
          select: 'diagnosis medications allergies date signature condition',
        })
        .lean();

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.status(200).json(patient);
    } catch (error) {
      console.error('Error fetching patient:', error);
      res.status(500).json({ error: 'Failed to fetch patient' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
