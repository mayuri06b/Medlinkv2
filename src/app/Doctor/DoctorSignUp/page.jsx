'use client';
// Verified 
// Api used (2) auth/signup and auth/login
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Navheader from "@/components/Navheader/page";

const DoctorAuth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setForm({ ...form, specialty: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    const url = isSignUp ? '/api/auth/signup' : '/api/auth/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Authentication failed: ${errorText || 'Please try again.'}`);
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token); 
        router.push('/Doctor/DoctorLanding'); 
      } else {
        alert('Unexpected error: Token not received.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <Navheader />
      </div>
      <Card className="mt-12 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isSignUp ? "Doctor Sign Up" : "Login"}
            </CardTitle>
            <CardDescription>
              {isSignUp ? "Create your account to join our medical network" : "Welcome back! Please log in."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={handleChange} placeholder="Enter your Name" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your Email" required />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select value={form.specialty} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a specialty" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="general">General Practice</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={handleChange} required minLength="4"/>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
            <Button type="button" variant="link" className="text-blue-500 underline" onClick={() => setIsSignUp(!isSignUp)} >
              {isSignUp ? "Already registered? Login" : "Don't have an account? Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default DoctorAuth;
