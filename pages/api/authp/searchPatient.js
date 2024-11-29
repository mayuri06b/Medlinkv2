import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';

export default async function handler(req, res) {
    await dbConnect();
  
    if (req.method === 'GET') {
      const { query } = req.query;
  
      try {
        const patients = await Patient.find({ email: { $regex: new RegExp(query, 'i') } }); 
        if (!patients.length) {
          return res.status(404).json({ message: 'No patients found' });
        }
        res.status(200).json(patients); 
      } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  