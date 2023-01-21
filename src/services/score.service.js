const { holeService, roundService } = require('.');
const { SCORE_TYPE } = require('../config/constant');
const { Score, Round, Hole, sequelize, Player } = require('../models/schema');
const { yardToMeter } = require('../utils/convert');
const { getScoreType, calculateScoreAverage } = require('../utils/score');

const createScore = async (scoreBody) => {};
const getPlayerScoresByRoundAndHole = async (scoreBody) => {
  const { course_id, roundNum, holeNum, player_id } = scoreBody;
  const [hole, round] = await Promise.all([
    holeService.getHoleByNumAndCourse(holeNum, course_id),
    roundService.getRoundByNumAndCourse(roundNum, course_id),
  ]);
  return Score.findOne({
    where: {
      course_id,
      round_id: round.round_id,
      hole_id: hole.hole_id,
      player_id,
    },
    raw: true,
  });
};
const createManyScore = async (scoreBodyArr, { courseId, playerId, roundNum }) => {
  const result = await Promise.all(
    scoreBodyArr.map(async (scoreBody) => {
      const { hole_num, num_putt } = scoreBody;
      const [hole, round] = await Promise.all([
        holeService.getHoleByNumAndCourse(hole_num, courseId),
        roundService.getRoundByNumAndCourse(roundNum, courseId),
      ]);
      const scoreType = getScoreType(num_putt, hole.par);
      return Score.create({
        num_putt,
        course_id: courseId,
        round_id: round.round_id,
        hole_id: hole.hole_id,
        player_id: playerId,
        score_type: scoreType,
      });
    })
  );
  return result;
};
const updateScore = async (scoreBody) => {
  const { course_id, round_num, hole_num, player_id, num_putt } = scoreBody;
  const [hole, round] = await Promise.all([
    holeService.getHoleByNumAndCourse(hole_num, course_id),
    roundService.getRoundByNumAndCourse(round_num, course_id),
  ]);
  const scoreType = getScoreType(num_putt, hole.par);
  return Score.update(
    { num_putt, score_type: scoreType },
    { where: { course_id, round_id: round.round_id, hole_id: hole.hole_id, player_id } }
  );
};
const getScoresByPlayerAndRound = async ({ playerId, roundId, courseId }) => {
  return Score.findAll({
    where: {
      course_id: courseId,
      player_id: playerId,
      round_id: roundId,
    },
    attributes: ['num_putt', 'score_type'],

    include: {
      model: Hole,
      attributes: ['hole_num'],
    },
  });
};
const getHoleStatisticByRound = async ({ courseId, roundId }) => {
  const [holes, totalPlayer] = await Promise.all([
    Hole.findAll({
      where: { course_id: courseId },
      raw: true,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    Player.count({ where: { course_id: courseId } }),
  ]);
  let result = await Promise.all(
    holes.map(async (hole) => {
      const scores = await Score.findAll({
        where: { hole_id: hole.hole_id, course_id: courseId, round_id: roundId },
        attributes: ['score_type', [sequelize.fn('count', sequelize.col('score_type')), 'total']],
        group: ['score_type'],
        raw: true,
      });
      const statistic = {};
      Object.values(SCORE_TYPE).forEach((type) => (statistic[type] = 0));
      for (const score of scores) {
        if (Object.values(SCORE_TYPE).includes(score.score_type)) {
          statistic[score.score_type] = score.total;
        }
      }
      statistic['average'] = calculateScoreAverage(hole.par, { ...statistic }, totalPlayer);
      return { meters: yardToMeter(hole.yards), ...hole, statistic };
    })
  );
  result.sort((a, b) => b.statistic.average - b.par - (a.statistic.average - a.par));
  result = result.map((hole, index) => ({
    rank: index + 1,
    ...hole,
  }));
  return result;
};
const getAllPlayerScoreByRoundId = async (roundId, courseId) => {
  let players = await Player.findAll({
    where: {
      course_id: courseId,
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: {
      model: Score,
      as: 'scores',
      attributes: ['num_putt', 'score_type'],
      raw: true,
      where: {
        round_id: roundId,
        course_id: courseId,
      },
      include: [{ model: Hole, attributes: ['hole_num'] }],
    },
  });
  players = players.map((player) => {
    player = player.toJSON();
    player.scores.sort((a, b) => a.Hole.hole_num - b.Hole.hole_num);
    const total = player.scores.reduce((pre, current) => pre + current.num_putt, 0);
    const _in = player.scores.slice(0, 9).reduce((pre, current) => pre + current.num_putt, 0);
    const out = player.scores.slice(9).reduce((pre, current) => pre + current.num_putt, 0);
    player['in'] = _in;
    player['total'] = total;
    player['out'] = out;
    return player;
  });
  return players;
};
const getPlayerScoresByAllRound = async (courseId, playerId) => {
  console.log(playerId);
  const rounds = await Round.findAll({ where: { course_id: courseId }, raw: true, order: [['round_num', 'asc']] });
  const scores = await Promise.all(
    rounds.map(async (round) => {
      return await Score.findAll({ where: { course_id: courseId, round_id: round.round_id, player_id: playerId } });
    })
  );
  for (const r of rounds) {
  }
  return scores;
};
const getAllPlayerScore = async (courseId) => {
  const rounds = await roundService.getAllRoundByCourse(courseId);
  let players = await Player.findAll({
    where: { course_id: courseId },
    attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
  });
  players = await Promise.all(
    players.map(async (player) => {
      player = player.toJSON();
      const scores = await Promise.all(
        rounds.map(async (round) => {
          const scores = await Score.findAll({
            where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
            attributes: ['num_putt', 'score_type'],
            include: [{ model: Hole, attributes: ['hole_num'] }],
          });
          return { scores, round: round.round_num };
        })
      );
      player['rounds'] = [];
      for (const score of scores) {
        player['rounds'].push({
          round: score.round,
          scores: score.scores,
          total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
        });
      }
      return player;
    })
  );
  return players;
};
const getPlayerScore = async (courseId, playerId) => {
  let [player, rounds] = await Promise.all([
    Player.findOne({
      where: { course_id: courseId, player_id: playerId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
    }),
    roundService.getAllRoundByCourse(courseId),
  ]);
  player = player.toJSON();
  const scores = await Promise.all(
    rounds.map(async (round) => {
      const score = await Score.findAll({
        where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
        attributes: ['num_putt', 'score_type'],
        include: [{ model: Hole, attributes: ['hole_num'] }],
      });
      return { scores: score, round: round.round_num };
    })
  );
  player['rounds'] = [];
  for (const score of scores) {
    player['rounds'].push({
      round: score.round,
      scores: score.scores,
      total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
    });
  }
  return player;
};
module.exports = {
  getScoresByPlayerAndRound,
  getHoleStatisticByRound,
  getAllPlayerScoreByRoundId,
  getPlayerScoresByAllRound,
  createScore,
  updateScore,
  getPlayerScoresByRoundAndHole,
  createManyScore,
  getAllPlayerScore,
  getPlayerScore,
};
