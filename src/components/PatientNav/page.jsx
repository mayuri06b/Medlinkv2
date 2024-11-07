import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center border-b bg-primary px-4 lg:px-6 text-white bg-blue-600">
        <Link className="flex items-center justify-center" href="/dashboard">
          <span className="text-lg font-bold text-primary-foreground">
            Patient Dashboard
          </span>
        </Link>
        <nav className="ml-auto flex items-center space-x-4">
          <Link href="/Patient/PatientLanding">
            <Button variant="ghost" className="text-primary-foreground">
              Prescriptions
            </Button>
          </Link>
          <Link href="/Patient/PatientReminders">
            <Button variant="ghost" className="text-primary-foreground">
              Reminders
            </Button>
          </Link>
          <Link href="/Patient/BookAppointment">
            <Button variant="ghost" className="text-primary-foreground">
              Appointment
            </Button>
          </Link>
          <Link href="/Patient/PatientMessage">
            <Button variant="ghost" className="text-primary-foreground">
              Messages
            </Button>
          </Link>
        </nav>
      </header>
    </div>
  );
}
