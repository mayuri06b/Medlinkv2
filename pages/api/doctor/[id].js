// pages/api/doctors/[id].js
import dbConnect from '../../../utils/dbConnect';
import Doctor from '../../../models/Doctor';

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query; // Extract the doctor ID from the URL

    if (req.method === 'GET') {
        try {
            const doctor = await Doctor.findById(id); // Find the doctor by ID
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' }); // Return 404 if doctor doesn't exist
            }
            res.status(200).json(doctor); // Return the found doctor
        } catch (error) {
            console.error('Error fetching doctor:', error);
            res.status(500).json({ error: 'Failed to fetch doctor' }); // Handle errors gracefully
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
