require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const { protect } = require("./middleware/authMiddleware.js");

// ---------------- ROUTE IMPORTS ----------------
const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/BookRoutes.js");
const gameRoutes = require("./routes/gameRoutes.js");
const slotRoutes = require("./routes/slots.js"); 
const contactRoutes = require("./routes/contact.js");
const paymentRoutes = require("./routes/paymentRoutes");
// ---------------- MODELS ----------------
const Game = require("./models/Game.js");
const User = require("./models/User.js");
const Booking = require("./models/BookModel.js");
const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(bodyParser.json());

// ---------------- ROUTES ----------------
app.use("/api/games", gameRoutes);
app.use("/api/slots", slotRoutes); 
app.use("/api/bookings", bookRoutes);
app.use("/api", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);

// ---------------- MONGODB CONNECTION ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error(" MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// ---------------- MULTER SETUP ----------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ---------------- USER MANAGEMENT ROUTES ----------------
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------------- VERIFY SIGNUP OTP ----------------
app.post("/api/verify-signup", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const allUsers = await User.find();
    return res.json({
      success: true,
      message: "OTP verified successfully!",
      users: allUsers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

// ---------------- NODEMAILER CONFIG ----------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

let forgotOtpStore = {};

// ---------------- FORGOT PASSWORD ----------------
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    forgotOtpStore[email] = otp;
    console.log(`Forgot OTP for ${email}: ${otp}`);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/verify-forgot-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP required" });

    if (forgotOtpStore[email] && forgotOtpStore[email] == otp) {
      delete forgotOtpStore[email];
      const tempToken = "mock-temp-token";
      return res.json({
        success: true,
        message: "OTP verified",
        tempToken,
      });
    }

    res.status(400).json({ success: false, message: "Invalid OTP" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password)
      return res
        .status(400)
        .json({ success: false, message: "Password required" });

    console.log(`Password reset for token ${token}: ${password}`);
    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- SMART BOOK ROUTE ----------------
app.post("/api/smart-book", async (req, res) => {
  try {
    const { username, email, phone, game, location, time, peopleCount } =
      req.body;

    const existing = await Booking.findOne({ location, time });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Slot already booked for that time!",
        });
    }

    const gameData = await Game.findOne({ name: game });
    if (!gameData) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }

    const basePrice = gameData.price || 500;
    const totalPrice = basePrice * peopleCount;

    const newBooking = new Booking({
      username,
      email,
      phone,
      game,
      location,
      time,
      peopleCount,
      totalPrice,
    });
    await newBooking.save();

    const pdfPath = `./ticket-${Date.now()}.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(20).text("Gamio Booking Confirmation", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${username}`);
    doc.text(`Game: ${game}`);
    doc.text(`Location: ${location}`);
    doc.text(`Time: ${time}`);
    doc.text(`People: ${peopleCount}`);
    doc.text(`Total Price: ₹${totalPrice}`);
    doc.moveDown();
    doc.text("Thank you for booking with Gamio!", { align: "center" });
    doc.end();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Gamio Booking Confirmation 🎉",
      text: `Hi ${username}, your booking for ${game} at ${location} is confirmed!\nTime: ${time}\nTotal: ₹${totalPrice}`,
      attachments: [{ filename: "Gamio-Ticket.pdf", path: pdfPath }],
    });

    res
      .status(201)
      .json({ success: true, message: "Booking confirmed & email sent!" });
  } catch (err) {
    console.error("Booking Error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Booking failed",
        error: err.message,
      });
  }
});

// ---------------- 404 ROUTE ----------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
