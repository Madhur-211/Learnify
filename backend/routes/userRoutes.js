const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import middleware

router.get("/", authMiddleware, getUserProfile); // ✅ Protect this route
router.get("/user", authMiddleware, (req, res) => {
    res.json({ message: "User data retrieved successfully", userId: req.user.id });
  });
  

module.exports = router;
