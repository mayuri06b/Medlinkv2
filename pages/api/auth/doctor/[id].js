// pages/api/doctor/[id].js
//used in Doctor/DoctorProfile/page.jsx
import dbConnect from '../../../../utils/dbConnect';
import Doctor from '../../../../models/Doctor';

export default async function handler(req, res) {
    await dbConnect();
    const { id } = req.query; 
    if (req.method === 'GET') {
        try {
            const doctor = await Doctor.findById(id); 
            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' }); 
            }
            res.status(200).json(doctor); 
        } catch (error) {
            console.error('Error fetching doctor:', error);
            res.status(500).json({ error: 'Failed to fetch doctor' }); 
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
