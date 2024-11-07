import connectToDatabase from '../../utils/dbConnect'; 
import Doctor from '../../models/Doctor'; 

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const doctors = await Doctor.find().select('name specialty'); // You can modify which fields to select here
      return res.status(200).json({
        message: 'Doctors fetched successfully',
        doctors,
      });
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
