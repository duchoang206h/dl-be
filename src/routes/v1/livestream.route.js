const express = require('express');
const { livestreamController } = require('../../controllers');
const router = express.Router();
/**
 *  response['HOLE'] = 'Hole ' + hole.hole_num;
  response['PAR_HOLE'] = hole.par;
  response['YARDS'] = hole.yards;

  if (type == 'top') return response;
  response['MAIN'] = hole.main_photo_url;
  response['MAIN1'] = hole.main_photo_url;
  response['PAR'] = statistic[SCORE_TYPE.PAR];
  response['BIRDIE'] = statistic[SCORE_TYPE.BIRDIE];
  response['EAGLE'] = statistic[SCORE_TYPE.EAGLE];
  response['BOGEY'] = statistic[SCORE_TYPE.BOGEY] + statistic[SCORE_TYPE.D_BOGEY];
 * @swagger
 * "/v1/livestream/holes/bottom":
 *   get:
 *     tags: [tagname]
 *     summary: "설명입니다."
 *     consumes: [application/json]
 *     produces: [application/json]
 *     parameters:
 *       - name: "courseId"
 *         description: "Id of course"
 *         in: query
 *         required: true
 *         type: number
 *         example: "1"
 *     responses:
 *       200:
 *         description: "success"
 *         schema:
 *           type: object
 *           properties:
 *             HOLE:
 *               description: "Hole"
 *               type: string
 *               example: "Hole 1"
 *             PAR_HOLE:
 *               description: "Par of hole"  
 *               type: number
 *               example: 5
 *             MAIN: 
 *               description: "Main hole bottom image"  
 *               type: string
 *               example: http://*image.png  
 *             MAIN1:
 *                description: "Main 1 hole bottom image"  
 *               type: string
 *               example: http://*image1.png 
                PAR: 
                 description: "Total par score of hole"  
 *               type: number
 *               example: 10
 *              EAGLE: 
                 description: "Total par score of hole"  
 *               type: number
 *               example: 10
 *              BIRDIE: 
                 description: "Total birdie score of hole"  
 *               type: number
 *               example: 10
 *              BOGEY: 
                 description: "Total bogey score of hole"  
 *               type: number
 *               example: 10
 */
router.get('/holes/bottom', livestreamController.getHoleBottomStatistic);
router.get('/holes/top', livestreamController.getHoleTopStatistic);
router.get('/flights-info', livestreamController.getFlightImage);
router.get('/flights', livestreamController.getFlightStatic);
router.get('/golfers', livestreamController.getGolferDetails);
router.get('/scorecard', livestreamController.scorecardStatic);
router.get('/leaderboard', livestreamController.getLeaderboard);
router.get('/scorecard', livestreamController.getLeaderboard);
router.get('/golfer-in-hole', livestreamController.getGolferInHoleStatistic);
module.exports = router;
