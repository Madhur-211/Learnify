const Lesson = require("../models/Lesson");

exports.createLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;
    const newLesson = new Lesson({ title, content, courseId });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId });
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
