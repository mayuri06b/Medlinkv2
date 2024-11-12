'use client'
import PatientForm from "@/components/PatientForm/page";
import LandingDashboard from "@/components/LandingDashboard/page";
import { AuthProvider } from "../../contexts/AuthContext";

export default function Home() {
  return (
    <>
    {/* <PatientForm /> */}
  
      <LandingDashboard />

    </>
  );
}
