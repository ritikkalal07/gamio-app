const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    slotDurationMinutes: {
      type: Number,
      required: true, // 🔥 MUST BE REQUIRED
    },

    price: {
      type: Number,
      required: true,
    },

    location: {
      type: String,
      required: true, 
    },

    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Slot", slotSchema);
