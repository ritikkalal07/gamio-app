const express = require('express');
const router = express.Router();
const { getGames, createGame, updateGame, deleteGame ,getGameById} = require('../controllers/gameController');

router.get('/', getGames);
router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);
router.get('/:id', getGameById); // Add this new route

module.exports = router;
