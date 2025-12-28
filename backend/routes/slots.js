const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const Game = require("../models/Game");

/* 
   ADMIN → CREATE SLOTS  
 */
router.post("/admin", async (req, res) => {
  try {
    const {
      venueId,
      startDate,
      days = 1,
      openTime,
      closeTime,
      slotDurationMinutes = 60,
      price = 300,
    } = req.body;

    if (!venueId || !startDate || !openTime || !closeTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const game = await Game.findById(venueId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game/Venue not found",
      });
    }

    const gameLocation = game.place;
    const start = new Date(startDate);
    const created = [];

    function addMinutes(timeStr, minutes) {
      const [hh, mm] = timeStr.split(":").map(Number);
      const date = new Date(2000, 0, 1, hh, mm);
      date.setMinutes(date.getMinutes() + Number(minutes));
      return date.toTimeString().slice(0, 5);
    }

    for (let d = 0; d < Number(days); d++) {
      const curr = new Date(start);
      curr.setDate(start.getDate() + d);

      const dateStr = curr.toISOString().split("T")[0];
      const dateObj = new Date(dateStr);

      let cursor = openTime;

      while (true) {
        const endTime = addMinutes(cursor, slotDurationMinutes);

        if (!endTime || endTime <= cursor) break;
        if (endTime > closeTime) break;

        const exists = await Slot.findOne({
          venueId,
          date: dateObj,
          startTime: cursor,
          location: gameLocation,
        });

        if (!exists) {
          const slotDoc = new Slot({
            venueId,
            date: dateObj,
            startTime: cursor,
            slotDurationMinutes: Number(slotDurationMinutes),
            price: Number(price),
            location: gameLocation,
            isBooked: false,
          });

          await slotDoc.save();
          created.push(slotDoc);
        }

        cursor = endTime;
      }
    }

    res.status(201).json({
      success: true,
      created: created.length,
      slots: created,
    });
  } catch (err) {
    console.error("❌ Slot creation error:", err);
    res.status(500).json({
      success: false,
      message: "Slot generation failed",
      error: err.message,
    });
  }
});

/* 
   ADMIN → GET ALL SLOTS FOR VENUE
 */
router.get("/admin/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params;

    const slots = await Slot.find(
      venueId ? { venueId } : {}
    ).sort({ date: 1, startTime: 1 });

    res.json({ success: true, slots });
  } catch (err) {
    console.error("❌ Fetch admin slots error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch slots" });
  }
});

/* 
   ADMIN → DELETE SLOT
 */
router.delete("/admin/:id", async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot)
      return res
        .status(404)
        .json({ success: false, message: "Slot not found" });

    if (slot.isBooked)
      return res.status(400).json({
        success: false,
        message: "Cannot delete a booked slot",
      });

    await Slot.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Slot deleted successfully" });
  } catch (err) {
    console.error("❌ Delete slot error:", err);
    res.status(500).json({ success: false, message: "Failed to delete slot" });
  }
});

/* 
   FRONTEND → GET SLOTS FOR A VENUE + DATE
 */
router.get("/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params;
    let { date, location } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    if (location) location = location.trim();

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const filter = {
      venueId,
      date: { $gte: startOfDay, $lte: endOfDay },
    };

    if (location) filter.location = location;

    const slots = await Slot.find(filter).sort({ startTime: 1 });

    res.json({ success: true, slots });
  } catch (err) {
    console.error("❌ Fetch slots error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
