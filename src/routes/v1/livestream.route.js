const express = require('express');
const { livestreamController } = require('../../controllers');
const router = express.Router();
/**
 * @swagger
 * "/v1/livestream/holes/bottom":
 *   get:
 */
router.get('/holes/bottom', livestreamController.getHoleBottomStatistic);
router.get('/holes/top', livestreamController.getHoleTopStatistic);
router.get('/flights-info', livestreamController.getFlightImage);
router.get('/flights', livestreamController.getFlightStatic);
router.get('/golfers', livestreamController.getGolferDetails);
router.get('/golfers/all', livestreamController.getAllGolfer);
router.get('/golfers/bottom', livestreamController.getGolferBottom);
router.get('/scorecard', livestreamController.scorecardStatic);
router.get('/leaderboard', livestreamController.getLeaderboard);
router.get('/golfer-in-hole', livestreamController.getGolferInHoleStatistic);
module.exports = router;
