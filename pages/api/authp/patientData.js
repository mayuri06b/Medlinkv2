import connectToDatabase from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';
import Doctor from '../../../models/Doctor';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    await connectToDatabase();

    if (req.method === 'POST') {
        try {
            const { doctorId, name, age, gender, email, medicalHistory } = req.body;
            console.log(req.body);
            if (!doctorId 
                || !name 
                || !age 
                || !gender 
                || !email 
                || !medicalHistory
                ) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const existingPatient = await Patient.findOne({ email });
            if (existingPatient) {
                return res.status(400).json({ error: 'Patient with this email already exists' });
            }
            const password = "password123"; 
            const hashedPassword = await bcrypt.hash(password, 10);

            const newPatient = new Patient({
                name,
                age,
                gender,
                email,
                medicalHistory,
                password: hashedPassword,
            });
            await newPatient.save();

            await Promise.all([
                Patient.findByIdAndUpdate(newPatient._id, { $push: { doctors: doctorId } }),
                Doctor.findByIdAndUpdate(doctorId, { $push: { patients: newPatient._id } }),
            ]);

            res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
        } catch (error) {
            console.error('Error creating patient:', error.message);
            res.status(500).json({ error: `Failed to create patient: ${error.message}` });
        }
    } else if (req.method === 'PUT') {
        const { id } = req.query;
        const updateData = req.body;

        try {
            const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });

            if (!updatedPatient) {
                return res.status(404).json({ error: 'Patient not found' });
            }

            res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
        } catch (error) {
            console.error('Error updating patient:', error.message);
            res.status(500).json({ error: `Failed to update patient: ${error.message}` });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.body;

        try {
            const deletedPatient = await Patient.findByIdAndDelete(id);
            if (!deletedPatient) {
                return res.status(404).json({ error: 'Patient not found' });
            }

            await Doctor.updateMany(
                { _id: { $in: deletedPatient.doctors } },
                { $pull: { patients: id } }
            );

            res.status(200).json({ message: 'Patient deleted successfully' });
        } catch (error) {
            console.error('Error deleting patient:', error.message);
            res.status(500).json({ error: `Failed to delete patient: ${error.message}` });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
