const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    question: { type: String, required: true },
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
      lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
