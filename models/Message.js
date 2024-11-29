// /models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderModel' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverModel' },
    senderModel: { type: String, required: true, enum: ['Patient', 'Doctor'] },
    receiverModel: { type: String, required: true, enum: ['Patient', 'Doctor'] },
    content: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    conversationId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
