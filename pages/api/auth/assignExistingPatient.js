import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';
import Doctor from '../../../models/Doctor';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { doctorId, patientId } = req.body;

        try {
            // Validate input
            if (!doctorId || !patientId) {
                return res.status(400).json({ error: 'Missing doctorId or patientId' });
            }

            // Fetch the patient and doctor from the database
            const patient = await Patient.findById(patientId);
            const doctor = await Doctor.findById(doctorId);

            if (!patient) {
                return res.status(404).json({ error: 'Patient not found' });
            }

            if (!doctor) {
                return res.status(404).json({ error: 'Doctor not found' });
            }

            // Check if the doctor is already assigned to the patient
            if (patient.doctors.includes(doctorId)) {
                return res.status(400).json({ error: 'Patient is already assigned to this doctor' });
            }

            // Add the doctor to the patient's list
            patient.doctors.push(doctorId);
            await patient.save();

            // Add the patient to the doctor's list
            doctor.patients.push(patientId);
            await doctor.save();

            return res.status(200).json({ message: 'Patient successfully assigned to doctor' });
        } catch (error) {
            console.error('Error assigning patient to doctor:', error);
            return res.status(500).json({ error: `Failed to assign patient: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
