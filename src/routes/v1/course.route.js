const express = require('express');
const validate = require('../../middlewares/validate');
const { courseValidation, holeValidation } = require('../../validations');
const { courseController, holeController, userController, playerController, scoreController } = require('../../controllers');
const { checkAminPermission, auth, isSuperAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/upload');
const router = express.Router();
router.post('/', auth, validate(courseValidation.createCourse), courseController.createCourse);
router.post('/:courseId/users', auth, isSuperAdmin, userController.createUser);
router.get('/:courseId', courseController.getCourseById);
router.post('/:courseId/players', auth, checkAminPermission, upload.any(), playerController.importPlayers);
router.get('/', auth, isSuperAdmin, courseController.getAllCourse);
router.get('/:courseId/players', playerController.getAllPlayer);
router.get('/:courseId/players/:playerId', playerController.getPlayer);
//create hole
router.post('/:courseId/holes', auth, validate(holeValidation.createHole), holeController.createHole);
router.put('/:courseId/holes/:holeNum', auth, validate(holeValidation.updateHole), holeController.updateHole);
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
router.post('/:courseId/scores/players/:playerId', scoreController.createManyScore);
router.put('/:courseId/scores/players/:playerId', scoreController.updateScore);
// statistic
router.get('/:courseId/statistic/rounds/:roundNum', scoreController.getHoleStatisticByRoundNum);
router.get('/:courseId/statistic/rounds', scoreController.getHoleStatisticByRoundNum);
module.exports = router;
