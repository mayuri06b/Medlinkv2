import mongoose, { Schema } from "mongoose";

const patientDetailsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      match: [
        /^\d{10}$/,
        "Please fill a valid phone number",
      ],
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: {
        type: String,
        match: [/^\d{5}$/, "Please enter a valid postal code"],
      },
      country: { type: String, trim: true, default: "USA" },
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: {
        type: String,
        match: [
          /^\d{10}$/,
          "Please fill a valid phone number",
        ],
      },
    },
    prescriptions: [
      {
        medicineName: { type: String, required: true, trim: true },
        dosage: { type: String, trim: true },
        frequency: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
        notes: { type: String, trim: true },
      },
    ],
    medicalHistory: [
      {
        condition: { type: String, trim: true },
        diagnosisDate: { type: Date },
        notes: { type: String, trim: true },
      },
    ],
    allergies: [
      {
        allergen: { type: String, trim: true },
        reaction: { type: String, trim: true },
        severity: { type: String, enum: ["mild", "moderate", "severe"], trim: true },
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const PatientDetails = mongoose.models.PatientDetails || mongoose.model("PatientDetails", patientDetailsSchema);

export default PatientDetails;
