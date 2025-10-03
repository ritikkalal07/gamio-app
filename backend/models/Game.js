const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String }, // store URL or file path
  description: { type: String },
  place: { type: String, required: true },
  price: { type: Number, required: true },
  players: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
