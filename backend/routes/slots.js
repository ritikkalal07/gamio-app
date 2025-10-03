const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

router.get('/', async (req, res) => {
  try {
    const { venueId, date } = req.query;
    if (!venueId || !date) {
      return res.status(400).json({ success: false, message: "Venue ID and date are required." });
    }

    // Convert date string to a Date object
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const slots = await Slot.find({
      venueId: venueId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ startTime: 1 }); 

    res.status(200).json({ success: true, slots });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;