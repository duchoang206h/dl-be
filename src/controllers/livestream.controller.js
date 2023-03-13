const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { livestreamService } = require('../services');
const { Player } = require('../models/schema');
const getAllGolfer = catchAsync(async (req, res) => {
  const { courseId } = req.query;
  const players = await Player.findAll({
    where: { course_id: courseId },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  return res.status(httpStatus.OK).send({
    golfers: players,
  });
});
const getGolferBottom = catchAsync(async (req, res) => {
  const { courseId, code } = req.query;
  const response = await livestreamService.getGolferBottom({ courseId, code });
  res.status(httpStatus.OK).send(response);
});
const getHoleBottomStatistic = catchAsync(async (req, res) => {
  const { courseId, hole, round } = req.query;
  const response = await livestreamService.getHoleStatistic({ courseId, holeNum: hole, roundNum: round, type: 'bottom' });
  res.status(httpStatus.OK).send(response);
});
const getHoleTopStatistic = catchAsync(async (req, res) => {
  const { courseId, hole, round } = req.query;
  const response = await livestreamService.getHoleStatistic({ courseId, holeNum: hole, roundNum: round, type: 'top' });
  res.status(httpStatus.OK).send(response);
});
const getFlightStatistic = catchAsync(async (req, res) => {
  const { courseId, hole, round } = req.query;
  const response = await livestreamService.getHoleStatistic({ courseId, holeNum: hole, roundNum: round });
  res.status(httpStatus.OK).send(response);
});
const getFlightImage = catchAsync(async (req, res) => {
  const { courseId, flight, round } = req.query;
  const response = await livestreamService.getFlightStatic({ courseId, flight, roundNum: round });
  res.status(httpStatus.OK).send(response);
});
const getGolferDetails = catchAsync(async (req, res) => {
  const { courseId, code } = req.query;
  const response = await livestreamService.getGolferDetails({ courseId, code });
  res.status(httpStatus.OK).send(response);
});
const getFlightStatic = catchAsync(async (req, res) => {
  const { courseId, round, flight } = req.query;
  const response = await livestreamService.getFlightStatic({ courseId, flight, roundNum: round });
  res.status(httpStatus.OK).send(response);
});
const scorecardStatic = catchAsync(async (req, res) => {
  const { courseId, code, round, match } = req.query;
  const response = await livestreamService.scorecardStatic({ courseId, code, roundNum: round, matchNum: match });
  res.status(httpStatus.OK).send(response);
});
const getLeaderboard = catchAsync(async (req, res) => {
  const { courseId, round, type } = req.query;
  const response = await livestreamService.getLeaderboard({ courseId, roundNum: round, type });
  res.status(httpStatus.OK).send(response);
});
const getGolferInHoleStatistic = catchAsync(async (req, res) => {
  const { courseId, code } = req.query;
  const response = await livestreamService.getGolferInHoleStatistic({ courseId, code });
  res.status(httpStatus.OK).send(response);
});
const getMatchPlayVersus = catchAsync(async (req, res) => {
  const { courseId, round, match } = req.query;
  const response = await livestreamService.getMatchPlayVersus({ courseId, roundNum: round, matchNum: match });
  res.status(httpStatus.OK).send(response);
});
module.exports = {
  getHoleBottomStatistic,
  getHoleTopStatistic,
  getFlightImage,
  getGolferDetails,
  getFlightStatic,
  scorecardStatic,
  getLeaderboard,
  getGolferInHoleStatistic,
  getGolferBottom,
  getAllGolfer,
  getMatchPlayVersus,
};
