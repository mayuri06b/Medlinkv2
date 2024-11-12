'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PatientAuth() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      setError('');
  
      const url = isLogin ? '/api/authp/patientLogin' : '/api/authp/patientSignup';
      const requestBody = isLogin ? { email, password } : { email, password, name, age };
  
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
          });
          const data = await response.json();
          //Setting up patientId to local storage fo easy access
          localStorage.setItem('patientId',data.patientId);
          setLoading(false);
          if (response.ok) {
              if (data.token) {
                  localStorage.setItem('token', data.token);
                  const patientId = data.patientId;
                  console.log(patientId);
                  router.push(`/Patient/PatientLanding?patientId=${patientId}`);
              }
          } else {
              setError(data.message || 'Login failed');
          }
      } catch (error) {
          console.error('An error occurred:', error);
          setError('An error occurred, please try again.');
          setLoading(false);
      }
  };
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-blue-700">
            {isLogin ? 'Patient Login' : 'Patient Signup'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? 'Enter your email and password to access your Medlink account'
              : 'Create your account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Log in' : 'Register'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            variant="link"
            className="text-blue-600 hover:text-blue-700"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create an account' : 'Already have an account? Log in'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

