require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const connectDB = require('./config/db'); // Import database connection
const dotenv = require("dotenv");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(cors());
dotenv.config();
connectDB();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require('./routes/courseRoutes');
const progressRoutes = require("./routes/progressRoutes");
const quizRoutes = require('./routes/quizRoutes');

app.use('/api/auth', authRoutes);   // Authentication (Signup, Login)
app.use("/api/user", userRoutes);
app.use('/api/courses', courseRoutes);  // Course Management
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/progress", progressRoutes);
app.use('/api/quizzes', quizRoutes);    // Quizzes & Exams

// Default Route
app.get('/', (req, res) => {
  res.send('E-Learning Platform Backend is Running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
