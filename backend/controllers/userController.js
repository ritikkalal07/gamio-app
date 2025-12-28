const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp"); // Ensure you have this model, or remove if unused
const nodemailer = require("nodemailer");

// --- Helper: Generate OTP ---
const generateOtp = (length) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

// --- Helper: Send Email ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOtpEmail(email, otp, type) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${type} OTP - Gamio`,
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });
  } catch (error) {
    console.error("Email error:", error);
  }
}

// --- CONTROLLERS ---

exports.signup = async (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;
    
    // Check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      user_type: user_type || "user",
      isVerified: true, // Auto-verify for now to simplify testing
    });

    res.json({ success: true, message: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3. Generate Token
    const token = jwt.sign(
      { id: user._id, role: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Send Response
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.name,
        email: user.email,
        role: user.user_type, // "admin" or "user"
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add placeholders for other functions to prevent crashes if routes call them
exports.verifySignup = (req, res) => res.json({ success: true });
exports.resendSignupOtp = (req, res) => res.json({ success: true });
exports.verifyLogin = (req, res) => res.json({ success: true });
exports.resendOtp = (req, res) => res.json({ success: true });
exports.forgotPassword = (req, res) => res.json({ success: true });
exports.verifyForgotOtp = (req, res) => res.json({ success: true });
exports.resetPassword = (req, res) => res.json({ success: true });