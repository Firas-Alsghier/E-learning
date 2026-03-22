import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: [
    {
      text: String,
      isCorrect: Boolean,
    },
  ],
});

const levelCheckSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    questions: [questionSchema],

    isEnabled: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (value) {
          // ❗ If enabled, must have at least 1 question
          if (value && this.questions.length === 0) {
            return false;
          }
          return true;
        },
        message: 'You must add at least one question to enable Level Check',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('LevelCheck', levelCheckSchema);
