import dbConnect from '../../../utils/dbConnect';
import Prescription from '../../../models/Prescription';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
       const { patientId } = req.query; 
        try {
            // Finding the prescriptions for the given patientId
            const prescriptions = await Prescription.find({ patient: patientId });

            console.log("Success");
            console.log(prescriptions);

            if (!prescriptions || prescriptions.length === 0) {
                return res.status(404).json({ message: 'No records found for the given patient.' });
            }

            // Return the found prescriptions
            res.status(200).json(prescriptions);
        } catch (error) {
            console.error('Error fetching patient prescriptions:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // Handling other methods (in this case, only GET is allowed)
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
