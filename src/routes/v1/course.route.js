const express = require('express');
const validate = require('../../middlewares/validate');
const fs = require('fs');
const { courseValidation, holeValidation } = require('../../validations');
const {
  courseController,
  holeController,
  userController,
  playerController,
  scoreController,
  teetimeController,
  uploadController,
} = require('../../controllers');
const { checkAminPermission, auth, isSuperAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/upload');
const path = require('path');
const httpStatus = require('http-status');
const { COURSE_TYPE } = require('../../config/constant');
const router = express.Router();
router.post('/', auth, isSuperAdmin, validate(courseValidation.createCourse), courseController.createCourse);
router.post('/:courseId/users', auth, isSuperAdmin, userController.createUser);
router.get('/:courseId', courseController.getCourseById);
router.post('/:courseId/players/import', auth, checkAminPermission, upload.any(), playerController.importPlayers);
router.post(
  '/:courseId/rounds/:roundNum/teetime/import',
  auth,
  checkAminPermission,
  upload.any(),
  teetimeController.importTeetime
);
router.get('/', auth, courseController.getAllCourse);
router.get('/types/all', (_, res) => res.status(httpStatus.OK).send({ result: COURSE_TYPE }));
router.get('/:courseId/players', playerController.getAllPlayer);
router.get('/:courseId/players/:playerId', playerController.getPlayer);
//create hole
router.post(
  '/:courseId/holes',
  auth,
  checkAminPermission,
  validate(holeValidation.createHoleMany),
  holeController.createManyHole
);
router.post('/:courseId/holes/import', auth, checkAminPermission, upload.any(), holeController.importHoles);
router.put(
  '/:courseId/holes/:holeNum',
  auth,
  checkAminPermission,
  validate(holeValidation.updateHole),
  holeController.updateHole
);
router.get('/:courseId/holes', holeController.getHolesByCourseId);
router.get('/:courseId/holes/:holeNum', holeController.getHolesByCourseIdAndHoleNum);

//score
router.get('/:courseId/scores/players/:playerId/rounds/:roundNum', scoreController.getPlayerScoreByRound);
router.get(
  '/:courseId/scores/players/:playerId/rounds/:roundNum/holes/:holeNum',
  scoreController.getPlayerScoreByRoundAndHole
);
router.get('/:courseId/scores/players/:playerId/rounds', scoreController.getPlayerScoreByAllRound);
router.get('/:courseId/scores/players/rounds/:roundNum', scoreController.getAllPlayerScoreByRound);
router.post(
  '/:courseId/scores/players/:playerId/rounds/:roundNum',
  auth,
  checkAminPermission,
  scoreController.createManyScore
);
router.put('/:courseId/scores/players/:playerId/rounds/:roundNum', auth, checkAminPermission, scoreController.updateScore);
// statistic
router.get('/:courseId/statistic/rounds/:roundNum', scoreController.getHoleStatisticByRoundNum);
router.get('/:courseId/statistic/rounds', scoreController.getHoleStatisticByRoundNum);
router.get('/:courseId/statistic', scoreController.getAllStatistic);
router.get('/:courseId/statistic/players/:playerId', scoreController.getAllStatisticByPlayerId);
//teetime
router.get('/:courseId/teetimes/rounds/:roundNum', teetimeController.getTeetime);

// upload
router.get('/images/types', uploadController.getAllImages);
router.post('/:courseId/images/upload', auth, checkAminPermission, upload.any(), uploadController.upload);

// seed
router.get('/:courseId/seed', (req, res) => {
  res.download(path.resolve(__dirname, '..', '..', 'models/teetime_round_1.xlsx'), 'teetime_round_1.xlsx');
});
module.exports = router;
