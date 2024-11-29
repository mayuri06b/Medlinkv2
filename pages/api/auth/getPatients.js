import dbConnect from '../../../utils/dbConnect';
import Doctor from '../../../models/Doctor';
import Patient from '../../../models/Patient';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const { doctorId } = req.query;

        if (!doctorId) {
            return res.status(400).json({ message: 'Doctor ID is required' });
        }

        try {
            // Find the doctor by ID
            const doctor = await Doctor.findById(doctorId).populate('patients');
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            // Get the list of patients linked to the doctor
            const patients = doctor.patients; // Array of patient objects

            if (!patients || patients.length === 0) {
                return res.status(404).json({ message: 'No patients found for this doctor' });
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
