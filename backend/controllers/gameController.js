const Game = require("../models/Game");

// Add new game
exports.createGame = async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json({ success: true, game });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all games
exports.getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ success: true, games });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update game
exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!game) return res.status(404).json({ success: false, message: "Game not found" });
    res.json({ success: true, game });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete game
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) return res.status(404).json({ success: false, message: "Game not found" });
    res.json({ success: true, message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }
    res.status(200).json({ success: true, game });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};