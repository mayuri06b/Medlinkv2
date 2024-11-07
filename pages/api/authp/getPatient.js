import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'GET') {
        const { patientId } = req.query;

        try {
            const patient = await Patient.findById(patientId);
            console.log("success");
            console.log(patient);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.status(200).json(patient);
        } catch (error) {
            console.error('Error fetching patient data:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
