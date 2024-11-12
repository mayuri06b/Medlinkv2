// pages/api/auth/getAppointmentDetails.js
import Appointment from '../../../models/Appointment';
import Patient from '../../../models/Patient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { doctorId } = req.query;

      if (!doctorId) {
        return res.status(400).json({ error: 'Doctor ID is required' });
      }

      // Fetch all appointments for the doctor
      const appointments = await Appointment.find({ doctorId });

      if (appointments.length === 0) {
        return res.status(404).json({ error: 'No appointments found for this doctor' });
      }

      // Log appointments to debug if there are issues
      console.log('Appointments:', appointments);

      // Map the appointments to include the relevant data
      const appointmentDetails = await Promise.all(appointments.map(async (appointment) => {
        // Fetch the patient for each appointment
        const patient = await Patient.findById(appointment.patientId);
        
        // Log the patient to check if it's being fetched properly
        console.log('Patient:', patient);

        if (!patient) {
          console.log('No patient found for appointment:', appointment._id);
          return {
            date: appointment.date,
            time: appointment.time,
            patientName: 'Unknown', // Return 'Unknown' if no patient found
          };
        }

        return {
          date: appointment.date,
          time: appointment.time,
          patientName: patient.name, // Access the patient's name
        };
      }));

      res.status(200).json({ appointments: appointmentDetails });
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      res.status(500).json({ error: 'Failed to fetch appointment details' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
