import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        const { email, password } = req.body;
        try {
            const patient = await Patient.findOne({ email });
            if (!patient) {
                console.log('Patient not found for email:', email);
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            console.log('Patient found:', patient);

            // Use bcrypt.compare to validate the password
            const isPasswordValid = await bcrypt.compare(password, patient.password);
            if (!isPasswordValid) {
                console.log('Invalid password for patient:', patient.email);
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT if password is valid
            const token = jwt.sign(
                { id: patient._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({ token, patientId: patient._id });
        } catch (error) {
            console.error('Error in patient login API:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
