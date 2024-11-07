import connectMongoDB from "@/libs/mongodb";
import PatientDetails from "@/models/patientDetails";
import { NextResponse } from "next/server";

// PUT request to update patient details
export async function PUT(request, { params }) {
  const { id } = params;
  const {
    name,
    age,
    email,
    phone,
    address,
    emergencyContact,
    prescriptions,
    medicalHistory,
    allergies,
  } = await request.json();

  await connectMongoDB();

  // Update fields in the PatientDetails model by ID
  await PatientDetails.findByIdAndUpdate(id, {
    name,
    age,
    email,
    phone,
    address,
    emergencyContact,
    prescriptions,
    medicalHistory,
    allergies,
  });

  return NextResponse.json({ message: "Patient details updated" }, { status: 200 });
}

// GET request to retrieve patient details by ID
export async function GET(request, { params }) {
  const { id } = params;

  await connectMongoDB();

  // Find patient by ID
  const patient = await PatientDetails.findOne({ _id: id });

  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  return NextResponse.json({ patient }, { status: 200 });
}
