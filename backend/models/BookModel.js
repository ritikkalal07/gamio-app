const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },

    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },

    date: { type: String, required: true },
    time: { type: String, required: true },

    price: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    transactionId: { type: String, default: null },

    status: {
      type: String,
      enum: ["Confirmed", "Cancelled"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);


// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true }, 
//     email: { type: String, required: true },
//     venue: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
//     date: { type: Date, required: true },
//     time: { type: String, required: true },
//     location: { type: String, required: true },
//     people: { type: Number, default: 1 },
//     price: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["Confirmed", "Cancelled"],
//       default: "Confirmed",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);
