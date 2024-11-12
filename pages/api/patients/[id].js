// pages/api/patients/[id].js
import connectToDatabase from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';

export default async function handler(req, res) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetch patient by ID and populate prescriptions, including the medications
      const patient = await Patient.findById(id)
        .populate({
          path: 'prescriptions',
          select: 'diagnosis medications allergies date signature condition', // Select fields from prescriptions
        })
        .lean();  // `.lean()` makes the result plain JS object, instead of Mongoose document

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
