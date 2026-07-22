import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    pdfUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// One certificate per student per course
certificateSchema.index(
  {
    user: 1,
    course: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model('Certificate', certificateSchema);
