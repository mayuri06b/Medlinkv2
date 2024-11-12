import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema({
  drugName: { type: String},
  dosageAmount: { type: Number},
  dosageUnit: { type: String}, // e.g., mg, ml, tablets
  frequency: { type: String} // e.g., Once a day, Twice a day, etc.
});

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true }, // Reference to Patient document
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, // Reference to Doctor document
  date: { type: Date, default: Date.now, required: true },
  diagnosis: { type: String},
  medications: { type: [MedicationSchema]}, // Array of MedicationSchema objects
  allergies: { type: String },
  condition: { type: String, enum: ['Stable', 'Caution', 'Critical'], default: 'Stable' }, 
  signature: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
