import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'senderType',
    },

    senderType: {
      type: String,
      required: true,
      enum: ['Teacher', 'User'],
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'receiverType',
    },

    receiverType: {
      type: String,
      required: true,
      enum: ['Teacher', 'User'],
    },

    text: {
      type: String,
      default: '',
    },

    attachment: {
      type: String,
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
