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

/* ------------------------------------
   📌 USER BOOK SLOT
------------------------------------ */
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

    // ------------------------------
    //  PDF Ticket Generation
    // ------------------------------

    const ticketsDir = path.join(__dirname, "../tickets");
    if (!fs.existsSync(ticketsDir)) fs.mkdirSync(ticketsDir);

    const pdfPath = path.join(ticketsDir, `ticket-${booking._id}.pdf`);
    const doc = new PDFDocument({ margin: 40 });

    doc.pipe(fs.createWriteStream(pdfPath));

    // HEADER
    doc
      .fontSize(28)
      .fillColor("#2563eb")
      .text("🎟️ Gamio - Official Game Ticket", { align: "center" });
    doc.moveDown();

    // SEPARATOR
    doc.moveTo(40, doc.y).lineTo(570, doc.y).strokeColor("#2563eb").stroke();
    doc.moveDown();

    // BOOKING INFO
    doc.fontSize(16).fillColor("black").text("Booking Details:", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(14);
    doc.text(`Name: ${username}`);
    doc.text(`Email: ${email}`);
    doc.text(`Game: ${game.name}`);
    doc.text(`Date: ${date}`);
    doc.text(`Time: ${time}`);
    doc.text(`Players: ${people}`);
    doc.text(`Total Price: ₹${price * people}`);

    doc.moveDown();
    doc.text("Thank you for booking with Gamio!", {
      align: "center",
      color: "#2563eb",
    });

    doc.end();

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


// router.post("/book", protect, async (req, res) => {
//   try {
//     const {
//       username,
//       email,
//       venueId,     // FIXED field name
//       date,
//       time,
//       people,
//       price,
//     } = req.body;

//     if (!venueId || !date || !time || !email) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required.",
//       });
//     }

//     // Check if already booked
//     const existing = await Booking.findOne({
//       venueId,
//       date,
//       time,
//       status: { $in: ["Pending", "Confirmed"] },
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "This slot is already booked.",
//       });
//     }

//     const game = await Game.findById(venueId);
//     if (!game)
//       return res.status(404).json({
//         success: false,
//         message: "Game not found.",
//       });

//     const booking = await Booking.create({
//       username,
//       email,
//       venueId,
//       date,
//       time,
//       people,
//       price,
//       status: "Confirmed",
//     });

//     // Mark slot as booked
//     await Slot.findOneAndUpdate(
//       { venueId, date, startTime: time },
//       { isBooked: true }
//     );

//     // Create ticket PDF
//     const ticketsDir = path.join(__dirname, "../tickets");
//     if (!fs.existsSync(ticketsDir)) fs.mkdirSync(ticketsDir);

//     const pdfPath = path.join(ticketsDir, `ticket-${booking._id}.pdf`);
//     const doc = new PDFDocument();
//     doc.pipe(fs.createWriteStream(pdfPath));

//     doc.fontSize(22).fillColor("#2563eb").text("🎟️ Gamio Ticket", {
//       align: "center",
//     });
//     doc.moveDown();
//     doc.fontSize(14).fillColor("black");
//     doc.text(`Name: ${username}`);
//     doc.text(`Email: ${email}`);
//     doc.text(`Game: ${game.name}`);
//     doc.text(`Date: ${date}`);
//     doc.text(`Time: ${time}`);
//     doc.text(`People: ${people}`);
//     doc.text(`Total Price: ₹${price * people}`);
//     doc.end();

//     // Send Email
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: `🎉 Booking Confirmed for ${game.name}`,
//       html: `
//           <h2>Your Booking is Confirmed!</h2>
//           <p>Game: ${game.name}</p>
//           <p>Date: ${date}</p>
//           <p>Time: ${time}</p>
//           <a href="http://localhost:5000/tickets/ticket-${booking._id}.pdf">
//             Download Ticket
//           </a>
//         `,
//       attachments: [
//         { filename: "Gamio-Ticket.pdf", path: pdfPath }
//       ],
//     });

//     res.json({
//       success: true,
//       message: "Booking Confirmed!",
//       booking,
//     });
//   } catch (err) {
//     console.error("BOOKING ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Error processing booking.",
//     });
//   }
// });

/* ------------------------------------
   📌 GET USER BOOKINGS
------------------------------------ */
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email }).populate(
      "venueId"
    );

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching bookings.",
    });
  }
});

/* ------------------------------------
   ❌ CANCEL BOOKING
------------------------------------ */
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("venueId");

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found." });

    if (booking.email !== req.user.email)
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });

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

/* ------------------------------------
   🧹 AUTO DELETE OLD BOOKINGS
------------------------------------ */
setInterval(async () => {
  try {
    const today = new Date().toISOString().split("T")[0];
    await Booking.deleteMany({ date: { $lt: today } });
    console.log("🧹 Old bookings cleaned");
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}, 60 * 60 * 1000);

/* ------------------------------------
   📌 ADMIN — GET ALL BOOKINGS
------------------------------------ */
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
