import Navheader from "@/components/Navheader/page";
import { Mail, Phone, MapPin } from 'lucide-react'; // For adding icons

export default function DoctorDashboard() {
    return (
        <>
            <Navheader />
            <div className="container mx-auto text-blue-800 p-6">
                {/* Subheading */}
                <h2 className="text-2xl text-blue-700 font-medium mb-4">Reach Out to Us</h2>
                
                {/* Contact Information */}
                <div className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center space-x-4">
                        <Mail size={24} className="text-blue-600" />
                        <span className="text-lg text-blue-800">Email: <a href="mailto:mayuribarapatre9@gmail.com" className="text-blue-600 hover:underline">mayuribarapatre9@gmail.com</a></span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Phone size={24} className="text-blue-600" />
                        <span className="text-lg text-blue-800">Phone: <a href="tel:+91808053xxxx" className="text-blue-600 hover:underline">+91 808053xxxx</a></span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <MapPin size={24} className="text-blue-600" />
                        <span className="text-lg text-blue-800">Address: Ramdeobaba University, Nagpur</span>
                    </div>
                </div>

                {/* Closing Note */}
                <p className="mt-6 text-lg text-blue-700">We look forward to hearing from you!</p>
            </div>
        </>
    );
}
