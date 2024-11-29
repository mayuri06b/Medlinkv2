import dbConnect from '../../../utils/dbConnect';
import Doctor from '../../../models/Doctor';
import Patient from '../../../models/Patient';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const { patientId } = req.query;

        if (!patientId) {
            return res.status(400).json({ message: 'Patient ID is required' });
        }

        try {
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }

            const doctors = patient.doctors;  // Array of doctor IDs
            if (!doctors || doctors.length === 0) {
                return res.status(404).json({ message: 'No doctors found for this patient' });
            }

            const doctorData = await Doctor.find({ _id: { $in: doctors } });

            if (!doctorData || doctorData.length === 0) {
                return res.status(404).json({ message: 'No doctor data found' });
            }

            res.status(200).json(doctorData);

        } catch (error) {
            console.error('Error fetching doctors:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
