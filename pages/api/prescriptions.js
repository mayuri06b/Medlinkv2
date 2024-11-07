// In `/pages/api/prescriptions.js`

import Prescription from '../../models/Prescription';
import Patient from '../../models/Patient';
import dbConnect from '../../utils/dbConnect';
import Doctor from '../../models/Doctor';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { patient, doctor, diagnosis, drugName, dosage, allergies,signature} = req.body;
    try {
      const newPrescription = await Prescription.create({ patient, doctor, diagnosis, drugName, dosage, allergies,signature});
      await Patient.findByIdAndUpdate(patient, { $push: { prescriptions: newPrescription._id } });
      res.status(201).json(newPrescription);
    } catch (error) {
      console.error('Error creating prescription:', error);
      res.status(500).json({ error: 'Failed to create prescription' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
