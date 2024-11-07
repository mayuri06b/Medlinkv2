import dbConnect from '../../utils/dbConnect';
import Doctor from '../../models/Doctor';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        const doctors = await Doctor.find({});
        res.status(200).json(doctors);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
