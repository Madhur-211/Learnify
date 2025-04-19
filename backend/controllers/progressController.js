const Progress = require("../models/Progress");

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id,course: req.params.courseId, });
    if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProgress = async (req, res) => {
    try {
        const { userId, courseId, lessonId } = req.body;
      let progress = await Progress.findOne({
        user: req.user.id,
        course: req.body.courseId,
      });
  
      if (!progress) {
        progress = new Progress({
          user: req.user.id,
          course: req.body.courseId,
          completedLessons: [req.body.lessonId],
        });
      } else {
        if (!progress.completedLessons.includes(req.body.lessonId)) {
          progress.completedLessons.push(req.body.lessonId);
        }
      }
  
      progress.progressPercentage = (progress.completedLessons.length / 10) * 100;
      await progress.save();
      res.status(200).json(progress);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  