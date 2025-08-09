const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
require("dotenv").config();

// User Registration Controller
exports.register = async (req, res) => {
  try {
    // 1. Validate request body
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "All fields (name, email, password) are required" 
      });
    }

        if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role specified'
      });
    }

    // 2. Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: "Email already registered" 
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "patient"
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Return response
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      },
      message: "Registration successful"
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      success: false,
      error: "Registration failed. Please try again." 
    });
  }
};

// User Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required"
      });
    }

    // 2. Find user (including password field)
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials" // Generic message for security
      });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials" // Same message as above
      });
    }

    // 4. Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Return response
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      },
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Login failed. Please try again."
    });
  }
};