const express = require('express');
const router = express.Router();

const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const xlsx = require("xlsx");
const Game = require("../models/Game");
const { getGames, createGame, updateGame, deleteGame ,getGameById} = require('../controllers/gameController');

router.get('/', getGames);
router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);
router.get('/:id', getGameById); // dd this new route

const upload = multer({ dest: "uploads/" });

// Helper function for validation
function validateGame(game) {
  const requiredFields = ["name", "place", "price", "players"];
  for (let field of requiredFields) {
    if (!game[field] || game[field].toString().trim() === "") {
      return `${field} is required`;
    }
  }

  if (isNaN(game.price) || game.price < 0) return "Price must be a positive number";
  if (isNaN(game.players) || game.players <= 0) return "Players must be a positive number";
  return null;
}

// Bulk upload route
router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExt = req.file.originalname.split(".").pop().toLowerCase();
    let gamesData = [];

    //  PARSE FILE 
    if (fileExt === "csv") {
      const fileContent = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => fileContent.push(row))
        .on("end", async () => {
          await processFile(fileContent, filePath, res);
        });
    } else if (["xlsx", "xls"].includes(fileExt)) {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
      await processFile(data, filePath, res);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: "Invalid file format. Please upload .csv or .xlsx" });
    }
  } catch (err) {
    console.error("Bulk upload error:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// File processing and validation logic
async function processFile(data, filePath, res) {
  try {
    if (!data.length) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: "The file is empty or invalid" });
    }

    const validGames = [];
    const errors = [];

    //  Validate and clean data
    data.forEach((row, index) => {
      const game = {
        name: row.name?.trim(),
        photo: row.photo || "",
        description: row.description || "",
        place: row.place?.trim(),
        price: Number(row.price),
        players: Number(row.players),
      };

      const error = validateGame(game);
      if (error) {
        errors.push(`Row ${index + 2}: ${error}`);
      } else {
        validGames.push(game);
      }
    });

    if (errors.length) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "Validation failed for some rows.",
        errors,
      });
    }

    //  Prevent duplicates (check by name + place)
    const names = validGames.map((g) => g.name);
    const existing = await Game.find({ name: { $in: names } }).lean();

    const existingNames = existing.map((g) => g.name.toLowerCase());
    const uniqueGames = validGames.filter((g) => !existingNames.includes(g.name.toLowerCase()));

    if (uniqueGames.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "All entries already exist in the database.",
      });
    }

    //  Insert only unique and valid entries
    await Game.insertMany(uniqueGames);
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: `${uniqueGames.length} games uploaded successfully.`,
      skipped: validGames.length - uniqueGames.length,
    });
  } catch (err) {
    console.error("Process file error:", err);
    fs.unlinkSync(filePath);
    return res.status(500).json({ success: false, message: "Error processing file" });
  }
}

module.exports = router;
