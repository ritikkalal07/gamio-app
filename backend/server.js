require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const gameRoutes = require('./routes/gameRoutes');
const slotRoutes = require('./routes/slots');
// Models
const Game = require("./models/Game");
const User = require("./models/User");

const app = express();

// Middleware
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
app.use('/api/games', gameRoutes); 
app.use('/api/slots', slotRoutes);
app.use("/api/contact", require("./routes/contact"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Users Routes (MUST be before authRoutes)

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a user
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Auth Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

// Games Routes
app.get("/api/games", async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// OTP Verification
app.post("/api/verify-signup", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    // Return all users to show updated list in frontend
    const allUsers = await User.find();
    return res.json({ success: true, message: "OTP verified successfully!", users: allUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// // server.js
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:3000",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected Successfully"))
//   .catch((err) => {
//     console.error("MongoDB Connection Failed:", err.message);
//     process.exit(1);
//   });

// // Import routes
// const authRoutes = require("./routes/authRoutes");
// app.use("/api", authRoutes);

// // OTP verification route
// app.post("/api/verify-signup", async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ success: false, message: "Email and OTP are required" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (user.otp !== otp) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     // Mark verified
//     user.isVerified = true;
//     user.otp = null; // clear OTP
//     await user.save();

//     return res.json({ success: true, message: "OTP verified successfully!" });

//   } catch (error) {
//     console.error("OTP verification error:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Handle unmatched routes
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Start server
// app.listen(5000, () => {
//   console.log("Server running on http://localhost:5000");
// });