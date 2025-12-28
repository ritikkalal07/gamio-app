const express = require("express");
const router = express.Router();
const Booking = require("../models/BookModel.js");
const Game = require("../models/Game.js");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { protect } = require("../middleware/authMiddleware.js");
const Slot = require("../models/Slot");

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* -------------------------------------------------------------------------- */
/* USER BOOK SLOT                              */
/* -------------------------------------------------------------------------- */
router.post("/book", protect, async (req, res) => {
  try {
    const {
      username,
      email,
      venueId,
      date,
      time,
      people,
      price,
    } = req.body;

    if (!venueId || !date || !time || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check existing booking for same slot
    const existing = await Booking.findOne({
      venueId,
      date,
      time,
      status: { $in: ["Pending", "Confirmed"] },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked.",
      });
    }

    // Get game details
    const game = await Game.findById(venueId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found.",
      });
    }

    // Create booking
    const booking = await Booking.create({
      username,
      email,
      venueId,
      date,
      time,
      people,
      price,
      status: "Confirmed",
    });

    // Mark slot as booked
    await Slot.findOneAndUpdate(
      { venueId, date, startTime: time },
      { isBooked: true }
    );

    // ---------------------------------------------------------
    //  PROFESSIONAL PDF TICKET GENERATION
    // ---------------------------------------------------------

    const ticketsDir = path.join(__dirname, "../tickets");
    if (!fs.existsSync(ticketsDir)) fs.mkdirSync(ticketsDir);

    const pdfPath = path.join(ticketsDir, `ticket-${booking._id}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(fs.createWriteStream(pdfPath));

    // --- DESIGN CONSTANTS ---
    const primaryColor = "#4ECDC4"; // Gamio Brand Color
    const secondaryColor = "#444444";
    const lightGray = "#f4f4f4";
    const lineGrey = "#aaaaaa";

    // --- HELPER FUNCTIONS ---
    function generateHr(doc, y) {
      doc
        .strokeColor(lightGray)
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
    }

    function formatCurrency(amount) {
      return "₹" + amount.toFixed(2);
    }

    // 1. HEADER SECTION

    // Brand Logo/Text (Left)
    doc
      .fillColor(primaryColor)
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("GAMIO", 50, 45)
      .fontSize(10)
      .text("Sports Booking Platform", 50, 75)
      .text("support@gamio.com", 50, 90)
      .moveDown();

    // Ticket Info (Right)
    doc
      .fillColor(secondaryColor)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("TICKET ID:", 400, 50)
      .font("Helvetica")
      .text(booking._id.toString().toUpperCase().slice(-8), 400, 65) // Showing last 8 chars
      .font("Helvetica-Bold")
      .text("BOOKING DATE:", 400, 85)
      .font("Helvetica")
      .text(new Date().toLocaleDateString(), 400, 100)
      .moveDown();

    generateHr(doc, 130);

    // 2. CUSTOMER & EVENT DETAILS (2 Columns)
    const customerTop = 150;

    doc
      .fillColor(secondaryColor)
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Billed To:", 50, customerTop);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(username, 50, customerTop + 20)
      .text(email, 50, customerTop + 35)
      .moveDown();

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Session Details:", 300, customerTop);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Date: ${date}`, 300, customerTop + 20)
      .text(`Time: ${time}`, 300, customerTop + 35)
      .moveDown();


    // 3. BOOKING TABLE
    const tableTop = 240;
    const itemCodeX = 50;
    const descX = 100; // Description
    const quantityX = 330; // Players
    const priceX = 400; // Price
    const amountX = 480; // Total

    // Table Header Background
    doc
      .rect(50, tableTop, 500, 25)
      .fill(primaryColor)
      .stroke();

    // Table Header Text
    doc
      .fontSize(10)
      .fillColor("#fff")
      .font("Helvetica-Bold")
      .text("#", itemCodeX + 5, tableTop + 8)
      .text("Game Description", descX, tableTop + 8)
      .text("Players", quantityX, tableTop + 8)
      .text("Price/Person", priceX, tableTop + 8)
      .text("Total", amountX, tableTop + 8);

    // Table Row (The Booking)
    const rowY = tableTop + 35;
    const lineTotal = price * people;

    doc
      .fontSize(10)
      .fillColor(secondaryColor)
      .font("Helvetica")
      .text("1", itemCodeX + 5, rowY)
      .text(game.name, descX, rowY)
      .text(people.toString(), quantityX, rowY)
      .text(formatCurrency(price), priceX, rowY)
      .font("Helvetica-Bold")
      .text(formatCurrency(lineTotal), amountX, rowY);

    // Line under the row
    generateHr(doc, rowY + 20);


    // 4. TOTALS SECTION
    const subtotalY = rowY + 40;

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Subtotal", 400, subtotalY)
      .text(formatCurrency(lineTotal), 480, subtotalY);

    doc
      .fontSize(10)
      .text("Tax (0%)", 400, subtotalY + 15)
      .text("₹0.00", 480, subtotalY + 15);

    generateHr(doc, subtotalY + 30);

    // Grand Total
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor(primaryColor)
      .text("Grand Total", 400, subtotalY + 45)
      .text(formatCurrency(lineTotal), 480, subtotalY + 45);


    // 5. FOOTER & QR PLACEHOLDER
    const footerTop = 650;

    // Optional: Placeholder box for QR Code or Barcode
    doc
      .roundedRect(50, footerTop, 50, 50, 2)
      .strokeColor(lineGrey)
      .stroke();
    doc
      .fontSize(8)
      .fillColor(lineGrey)
      .text("QR", 68, footerTop + 20);

    // Terms
    doc
      .fontSize(10)
      .fillColor(secondaryColor)
      .font("Helvetica-Bold")
      .text("Important Instructions:", 120, footerTop)
      .font("Helvetica")
      .fontSize(8)
      .text("1. Please arrive 15 minutes before your scheduled slot.", 120, footerTop + 15)
      .text("2. Show this ticket at the venue counter for entry.", 120, footerTop + 28)
      .text("3. Cancellations are subject to venue policy.", 120, footerTop + 41);

    // Bottom Copyright
    doc
      .fontSize(8)
      .fillColor(lineGrey)
      .text(`© ${new Date().getFullYear()} Gamio. All Rights Reserved.`, 50, 750, { align: "center", width: 500 });

    doc.end();

    // ---------------------------------------------------------
    //  EMAIL GENERATION
    // ---------------------------------------------------------

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        <div style="
          max-width:600px;
          margin:auto;
          background:white;
          padding:25px;
          border-radius:10px;
          box-shadow:0 4px 12px rgba(0,0,0,0.1);
          border-top:6px solid #2563eb;
        ">

          <h2 style="color:#2563eb; text-align:center; margin-bottom:5px;">
            🎉 Booking Confirmed!
          </h2>
          <p style="text-align:center; color:#555; margin-top:0;">
            Thank you for choosing <strong>Gamio</strong>
          </p>

          <hr style="border:none; height:1px; background:#ddd; margin:20px 0;" />

          <p style="color:#444; font-size:15px;">
            Hi <strong>${username}</strong>,<br/><br/>
            Your booking has been successfully confirmed. Below are your details:
          </p>

          <div style="
            background:#f0f7ff;
            padding:15px 20px;
            border-left:4px solid #2563eb;
            border-radius:6px;
            margin-bottom:20px;
          ">
            <p><strong>Game:</strong> ${game.name}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Players:</strong> ${people}</p>
            <p><strong>Total Price:</strong> ₹${price * people}</p>
          </div>

          <div style="text-align:center; margin:25px 0;">
            <a href="http://localhost:5000/tickets/ticket-${booking._id}.pdf"
              style="
                background:#2563eb;
                padding:12px 20px;
                color:white;
                text-decoration:none;
                font-size:16px;
                font-weight:bold;
                border-radius:6px;
                display:inline-block;
              ">
              Download Your Ticket 🎟️
            </a>
          </div>

          <hr style="border:none; height:1px; background:#ddd; margin:25px 0;" />

          <p style="font-size:13px; color:#777; text-align:center;">
            For assistance, feel free to reply to this email.<br/>
            Thank you for gaming with <strong>Gamio</strong>! 🎮
          </p>

          <p style="text-align:center; font-size:12px; color:#aaa; margin-top:30px;">
            © ${new Date().getFullYear()} Gamio • All Rights Reserved
          </p>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🎉 Booking Confirmed — ${game.name} | Gamio`,
      html: emailHtml,
      attachments: [{ filename: "Gamio-Ticket.pdf", path: pdfPath }],
    });

    res.json({
      success: true,
      message: "Booking confirmed and Email sent successfully!",
      booking,
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error while processing booking.",
    });
  }
});


/* -------------------------------------------------------------------------- */
/* 📌 GET USER BOOKINGS                              */
/* -------------------------------------------------------------------------- */
router.get("/", protect, async (req, res) => {
  try {
    // ✅ CRASH FIX: Check if req.user exists before accessing property
    if (!req.user || !req.user.email) {
      console.error("GET Bookings: req.user or req.user.email is missing");
      return res.status(401).json({ 
        success: false, 
        message: "User not identified in token." 
      });
    }

    // ✅ Find bookings by email
    const bookings = await Booking.find({ email: req.user.email })
      .populate("venueId")
      .sort({ date: -1 });

    res.json({ success: true, bookings });

  } catch (err) {
    console.error("Fetch Bookings Error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings from server.",
      error: err.message
    });
  }
});


/* -------------------------------------------------------------------------- */
/* ❌ CANCEL BOOKING                               */
/* -------------------------------------------------------------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("venueId");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (booking.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    booking.status = "Cancelled";
    await booking.save();

    await Slot.findOneAndUpdate(
      { venueId: booking.venueId, date: booking.date, startTime: booking.time },
      { isBooked: false }
    );

    res.json({ success: true, message: "Booking cancelled." });
  } catch (err) {
    console.error("Cancel Error:", err);
    res.status(500).json({
      success: false,
      message: "Error cancelling booking.",
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🧹 AUTO DELETE OLD BOOKINGS                         */
/* -------------------------------------------------------------------------- */
setInterval(async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    await Booking.deleteMany({ date: { $lt: today } });
    console.log("🧹 Old bookings cleaned");
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}, 60 * 60 * 1000);

/* -------------------------------------------------------------------------- */
/* 📌 ADMIN — GET ALL BOOKINGS                        */
/* -------------------------------------------------------------------------- */
router.get("/all", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("venueId")
      .sort({ date: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("ADMIN Fetch Error:", err);
    res.status(500).json({
      success: false,
      message: "Error loading bookings.",
    });
  }
});

module.exports = router;