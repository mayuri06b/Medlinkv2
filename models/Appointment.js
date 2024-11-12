import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Patient',required: true},
    doctorId: {type: mongoose.Schema.Types.ObjectId,ref: 'Doctor',required: true},
    date: {type: Date,required: true},
    time: {type: String,required: true},
    status: {type: String,enum: ['pending', 'accepted', 'rejected'],default: 'pending'},
  },
  { timestamps: true }
);

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

export default Appointment;
