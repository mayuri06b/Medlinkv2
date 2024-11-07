"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from 'next/navigation';

const DoctorAuth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
    password: "",
  });
  
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setForm({ ...form, specialty: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignUp ? '/api/auth/signup' : '/api/auth/login';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate');
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);  
        if (!isSignUp) {
          router.push('/Doctor/DoctorLanding');
        } else {
          router.push('/Doctor/DoctorLanding');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  return (
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
              <Input id="name" value={form.name} onChange={handleChange} placeholder="Dr. John Doe" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@example.com"
              required
            />
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
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full">
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="text-blue-500 underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already registered? Login" : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default DoctorAuth;
