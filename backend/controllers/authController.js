const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");
const { sendOtpEmail } = require("../utils/mailer");

const OTP_EXPIRE_MINUTES = Number(process.env.OTP_EXPIRE_MINUTES || 5);

// helper to create & send OTP
async function createAndSendOtp(userId, email, type = "login") {
  const otp = generateOtp(4);
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

  await Otp.deleteMany({ userId, type });
  await Otp.create({ userId, otpHash, type, expiresAt });
  await sendOtpEmail(email, otp, type === "signup" ? "Signup" : "Login");
}

// -------- SIGNUP --------
exports.signup = async (req, res) => {
  try {
    const { name, email, password, user_type } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.isVerified) {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }
      await createAndSendOtp(existing._id, existing.email, "signup");
      return res.json({
        success: true,
        message: "Account exists but not verified. New OTP sent."
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
      isVerified: false,
      user_type: user_type && ["user", "admin"].includes(user_type) ? user_type : undefined
    });

    await createAndSendOtp(user._id, user.email, "signup");

    return res.json({
      success: true,
      message: "Signup success — OTP sent to email."
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// resend signup OTP
exports.resendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ success: false, message: "Email already verified" });

    await createAndSendOtp(user._id, user.email, "signup");
    return res.json({ success: true, message: "New OTP sent." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// verify signup OTP
exports.verifySignup = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid user" });

    const otpDoc = await Otp.findOne({ userId: user._id, type: "signup" });
    if (!otpDoc) return res.status(400).json({ success: false, message: "OTP not found or expired" });
    if (otpDoc.attempts >= 5) return res.status(400).json({ success: false, message: "Too many attempts" });

    const match = await bcrypt.compare(otp, otpDoc.otpHash);
    if (!match) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    await user.save();
    await otpDoc.deleteOne();

    return res.json({ success: true, message: "Email verified. You can now login." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------- LOGIN --------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Compare password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ success: false, message: "Email not verified." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Respond with success
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, user_type: user.user_type }
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verifyLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid user" });

    const otpDoc = await Otp.findOne({ userId: user._id, type: "login" });
    if (!otpDoc) return res.status(400).json({ success: false, message: "OTP not found or expired" });
    if (otpDoc.attempts >= 5) return res.status(400).json({ success: false, message: "Too many attempts" });

    const match = await bcrypt.compare(otp, otpDoc.otpHash);
    if (!match) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await otpDoc.deleteOne();

    const token = jwt.sign(
      { id: user._id, email: user.email, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email, user_type: user.user_type }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid user" });

    await createAndSendOtp(user._id, user.email, type === "signup" ? "signup" : "login");
    return res.json({ success: true, message: "OTP resent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
