const express = require("express");
const router = express.Router();
const { getProgress, updateProgress } = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");
const Progress = require("../models/Progress"); 



router.get("/:courseId", authMiddleware, getProgress);
router.post("/update", authMiddleware, updateProgress);
router.get("/", authMiddleware, async (req, res) => {
    try {
        console.log("🔹 User from Middleware:", req.user); // Debugging
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "User ID is missing" });
          }

      const userId = req.user.id;
      const progress = await Progress.find({ user: userId });
      res.json(progress);
    } catch (error) {
        console.error("Error fetching progress:", error.message); // Logs error
      res.status(500).json({ error: "Server error" });
    }
  });
  

module.exports = router;
