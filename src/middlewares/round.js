const httpStatus = require('http-status');
const { Round } = require('../models/schema');
const { ROUND_FINISHED } = require('../utils/errorMessage');
const checkRoundFinished = async (req, res, next) => {
  try {
    const { roundNum, courseId } = req.params;
    const round = await Round.findOne({ where: { round_num: roundNum, course_id: courseId } });
    if (!round) return res.status(httpStatus.NOT_FOUND).send();
    if (round.finished === true)
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
        message: ROUND_FINISHED,
      });
    return next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
  }
};
module.exports = {
  checkRoundFinished,
};
