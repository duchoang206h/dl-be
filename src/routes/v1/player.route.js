const express = require('express');
const { upload } = require('../../middlewares/upload');
const playerController = require('../../controllers/player.controller');
const router = express.Router();
router.post('/import', upload.any(), playerController.importPlayers);
module.exports = router;
