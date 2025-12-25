import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number },
  order: { type: Number, default: 0 },
  isFreePreview: { type: Boolean, default: false },
});

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    coverImage: String, // still skipped
    price: { type: Number, default: 0 },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    isPublished: { type: Boolean, default: false },
    sections: [sectionSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
