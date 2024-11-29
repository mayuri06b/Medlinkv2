import connectDB from '../../../utils/dbConnect';
import User from '../../../models/Doctor';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const handler = async (req, res) => {
  await connectDB();
  if (req.method === 'POST') {
    const { name, email, specialty, password } = req.body;
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the user's password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const user = new User({ name, email, specialty, password: hashedPassword });
      await user.save();

      // Generate a JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET , // Use an environment variable for the secret key
        { expiresIn: '1h' } // Token expiration time
      );

      // Return the token and user details
      res.status(201).json({ 
        message: 'User created successfully', 
        token,
        user: { id: user._id, name: user.name, email: user.email, specialty: user.specialty } 
      });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
