import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { senderId, receiverId, senderModel, receiverModel, content, conversationId } = req.body;

    if (!senderId || !receiverId || !content || !conversationId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const newMessage = await Message.create({
        senderId,
        receiverId,
        senderModel,
        receiverModel,
        content,
        conversationId,
      });

      return res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
