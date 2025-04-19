const express = require("express");
const { createCourse, getCourses } = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Authentication Middleware
const Course = require("../models/Course"); // ✅ Import Course Model
const Enrollment = require("../models/Enrollment"); // ✅ Import Enrollment Model
const User = require("../models/User"); // ✅ Import User Model

const router = express.Router();

// ✅ Get All Courses (Public)
// ✅ Get All Courses (Public)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: "instructor",
      select: "name email", // Fetch only necessary fields
      strictPopulate: false, // Prevents errors if `instructor` is missing
    });

    res.json(courses);
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add a New Course (Only Teachers)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // ✅ Ensure all fields are provided
    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Verify User Role (Only Teachers Can Add Courses)
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. Only teachers can add courses." });
    }

    // ✅ Automatically Assign Instructor
    const newCourse = new Course({ title, description, category, instructor: req.user.id });

    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!", course: newCourse });

  } catch (error) {
    console.error("❌ Error adding course:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a Course (Only the Teacher Who Created It)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Ensure Only the Instructor Can Delete the Course
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. Only the course instructor can delete this course." });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully!" });

  } catch (error) {
    console.error("❌ Error deleting course:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Enrolled Courses (Only for Students)
router.get("/enrolled-courses", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Get Authenticated User ID
    console.log("🧐 Fetching enrolled courses for user:", userId);

    const enrolledCourses = await Enrollment.find({ user: userId }).populate("course");
    res.json(enrolledCourses);

  } catch (error) {
    console.error("❌ Error fetching enrolled courses:", error);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/created-courses", authMiddleware, async (req, res) => {
  try {
      const userId = req.user.id; // Ensure `authMiddleware` sets `req.user`
      const courses = await Course.find({ instructor: userId }); // Fetch courses created by this user
      res.json(courses);
  } catch (error) {
      console.error("❌ Error fetching created courses:", error);
      res.status(500).json({ error: "Server error" });
  }
});
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name"); // ✅ Ensure instructor name is populated
      res.json(courses);
  } catch (error) {
      console.error("❌ Error fetching courses:", error);
      res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
