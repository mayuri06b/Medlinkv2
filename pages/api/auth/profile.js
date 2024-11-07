
import connectToDatabase from '../../../utils/dbConnect';
import Doctor from '../../../models/Doctor';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;  

export default async function handler(req, res) {
  await connectToDatabase();
  
  if (req.method === 'GET') {
    try {
      const { authorization } = req.headers;

      // Check if authorization header is present
      if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
      }

      // Extract the token from the authorization header
      const token = authorization.split(' ')[1];  
      let doctorId;
      try {
        // Verify the token and extract the doctor ID
        const decoded = jwt.verify(token, JWT_SECRET);
        doctorId = decoded.id;  
      } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Find the doctor by ID
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      
      res.status(200).json({
        id: doctor._id, 
        name: doctor.name,
        specialty: doctor.specialty,
        experience: doctor.experience,
        patients: doctor.patients,
      });
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      res.status(500).json({ error: 'Failed to fetch doctor data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
