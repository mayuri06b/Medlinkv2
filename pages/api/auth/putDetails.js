import dbConnect from '../../../utils/dbConnect';
import Doctor from '../../../models/Doctor';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const { method } = req;
  if (method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    const { id, specialty, email, phone, experience, education, certifications, image } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid doctor ID' });
    }
    const objectId = new mongoose.Types.ObjectId(id);
    const certificationsArray = Array.isArray(certifications) ? certifications : certifications.split(',');
    console.log('Request Body:', req.body);
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      objectId,
      {
        specialty,
        email,
        phone,
        experience,  
        education,
        certifications: certificationsArray, 
        image,
      },
      { new: true, runValidators: true }
    );
    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: updatedDoctor });
  } catch (error) {
    console.error('Error updating doctor profile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
