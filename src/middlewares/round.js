const httpStatus = require('http-status');
const { Round, MatchPlayVersus } = require('../models/schema');
const { ROUND_FINISHED, MATCH_FINISHED } = require('../utils/errorMessage');
const { courseService } = require('../services');
const { COURSE_TYPE } = require('../config/constant');
const checkRoundFinished = async (req, res, next) => {
  try {
    const { roundNum, courseId } = req.params;
    const course = await courseService.getCourseById(courseId);
    if (!course) return res.status(httpStatus.NOT_FOUND).send();
    if (course.type === COURSE_TYPE.MATCH_PLAY) {
      const {
        scores: [{ match_num }],
      } = req.body;
      const mpv = await MatchPlayVersus.findOne({
        where: { course_id: courseId, round_num: roundNum, match_num },
      });
      if (mpv && mpv.finished === true)
        return res.status(httpStatus.BAD_REQUEST).send({
          message: MATCH_FINISHED,
        });
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
module.exports = {
  checkRoundFinished,
};
