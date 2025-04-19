const Course = require("../models/Course");
const User = require("../models/User");  // ✅ Import User model

// 🔹 Get Enrolled Courses (For Students)
exports.getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Create Course (For Teachers Only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // ✅ Ensure all fields are provided
    if (!title || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if the user is a teacher
    const teacher = await User.findById(req.user.id);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. Only teachers can add courses." });
    }

    // ✅ Create course and associate it with the teacher
    const newCourse = new Course({ 
      title, 
      description, 
      category, 
      teacher: req.user.id 
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully!", course: newCourse });

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 Get All Courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email"); // ✅ Fetch teacher info
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
