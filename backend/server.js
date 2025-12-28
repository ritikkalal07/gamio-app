require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

//  ROUTE IMPORTS
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/BookRoutes");
const gameRoutes = require("./routes/gameRoutes");
const slotRoutes = require("./routes/slots");
const contactRoutes = require("./routes/contact");
const paymentRoutes = require("./routes/paymentRoutes");

//  MODELS
const Game = require("./models/Game");
const User = require("./models/User");
const Booking = require("./models/BookModel");

const app = express();


// --------------------- MIDDLEWARE ---------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 🔥 FIXED CORS FOR FRONTEND (IMPORTANT)
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000", 
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(bodyParser.json());


// --------------------- ROUTES ---------------------
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/bookings", bookRoutes);
app.use("/api", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);


// --------------------- MONGODB CONNECTION ---------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });


// --------------------- MULTER SETUP ---------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });


// --------------------- USER MANAGEMENT ---------------------
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


// --------------------- VERIFY SIGNUP OTP ---------------------
app.post("/api/verify-signup", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ success: false, message: "Email and OTP are required" });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

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
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// --------------------- NODEMAILER CONFIG ---------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

let forgotOtpStore = {};


// --------------------- FORGOT PASSWORD ---------------------
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    forgotOtpStore[email] = otp;

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/verify-forgot-otp", (req, res) => {
  const { email, otp } = req.body;

  if (forgotOtpStore[email] == otp) {
    delete forgotOtpStore[email];
    return res.json({ success: true, message: "OTP verified", tempToken: "mock-temp-token" });
  }

  res.status(400).json({ success: false, message: "Invalid OTP" });
});


// --------------------- SMART BOOK ROUTE ---------------------
app.post("/api/smart-book", async (req, res) => {
  try {
    const { username, email, phone, game, location, time, peopleCount } = req.body;

    const existing = await Booking.findOne({ location, time });
    if (existing)
      return res.status(400).json({ success: false, message: "Slot already booked!" });

    const gameData = await Game.findOne({ name: game });
    if (!gameData)
      return res.status(404).json({ success: false, message: "Game not found" });

    const basePrice = gameData.price || 500;
    const totalPrice = basePrice * peopleCount;

    const newBooking = await Booking.create({
      username,
      email,
      phone,
      game,
      location,
      time,
      peopleCount,
      totalPrice,
    });

    // PDF save location (RENDER FIX)
    const pdfPath = path.join("/tmp", `ticket-${Date.now()}.pdf`);

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
      text: `Hi ${username}, your booking is confirmed!`,
      attachments: [{ filename: "Gamio-Ticket.pdf", path: pdfPath }],
    });

    res.json({ success: true, message: "Booking confirmed & email sent!" });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ success: false, message: "Booking failed" });
  }
});


// --------------------- 404 HANDLER ---------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// --------------------- SERVER START ---------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
