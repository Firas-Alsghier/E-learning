import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    // Student who bought the course
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Purchased course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    // Course owner
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },

    // Price paid
    pricePaid: {
      type: Number,
      required: true,
    },

    // Payment status
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    // Stripe information (filled after payment)
    stripeSessionId: {
      type: String,
      default: '',
    },

    stripePaymentIntentId: {
      type: String,
      default: '',
    },

    // Purchase date
    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    // Access expiration
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

purchaseSchema.index({
  user: 1,
  course: 1,
});
export default mongoose.model('Purchase', purchaseSchema);
