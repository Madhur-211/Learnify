const Quiz = require("../models/Quiz");

exports.createQuiz = async (req, res) => {
  try {
    const { lessonId, questions } = req.body;
    const newQuiz = new Quiz({ lessonId, questions });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuizByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const quiz = await Quiz.findOne({ lessonId });
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
