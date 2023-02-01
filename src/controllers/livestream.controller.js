const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { livestreamService } = require('../services');
const scorecards = catchAsync(async (req, res) => {
  const courseId = req.query.courseId;
  const playerId = req.query.playerId;
});
const getHoleStatistic = catchAsync(async (req, res) => {
  const courseId = req.query.courseId;
  const holeNum = req.query.hole;
  const roundNum = req.query.round;
  const response = await livestreamService.getHoleStatistic({ courseId, holeNum, roundNum });
  res.status(httpStatus.OK).send(response);
});
const getFlightStatistic = catchAsync(async (req, res) => {
  const courseId = req.query.courseId;
  const holeNum = req.query.hole;
  const roundNum = req.query.round;
  const response = await livestreamService.getHoleStatistic({ courseId, holeNum, roundNum });
  res.status(httpStatus.OK).send(response);
});
const getFlightImage = catchAsync(async (req, res) => {
  const courseId = req.query.courseId;
  const flight = req.query.flight;
  const roundNum = req.query.round;
  const response = await livestreamService.getFlightImage({ courseId, flight, roundNum });
  res.status(httpStatus.OK).send(response);
});
const getGolferDetails = catchAsync(async (req, res) => {
  const courseId = req.query.courseId;
  const code = req.query.code;
  const response = await livestreamService.getGolferDetails({ courseId, code });
  res.status(httpStatus.OK).send(response);
});
const getFlightStatic = catchAsync(async (req, res) => {
  const courseId = req.query.courseId;
  const round = req.query.round;
  const flight = req.query.flight;
  const response = await livestreamService.getFlightStatic({ courseId, flight, roundNum: round });
  res.status(httpStatus.OK).send(response);
});
const scorecardStatic = catchAsync(async (req, res) => {
  const courseId = req.query.courseId;
  const round = req.query.round;
  const code = req.query.code;
  const response = await livestreamService.scorecardStatic({ courseId, code, roundNum: round });
  res.status(httpStatus.OK).send(response);
});
module.exports = {
  scorecards,
  getHoleStatistic,
  getFlightImage,
  getGolferDetails,
  getFlightStatic,
  scorecardStatic,
};
