import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    await dbConnect();
    if (req.method === 'POST') {
        const { name, email, password, age } = req.body;
        try {
            const existingPatient = await Patient.findOne({ email });
            if (existingPatient) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const patient = new Patient({
                name,
                email,
                password: hashedPassword,
                age,
            });
            await patient.save();
            res.status(201).json({ message: 'Patient created successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
