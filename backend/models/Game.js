const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String }, 
  description: { type: String },
  place: { type: String, required: true },
  price: { type: Number, required: true },
  players: { type: Number, required: true },

  openingHour: { type: Number, default: 9 },   
  closingHour: { type: Number, default: 22 },  
  slotDuration: { type: Number, default: 4 },  
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
