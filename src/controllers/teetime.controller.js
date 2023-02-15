const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { teetimeSchema } = require('../validations/xlsx.validation');
const { getDataFromXlsx } = require('../services/xlsxService');
const { teetimeService, cacheService, courseService } = require('../services');
const { Player } = require('../models/schema');
const {
  TEETIME_MUST_BE_INCLUDE_ALL_PLAYERS,
  INVALID_GROUP_TIME,
  INVALID_GROUP_TEE,
  INVALID_GOLFER_NAME,
} = require('../utils/errorMessage');
const { BadRequestError } = require('../utils/ApiError');
const { COURSE_TYPE } = require('../config/constant');

const importTeetime = catchAsync(async (req, res) => {
  if (req.files.length <= 0) return res.status(httpStatus.BAD_REQUEST).send();
  const [data, error] = await getDataFromXlsx(req.files[0].buffer, teetimeSchema);
  if (error) throw error;
  const course = await courseService.getCourseById(req.courseId);
  if (course.type === COURSE_TYPE.STOKE_PLAY) {
    const totalPlayers = await Player.count({ where: { course_id: req.params.courseId } });
    if (totalPlayers !== data.length)
      return res.status(httpStatus.BAD_REQUEST).send({ message: TEETIME_MUST_BE_INCLUDE_ALL_PLAYERS });
    if (error) throw error;
    const teetimes = data.map((teetime) => ({
      'name-golfer': teetime['name-golfer'],
      group: teetime['flight'],
      tee: teetime['tee'],
      time: teetime['time'],
    }));
    const playerNames = {};
    const times = {};
    const tees = {};
    for (const teetime of teetimes) {
      if (playerNames.hasOwnProperty(teetime['name-golfer'])) throw new BadRequestError(INVALID_GOLFER_NAME);
      else {
        playerNames[teetime['name-golfer']] = true;
      }
      if (times.hasOwnProperty(teetime['group'])) {
        if (times[teetime['group']] != teetime.time) throw new BadRequestError(INVALID_GROUP_TIME);
      } else times[teetime['group']] = teetime.time;
      if (tees.hasOwnProperty(teetime['group'])) {
        if (tees[teetime['group']] != teetime.tee) throw new BadRequestError(INVALID_GROUP_TEE);
      } else tees[teetime['group']] = teetime.tee;
    }

    const [_, createError] = await teetimeService.createManyTeetime(teetimes, {
      courseId: req.params.courseId,
      roundNum: req.params.roundNum,
    });
    if (createError) return res.status(httpStatus.BAD_REQUEST).send({ message: createError.message });
  }

  res.status(httpStatus.CREATED).send();
});
const getTeetime = catchAsync(async (req, res) => {
  const teetimes = await teetimeService.getTeetimeByCourseAndRound(req.params.courseId, req.params.roundNum);
  cacheService.setCache(req.originalUrl, teetimes);

  return res.status(httpStatus.OK).send({ result: teetimes });
});
module.exports = {
  importTeetime,
  getTeetime,
};
