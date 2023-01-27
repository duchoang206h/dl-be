const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { teetimeSchema } = require('../validations/xlsx.validation');
const { getDataFromXlsx } = require('../services/xlsxService');
const { teetimeService } = require('../services');
const { Player } = require('../models/schema');
const { TEETIME_MUST_BE_INCLUDE_ALL_PLAYERS } = require('../utils/errorMessage');

const importTeetime = catchAsync(async (req, res) => {
  if (req.files.length <= 0) return res.status(httpStatus.BAD_REQUEST).send();
  const [data, error] = await getDataFromXlsx(req.files[0].buffer, teetimeSchema);
  const totalPlayers = await Player.count({ where: { course_id: req.param.courseId } });
  if (totalPlayers !== data.length)
    return res.status(httpStatus.BAD_REQUEST).send({ message: TEETIME_MUST_BE_INCLUDE_ALL_PLAYERS });
  if (error) throw error;
  const teetimes = data.map((teetime) => ({
    'name-golfer': teetime['name-golfer'],
    group: teetime['group'],
    tee: teetime['tee'],
    time: teetime['time'],
  }));
  const [_, createError] = await teetimeService.createManyTeetime(teetimes, {
    courseId: req.params.courseId,
    roundId: req.params.roundId,
  });
  if (createError) return res.status(error.status).send();
  res.status(httpStatus.CREATED).send();
});
module.exports = {
  importTeetime,
};
