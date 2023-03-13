const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Round, MatchPlayVersus, PlayerFinishRound } = require('../models/schema');
const { courseService } = require('../services');
const { COURSE_TYPE } = require('../config/constant');
const updateRound = catchAsync(async (req, res) => {
  const { courseId, roundNum } = req.params;
  const { finished, matchNum, player_id } = req.body;
  const course = await courseService.getCourseById(courseId);
  if (course.type === COURSE_TYPE.MATCH_PLAY) {
    await MatchPlayVersus.update(
      { finished },
      {
        where: {
          course_id: courseId,
          round_num: roundNum,
          match_num: matchNum,
        },
      }
    );
  } else if (course.type === COURSE_TYPE.STOKE_PLAY) {
    await PlayerFinishRound.upsert(
      {
        round_num: roundNum,
        finished,
        player_id,
      }
    )
  }
  res.status(httpStatus.OK).send();
});
module.exports = {
  updateRound,
};
