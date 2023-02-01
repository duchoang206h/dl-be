const express = require('express');
const { livestreamController } = require('../../controllers');
const router = express.Router();
router.get('/holes', livestreamController.getHoleStatistic);
router.get('/flights/images', livestreamController.getFlightImage);
router.get('/flights', livestreamController.getFlightStatic);
router.get('/golfers', livestreamController.getGolferDetails);
router.get('/scorecard', livestreamController.scorecardStatic);
module.exports = router;
