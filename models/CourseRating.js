import mongoose from 'mongoose';

const courseRatingSchema = new mongoose.Schema(
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

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate ratings from same user
courseRatingSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('CourseRating', courseRatingSchema);
