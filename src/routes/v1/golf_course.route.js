const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const fs = require('fs');
const { courseValidation, holeValidation, playerValidation, golfCourseValidation } = require('../../validations');
const {
  courseController,
  holeController,
  userController,
  playerController,
  scoreController,
  teetimeController,
  uploadController,
  golfCourseController,
} = require('../../controllers');
const { auth, checkAminPermission } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/upload');
router.post('/', auth, validate(golfCourseValidation.createGolfCourse), golfCourseController.createGolfCourse);
router.get('/', auth, golfCourseController.getAllGolfCourses);
router.get('/:golfCourseId', auth, golfCourseController.getGolfCourseById);
router.post('/:golfCourseId/holes/import', auth, upload.any(), holeController.importHoles);
module.exports = router;
