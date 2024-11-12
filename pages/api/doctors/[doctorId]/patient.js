// Import necessary dependencies
import dbConnect from '../../../../utils/dbConnect'; 
import Doctor from '../../../../models/Doctor'; 
import Patient from '../../../../models/Patient'; 

export default async function handler(req, res) {
  const { doctorId } = req.query; 
  await dbConnect(); 
  try {
    const doctor = await Doctor.findById(doctorId).select('patients');

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const patients = await Patient.find({
      _id: { $in: doctor.patients },
    });

    res.status(200).json({ patients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
