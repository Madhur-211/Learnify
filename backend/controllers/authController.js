const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        console.log("➡️ Register request received:", req.body);

        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password || !role) {
            console.log("⚠️ Missing required fields");
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // Ensure role is valid
        if (!["student", "teacher"].includes(role)) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("⚠️ User already exists:", email);
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create and save user
        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        console.log("✅ User registered successfully:", user.email);
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log("➡️ Login request received:", req.body);

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        console.log("🧐 User found in DB:", user); // Debugging log
        
        if (!user) {
            console.log("⚠️ Invalid credentials - User not found:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("⚠️ Invalid credentials - Wrong password for:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Debug role before sending
        console.log("🧐 User Role Before Sending:", user.role);

        if (!user.role) {
            return res.status(500).json({ message: "User role is missing in database" });
        }

        // Generate token with role included
        const token = jwt.sign(
            { id: user._id, role: user.role }, // ✅ Ensure role is inside token
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("✅ Login successful:", user.email);
        console.log("✅ Sending role:", user.role);

        res.status(200).json({ 
            token, 
            role: user.role 
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("name email role");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
    } catch (error) {
      console.error("❌ Profile Fetch Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
