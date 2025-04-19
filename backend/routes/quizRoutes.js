const express = require('express');
const { createQuiz, getQuizByLesson } = require("../controllers/quizController");
const router = express.Router();
const Quiz = require('../models/Quiz'); // Import Quiz Model

// Get All Quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a New Quiz
router.post('/add', async (req, res) => {
  try {
    const { title, questions } = req.body;
    const newQuiz = new Quiz({ title, questions });
    await newQuiz.save();
    res.status(201).json({ message: 'Quiz added successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/", createQuiz);
router.get("/:lessonId", getQuizByLesson);

module.exports = router;
