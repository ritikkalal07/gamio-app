const express = require("express");
const router = express.Router();
const Booking = require("../models/BookModel");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Store payment details (USER)
router.post("/confirm", protect, async (req, res) => {
  try {
    const { bookingId, transactionId, amount } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    // ensure only owner can confirm payment
    if (booking.email !== req.user.email)
      return res.status(403).json({ success: false, message: "Not authorized" });

    booking.paymentStatus = "Paid";
    booking.transactionId = transactionId;
    booking.amountPaid = amount;
    booking.paymentDate = new Date();

    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error("Payment save error:", error);
    res.status(500).json({ success: false, error: "Failed to save payment" });
  }
});

// Refund (ADMIN ONLY)
router.post("/refund", protect, adminOnly, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("venueId");

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.paymentStatus = "Refunded";
    booking.paymentDate = new Date();
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ message: "Refund failed" });
  }
});

module.exports = router;

// // Store payment details
// router.post("/confirm", async (req, res) => {
//   try {
//     const { bookingId, transactionId, amount } = req.body;

//     await Booking.findByIdAndUpdate(bookingId, {
//       paymentStatus: "Paid",
//       transactionId,
//       amountPaid: amount
//     });

//     res.json({ success: true });
//   } catch (error) {
//     console.error("Payment save error:", error);
//     res.status(500).json({ success: false, error: "Failed to save payment" });
//   }
// });

// router.post("/refund", async (req, res) => {
//   try {
//     const { bookingId } = req.body;

//     const updated = await Booking.findByIdAndUpdate(
//       bookingId,
//       {
//         paymentStatus: "Refunded",
//         paymentDate: new Date(),
//       },
//       { new: true }
//     );

//     res.json({ success: true, updated });
//   } catch (error) {
//     console.error("Refund error:", error);
//     res.status(500).json({ message: "Refund failed" });
//   }
// });


// module.exports = router;
