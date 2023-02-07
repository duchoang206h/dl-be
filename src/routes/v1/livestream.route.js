const express = require('express');
const { livestreamController } = require('../../controllers');
const router = express.Router();
/**
 * @swagger
 * "/v1/livestream/holes/bottom":
 *   get:
 */
router.get('/holes/bottom.json', livestreamController.getHoleBottomStatistic);
router.get('/holes/top.json', livestreamController.getHoleTopStatistic);
router.get('/flights-info.json', livestreamController.getFlightImage);
router.get('/flights.json', livestreamController.getFlightStatic);
router.get('/golfers.json', livestreamController.getGolferDetails);
router.get('/golfers/all', livestreamController.getAllGolfer);
router.get('/golfers/bottom.json', livestreamController.getGolferBottom);
router.get('/scorecard.json', livestreamController.scorecardStatic);
router.get('/leaderboard.json', livestreamController.getLeaderboard);
router.get('/golfer-in-hole.json', livestreamController.getGolferInHoleStatistic);
module.exports = router;
