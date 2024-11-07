import connectToDatabase from '../../utils/dbConnect';
import Patient from '../../models/Patient';
import Doctor from '../../models/Doctor';
import Prescription from '../../models/Prescription';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    await connectToDatabase();
    if (req.method === 'POST') {
        try {
            const { doctorId, name, age, gender, email, medicalHistory } = req.body;
            const newPatient = new Patient({
                name,
                age,
                gender,
                email,
                medicalHistory,
                password: 'temp'
            });
            await newPatient.save();
            
            await Patient.findByIdAndUpdate(newPatient._id, { $push: { doctors: doctorId } }, { new: true });
            await Doctor.findByIdAndUpdate(doctorId, { $push: { patients: newPatient._id } }, { new: true });

            res.status(201).json({ message: 'Patient created successfully', patient: newPatient });
        } catch (error) {
            console.error('Error creating patient:', error);
            res.status(500).json({ error: 'Failed to create patient' });
        }
    } else if (req.method === 'PUT') {
        const { id } = req.query;  
        const updateData = req.body; 
        console.log("Updating patient with ID:", id);

        try {
            const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
                new: true, 
                runValidators: true 
            });
            if (!updatedPatient) {
                return res.status(404).json({ error: 'Patient not found' });
            }
            res.status(200).json({ message: 'Patient updated successfully', patient: updatedPatient });
        } catch (error) {
            console.error('Error updating patient:', error);
            res.status(500).json({ error: 'Failed to update patient' });
        }
    } else if (req.method === 'DELETE') {
        const { id } = req.body;
        console.log("Deleting patient with ID:", id);

        try {
            const deletedPatient = await Patient.findByIdAndDelete(id);

            if (!deletedPatient) {
                return res.status(404).json({ error: 'Patient not found' });
            }

            if (deletedPatient.doctors && deletedPatient.doctors.length > 0) {
                await Doctor.updateMany(
                    { _id: { $in: deletedPatient.doctors } },
                    { $pull: { patients: id } }
                );
            }

            res.status(200).json({ message: 'Patient deleted successfully' });
        } catch (error) {
            console.error('Error deleting patient:', error);
            res.status(500).json({ error: 'Failed to delete patient' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
