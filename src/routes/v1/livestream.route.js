const express = require('express');
const { livestreamController } = require('../../controllers');
const router = express.Router();
router.get('/holes', livestreamController.getHoleStatistic);
router.get('/flights/images', livestreamController.getFlightImage);
router.get('/golfers', livestreamController.getGolferDetails);
module.exports = router;
