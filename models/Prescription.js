import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // Reference to Patient document
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, // Reference to Doctor document
  date: { type: Date, default: Date.now, required: true },
  diagnosis: { type: String, required: true },
  drugName: { type: String, required: true },
  dosage: { type: String, required: true },
  allergies: { type: String }, 
  signature: { type: String, required: ture} ,
}, { timestamps: true });

export default mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
