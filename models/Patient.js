import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Other' }, 
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: { 
    type: String, 
    required: true,
    unique: true, 
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String }
  },
  medicalHistory: { type: String },
  height: {type: Number},
  weight: {type: Number},
  bloodGroup:{type: String},
  profilePicture:{type: String},
  medicalRecords:{type: String},
  haveInsurance:{type: Boolean},
  insuranceCompany:{type: String},
  coverage: {type: Number},
  policyNumber: {type: Number},
  validity:{type: Date},
  insuranceDocument:{type:String},
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }], 
  prescriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' }],
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

