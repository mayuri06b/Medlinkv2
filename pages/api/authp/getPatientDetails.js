// pages/api/authp/getPatientDetails.js
import dbConnect from '../../../utils/dbConnect';
import Patient from '../../../models/Patient'; 
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect();

  const { ids } = req.query;

  if (!ids) {
    return res.status(400).json({ error: 'Patient IDs are required' });
  }

  try {
    const patientIds = Array.isArray(ids) ? ids : ids.split(','); 

    const objectIdArray = patientIds.map(id => {
      if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
        return new mongoose.Types.ObjectId(id); 
      } else {
        console.warn(`Invalid ObjectId: ${id}`); 
        return null; 
      }
    }).filter(id => id !== null); 
    const patients = await Patient.find({ _id: { $in: objectIdArray } });

    return res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    return res.status(500).json({ error: 'Failed to fetch patient details' });
  }
}
