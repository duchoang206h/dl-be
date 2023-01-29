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
  const totalPlayers = await Player.count({ where: { course_id: req.params.courseId } });
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
    roundNum: req.params.roundNum,
  });
  if (createError) return res.status(httpStatus.BAD_REQUEST).send({ message: createError.message });
  res.status(httpStatus.CREATED).send();
});
const getTeetime = catchAsync(async (req, res) => {
  const teetimes = await teetimeService.getTeetimeByCourseAndRound(req.params.courseId, req.params.roundNum);
  return res.status(httpStatus.OK).send({ result: teetimes });
});
module.exports = {
  importTeetime,
  getTeetime,
};
