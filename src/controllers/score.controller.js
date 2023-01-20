const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { getDataFromXlsx } = require('../services/xlsxService');
const { playerSchema } = require('../validations/xlsx.validation');
const { playerService, roundService, scoreService } = require('../services');
const getPlayerScoreByAllRound = catchAsync(async (req, res) => {
  const scores = await scoreService.getPlayerScoresByAllRound(req.params.courseId, req.params.playerId);
  res.status(httpStatus.OK).send({
    result: scores,
  });
});
const getAllPlayerScoreByRound = catchAsync(async (req, res) => {
  const round = await roundService.getRoundByNumAndCourse(req.params.roundNum, req.params.courseId);
  if (!round) return res.status(httpStatus.NOT_FOUND).send();
  const scores = await scoreService.getAllPlayerScoreByRoundId(round.round_id, req.params.courseId);
  return res.status(httpStatus.OK).send({ result: scores });
});
const getHoleStatisticByRoundNum = catchAsync(async (req, res) => {
  const round = await roundService.getRoundByNumAndCourse(req.params.roundNum, req.params.courseId);
  if (!round) return res.status(httpStatus.NOT_FOUND).send();
  const scores = await scoreService.getHoleStatisticByRound({
    courseId: req.params.courseId,
    roundId: round.round_id,
  });
  return res.status(httpStatus.OK).send({ result: scores });
});
const getPlayerScoresByAllRound = catchAsync(async (req, res) => {
  const scores = await scoreService.getPlayerScoresByAllRound(req.params.courseId);

  return res.status(httpStatus.OK).send({ result: scores });
});
const getPlayerScoreByRound = catchAsync(async (req, res) => {
  const round = await roundService.getRoundByNumAndCourse(req.params.roundNum, req.params.courseId);
  if (!round) return res.status(httpStatus.NOT_FOUND).send();
  const scores = await scoreService.getScoresByPlayerAndRound({
    courseId: req.params.courseId,
    playerId: req.params.playerId,
    roundId: round.round_id,
  });
  return res.status(httpStatus.OK).send({ result: scores });
});
const createScore = catchAsync(async (req, res) => {
  const score = await scoreService.createScore({
    ...req.body,
    course_id: req.params.courseId,
    player_id: req.params.playerId,
  });
  res.status(httpStatus.CREATED).send({
    result: score,
  });
});
const createManyScore = catchAsync(async (req, res) => {
  console.log(req.body.scores);
  const scores = await scoreService.createManyScore(req.body.scores, {
    courseId: req.params.courseId,
    playerId: req.params.playerId,
    roundNum: req.params.roundNum,
  });
  res.status(httpStatus.CREATED).send({
    result: scores,
  });
});
const updateScore = catchAsync(async (req, res) => {
  const score = await scoreService.updateScore({
    ...req.body,
    course_id: req.params.courseId,
    player_id: req.params.playerId,
  });
  res.status(httpStatus.OK).send({
    result: score,
  });
});
const getPlayerScoreByRoundAndHole = catchAsync(async (req, res) => {
  const score = await scoreService.getPlayerScoresByRoundAndHole({
    course_id: req.params.courseId,
    player_id: req.params.playerId,
    holeNum: req.params.holeNum,
    roundNum: req.params.roundNum,
  });
  res.status(httpStatus.OK).send({
    result: score,
  });
});
module.exports = {
  getPlayerScoreByAllRound,
  getAllPlayerScoreByRound,
  getHoleStatisticByRoundNum,
  getPlayerScoresByAllRound,
  getPlayerScoreByRound,
  createScore,
  updateScore,
  getPlayerScoreByRoundAndHole,
  createManyScore,
};
