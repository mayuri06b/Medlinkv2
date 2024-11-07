// pages/api/dashboard.js
import connectDB from '../../../utils/dbConnect';
import Doctor from '../../../models/Doctor';
import authMiddleware from '../../../middleware/authMiddleware';

const handler = async (req, res) => {
  await connectDB();

  authMiddleware(req, res, async () => {
    try {
      const doctor = await Doctor.findById(req.user._id)
        .populate({ path: 'patients', populate: { path: 'prescriptions' } });
      res.status(200).json({ doctor });
    } catch (error) {
      res.status(500).json({ message: "Error fetching dashboard data" });
    }
  });
};

export default handler;
