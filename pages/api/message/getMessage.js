import dbConnect from '../../../utils/dbConnect';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { conversationId} = req.query;

    if (!conversationId) {
      return res.status(400).json({ message: 'Conversation ID is required' });
    }

    const [id1, id2] = conversationId.split('-');
    const reversedConversationId = [id2, id1].join('-');
    try {
      const query = {
        conversationId: { $in: [conversationId, reversedConversationId] },
      };

      const messages = await Message.find(query).sort({ timestamp: 1 });

      console.log("Fetched messages: ", messages);
      return res.status(200).json({ messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
