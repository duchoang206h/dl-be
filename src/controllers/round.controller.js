const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { Round } = require('../models/schema');
const updateRound = catchAsync(async (req, res) => {
  const { courseId, roundNum } = req.params;
  const { finished } = req.body;
  await Round.update({ finished }, { where: { course_id: courseId, round_num: roundNum } });
  res.status(httpStatus.OK).send();
});
module.exports = {
  updateRound,
};
