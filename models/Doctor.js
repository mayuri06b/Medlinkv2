// models/Doctor.js
import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialty: { type: String, required: true },
    password: { type: String, required: true },
    availability: {
      type: [
        {
          day: { type: String },
          times: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    phone: { type: String, default: '' },
    education: { type: String, default: '' },
    certifications: { type: [String], default: [] },
    image: { type: String, default: '' },
    experience: {type: String, default: ''},
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  },
  { timestamps: true }
);

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
