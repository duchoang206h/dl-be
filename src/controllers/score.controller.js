const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { getDataFromXlsx } = require('../services/xlsxService');
const { playerSchema } = require('../validations/xlsx.validation');
const { playerService, roundService, scoreService, cacheService } = require('../services');
const getPlayerScoreByAllRound = catchAsync(async (req, res) => {
  const scores = await scoreService.getPlayerScoresByAllRound(req.params.courseId, req.params.playerId);
  res.status(httpStatus.OK).send({
    result: scores,
  });
});
const getAllPlayerScoreByRound = catchAsync(async (req, res) => {
  const round = await roundService.getRoundByNumAndCourse(req.params.roundNum, req.params.courseId);
  if (!round) return res.status(httpStatus.NOT_FOUND).send();
  const scores = await scoreService.getAllPlayerScoreByRoundId(round.round_id, req.params.courseId, {
    name: req.query.name,
  });
  cacheService.setCache(req.originalUrl, scores);
  return res.status(httpStatus.OK).send({ result: scores });
});
const getHoleStatisticByRoundNum = catchAsync(async (req, res) => {
  const round = await roundService.getRoundByNumAndCourse(req.params.roundNum, req.params.courseId);
  if (!round) return res.status(httpStatus.NOT_FOUND).send();
  const scores = await scoreService.getHoleStatisticByRound({
    courseId: req.params.courseId,
    roundId: round.round_id,
  });
  cacheService.setCache(req.originalUrl, scores);

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
  const scores = await scoreService.updateManyScore(req.body.scores, {
    courseId: req.params.courseId,
    playerId: req.params.playerId,
    roundNum: req.params.roundNum,
  });
  res.status(httpStatus.OK).send({
    result: scores,
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
const getAllStatistic = catchAsync(async (req, res) => {
  const { result, lastUpdatedAt } = await scoreService.getAllPlayerScore(req.params.courseId, { name: req.query.name });
  cacheService.setCache(req.originalUrl, { result, lastUpdatedAt });
  res.status(httpStatus.OK).send({
    result,
    lastUpdatedAt,
  });
});
const getAllStatisticByPlayerId = catchAsync(async (req, res) => {
  const score = await scoreService.getPlayerScore(req.params.courseId, req.params.playerId);
  cacheService.setCache(req.originalUrl, score);
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
  getAllStatistic,
  getAllStatisticByPlayerId,
};