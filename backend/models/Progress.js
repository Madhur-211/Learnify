const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  completedLessons: [
    {
      lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
      completedAt: { type: Date, default: Date.now },
    },
  ],
  progressPercentage: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Progress", ProgressSchema);
