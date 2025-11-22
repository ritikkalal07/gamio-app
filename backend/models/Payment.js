const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    venue: String,
    price: Number,
    date: String,
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
