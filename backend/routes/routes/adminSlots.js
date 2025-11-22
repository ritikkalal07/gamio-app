// routes/adminSlots.js
const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const Game = require("../models/Game");

/* -------------------------------------------------------------------------- */
/* 🛠 Helper: Add minutes to time (HH:MM) */
/* -------------------------------------------------------------------------- */
function addMinutes(timeStr, minutes) {
  const [hh, mm] = timeStr.split(":").map(Number);
  const date = new Date(2000, 0, 1, hh, mm);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 5);
}

/* -------------------------------------------------------------------------- */
/* 🟢 ADMIN: Generate Slots */
/* -------------------------------------------------------------------------- */

router.post("/slots", async (req, res) => {
  try {
    const {
      venueId,
      startDate,
      days,
      dates,
      openTime,
      closeTime,
      slotDurationMinutes = 60,
      price = 300,
      location = "Ahmedabad",
    } = req.body;

    if (!venueId)
      return res
        .status(400)
        .json({ success: false, message: "venueId required" });

    if (!startDate && !dates)
      return res
        .status(400)
        .json({ success: false, message: "startDate or dates required" });

    if (!openTime || !closeTime)
      return res.status(400).json({
        success: false,
        message: "openTime and closeTime required",
      });

    const game = await Game.findById(venueId);
    if (!game)
      return res
        .status(404)
        .json({ success: false, message: "Game/Venue not found" });

    /* -------------------------------------------------------------------------- */
    /* 📅 Build date list */
    /* -------------------------------------------------------------------------- */
    const dateList = [];

    if (Array.isArray(dates) && dates.length > 0) {
      dates.forEach((d) => dateList.push(d));
    } else {
      const count = Number(days) || 1;
      const start = new Date(startDate);

      for (let i = 0; i < count; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dateList.push(d.toISOString().split("T")[0]);
      }
    }

    const createdSlots = [];

    /* -------------------------------------------------------------------------- */
    /* ⏱ Create slots for each date */
    /* -------------------------------------------------------------------------- */
    for (const d of dateList) {
      let cursor = openTime;

      while (true) {
        const endTime = addMinutes(cursor, slotDurationMinutes);

        if (endTime <= cursor) break; // safety
        if (endTime > closeTime) break; // beyond allowed time

        // Check duplicate
        const exists = await Slot.findOne({
          venueId,
          date: d,
          startTime: cursor,
          location,
        });

        if (!exists) {
          const slot = new Slot({
            venueId,
            date: d,
            startTime: cursor,
            price,
            slotDurationMinutes,
            location,
            isBooked: false,
          });

          await slot.save();
          createdSlots.push(slot);
        }

        cursor = endTime;
      }
    }

    res.status(201).json({
      success: true,
      created: createdSlots.length,
      slots: createdSlots,
    });
  } catch (err) {
    console.error("Admin slot generation error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 🟢 ADMIN: Fetch all slots (filtered by venue) */
/* -------------------------------------------------------------------------- */

router.get("/slots", async (req, res) => {
  try {
    const { venueId } = req.query;
    const query = {};

    if (venueId) query.venueId = venueId;

    const slots = await Slot.find(query)
      .populate("venueId", "name")
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, slots });
  } catch (err) {
    console.error("Fetch admin slots error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

/* -------------------------------------------------------------------------- */
/* 🟢 ADMIN: Delete Slot */
/* -------------------------------------------------------------------------- */

router.delete("/slots/:id", async (req, res) => {
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

    res.json({
      success: true,
      message: "Slot deleted successfully",
    });
  } catch (err) {
    console.error("Delete slot error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;
