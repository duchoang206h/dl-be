const { Op } = require('sequelize');
const moment = require('moment');
const { holeService, roundService, courseService } = require('.');
const {
  SCORE_TYPE,
  PAR_PER_ROUND,
  DATE_FORMAT,
  HOLE_PER_COURSE,
  FINISH_ALL_ROUNDS,
  EVENT_ZERO,
  MAX_NUM_PUTT,
} = require('../config/constant');
const { Score, Round, Hole, sequelize, Player, TeeTimeGroupPlayer, TeeTimeGroup, Sequelize } = require('../models/schema');
const { yardToMeter } = require('../utils/convert');
const { dateWithTimezone } = require('../utils/date');
const { getScoreType, calculateScoreAverage, getRank } = require('../utils/score');
const { InternalServerError, BadRequestError, ApiError } = require('../utils/ApiError');
const { NUM_PUTT_INVALID } = require('../utils/errorMessage');

const createScore = async (scoreBody) => {};
const getPlayerScoresByRoundAndHole = async (scoreBody) => {
  const { course_id, roundNum, holeNum, player_id } = scoreBody;
  const [hole, round] = await Promise.all([
    holeService.getHoleByNumAndGolfCourseId(holeNum, course_id),
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
  const t = await sequelize.transaction();
  try {
    for (const score of scoreBodyArr) {
      if (score.num_putt <= 0 || score.num_putt > MAX_NUM_PUTT) throw new BadRequestError(NUM_PUTT_INVALID);
    }
    const result = await Promise.all(
      scoreBodyArr.map(async (scoreBody) => {
        const { hole_num, num_putt } = scoreBody;
        const [hole, round] = await Promise.all([
          holeService.getHoleByNumAndGolfCourseId(hole_num, courseId),
          roundService.getRoundByNumAndCourse(roundNum, courseId),
        ]);
        const scoreType = getScoreType(num_putt, hole.par);
        const existScore = await Score.count({
          where: { course_id: courseId, round_id: round.round_id, hole_id: hole.hole_id, player_id: playerId },
        });
        if (existScore) throw BadRequestError();
        return Score.create(
          {
            num_putt,
            course_id: courseId,
            round_id: round.round_id,
            hole_id: hole.hole_id,
            player_id: playerId,
            score_type: scoreType,
          },
          { transaction: t }
        );
      })
    );
    await t.commit();
    return result;
  } catch (error) {
    await t.rollback();
    if (error instanceof ApiError) throw error;
    else throw new InternalServerError();
  }
};
const updateScore = async (scoreBody) => {
  const { course_id, round_num, hole_num, player_id, num_putt } = scoreBody;
  const [hole, round] = await Promise.all([
    holeService.getHoleByNumAndGolfCourseId(hole_num, course_id),
    roundService.getRoundByNumAndCourse(round_num, course_id),
  ]);
  const scoreType = getScoreType(num_putt, hole.par);
  return Score.update(
    { num_putt, score_type: scoreType },
    { where: { course_id, round_id: round.round_id, hole_id: hole.hole_id, player_id } }
  );
};
const updateManyScore = async (scores, { courseId, playerId, roundNum }) => {
  const t = await sequelize.transaction();
  try {
    for (const score of scores) {
      if (score.num_putt <= 0 || score.num_putt > MAX_NUM_PUTT) throw new BadRequestError(NUM_PUTT_INVALID);
    }
    const course = await courseService.getCourseById(courseId);
    const result = await Promise.all(
      scores.map(async (score) => {
        const { hole_num, num_putt } = score;
        const [hole, round] = await Promise.all([
          holeService.getHoleByNumAndGolfCourseId(hole_num, course.golf_course_id),
          roundService.getRoundByNumAndCourse(roundNum, courseId),
        ]);
        const scoreType = getScoreType(num_putt, hole.par);
        return Score.upsert(
          {
            num_putt,
            score_type: scoreType,
            course_id: courseId,
            round_id: round.round_id,
            hole_id: hole.hole_id,
            player_id: playerId,
          },
          {
            transaction: t,
          }
        );
      })
    );
    await t.commit();
    return result;
  } catch (error) {
    console.log(error);
    await t.rollback();
    if (error instanceof ApiError) throw error;
    else throw new InternalServerError();
  }
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
  const course = await courseService.getCourseById(courseId);
  const [holes, totalPlayer] = await Promise.all([
    Hole.findAll({
      where: { golf_course_id: course.golf_course_id },
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
const getAllPlayerScoreByRoundId = async (roundId, courseId, { name, vhandicap }) => {
  const where = name
    ? {
        course_id: courseId,
        fullname: {
          [Op.like]: `%${name}%`,
        },
      }
    : {
        course_id: courseId,
      };
  const [round, course] = await Promise.all([Round.findByPk(roundId, { raw: true }), courseService.getCourseById(courseId)]);
  const lastRounds = await Round.findAll({
    where: {
      course_id: courseId,
      round_num: {
        [Op.lt]: round.round_num,
      },
    },
    attributes: ['round_id'],
    raw: true,
  });
  let players = await Player.findAll({
    where,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: Score,
        as: 'scores',
        attributes: ['num_putt', 'score_type'],
        where: {
          round_id: roundId,
          course_id: courseId,
        },
        include: [{ model: Hole, attributes: ['hole_num'] }],
      },
      { model: TeeTimeGroupPlayer, as: 'teetime_group_player', include: [{ model: TeeTimeGroup }] },
    ],
  });
  players = await Promise.all(
    players.map(async (player) => {
      player = player.toJSON();
      player.scores.sort((a, b) => a.Hole.hole_num - b.Hole.hole_num);
      player.scores = player.scores.map((score) => {
        return {
          num_putt: score.num_putt,
          score_type: score.score_type,
          hole_num: score.Hole.hole_num,
        };
      });
      const total = player.scores.reduce((pre, current) => pre + current.num_putt, 0);
      const out = player.scores.slice(0, 9).reduce((pre, current) => pre + current.num_putt, 0);
      const _in = player.scores.slice(9).reduce((pre, current) => pre + current.num_putt, 0);

      player['in'] = _in;
      player['total'] = total;
      player['out'] = out;
      const today = moment(course.end_date).isBefore(moment())
        ? Score.sum('num_putt', {
            where: {
              player_id: player.player_id,
              course_id: courseId,
              round_id: round.round_id,
              createdAt: {
                [Op.gte]: dateWithTimezone(),
                [Op.lt]: moment(dateWithTimezone(), DATE_FORMAT).add(1, 'days'),
              },
            },
          })
        : total - PAR_PER_ROUND;
      const score =
        (await Score.sum('num_putt', {
          where: {
            player_id: player.player_id,
            course_id: courseId,
            round_id: {
              [Op.in]: lastRounds.map(({ round_id }) => round_id),
            },
          },
        })) -
        (round.round_num - 1) * PAR_PER_ROUND +
        today;
      return {
        in: _in,
        total,
        out,
        today,
        score: score == 0 ? EVENT_ZERO : score,
        scores: player.scores,
        group_num: player.teetime_group_player.TeeTimeGroup.group_num,
        flag: player.flag,
        player_id: player.player_id,
        fullname: player.fullname,
        country: player.country,
        age: player.age,
        sex: player.sex,
        code: player.code,
        club: player.club,
        group: player.group,
        avatar: player.avatar,
      };
    })
  );
  const scores = players.map(({ total }) => total);
  players = players.map((player) => {
    return { ...player, pos: getRank(player.total, scores) };
  });
  players.sort((a, b) => a.pos - b.pos);
  return players;
};
const getPlayerScoresByAllRound = async (courseId, playerId) => {
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
const getAllPlayerScore = async (courseId, { name }) => {
  const rounds = await roundService.getAllRoundByCourse(courseId);
  console.log(rounds);
  const course = await courseService.getCourseById(courseId);
  const lastRound = await roundService.getRoundByNumAndCourse(course.total_round, courseId);
  let players = name
    ? await Player.findAll({
        where: {
          course_id: courseId,
          fullname: {
            [Op.like]: `%${name}%`,
          },
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
      })
    : await Player.findAll({
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
      const _today = dateWithTimezone();
      console.log(_today);
      console.log({ check: moment(_today, DATE_FORMAT).isBefore(moment(course.end_date)) });
      player['score'] =
        PAR_PER_ROUND * course.total_round - player['rounds'].reduce((pre, current) => pre + current.total, 0);
      const [thru, todayScore, lastRoundScore] = await Promise.all([
        Score.count({ where: { player_id: player.player_id } }),
        Score.findAll({
          where: {
            player_id: player.player_id,
            updatedAt: {
              [Op.gte]: _today,
              [Op.lt]: moment(_today).add(1, 'days').toDate(), // tomorrow
            },
          },
          include: [{ model: Hole }],
        }),
        Score.findAll({
          where: {
            player_id: player.player_id,
            round_id: lastRound.round_id,
          },
          include: [{ model: Hole }],
        }),
      ]);
      const today = todayScore.length
        ? todayScore.reduce((pre, score) => {
            score.toJSON();
            return pre + score.num_putt - score.Hole.par;
          }, 0)
        : lastRoundScore.reduce((pre, score) => {
            score.toJSON();
            return pre + score.num_putt - score.Hole.par;
          }, 0);
      player['thru'] = thru == HOLE_PER_COURSE * course.total_round ? FINISH_ALL_ROUNDS : thru;
      player['thru'] = thru == HOLE_PER_COURSE * course.total_round ? FINISH_ALL_ROUNDS : thru;
      player['today'] = today == 0 ? EVENT_ZERO : today;
      return player;
    })
  );
  const scores = players.map(({ rounds }) => rounds.reduce((pre, cur) => pre + cur.total, 0));

  players = players.map((player) => {
    return {
      ...player,
      pos: getRank(
        player.rounds.reduce((pre, cur) => pre + cur.total, 0),
        scores
      ),
    };
  });
  players.sort((a, b) => a.pos - b.pos);
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
  const [scores, course] = await Promise.all([
    Promise.all(
      rounds.map(async (round) => {
        const score = await Score.findAll({
          where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
          attributes: ['num_putt', 'score_type'],
          include: [{ model: Hole, attributes: ['hole_num'] }],
        });
        return { scores: score, round: round.round_num };
      })
    ),
    courseService.getCourseById(courseId),
  ]);
  player['rounds'] = [];
  for (const score of scores) {
    player['rounds'].push({
      round: score.round,
      scores: score.scores,
      total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
    });
  }
  const _today = dateWithTimezone();
  console.log(_today);
  const lastRound = await roundService.getRoundByNumAndCourse(course.total_round, courseId);
  console.log({ check: moment(_today, DATE_FORMAT).isBefore(moment(course.end_date)) });
  player['score'] = PAR_PER_ROUND * course.total_round - player['rounds'].reduce((pre, current) => pre + current.total, 0);
  const [thru, todayScore] = await Promise.all([
    Score.count({ where: { player_id: player.player_id } }),
    moment(_today, DATE_FORMAT).isBefore(moment(course.end_date))
      ? Score.findAll({
          where: {
            player_id: playerId,
            updatedAt: {
              [Op.gte]: _today,
              [Op.lt]: moment(_today).add(1, 'days').toDate(), // tomorrow
            },
          },
          include: [{ model: Hole }],
        })
      : Score.findAll({
          where: {
            player_id: playerId,
            round_id: lastRound.round_id,
          },
          include: [{ model: Hole }],
        }),
  ]);
  const today = todayScore.reduce((pre, score) => {
    score.toJSON();
    return pre + score.num_putt - score.Hole.par;
  }, 0);
  player['thru'] = thru == HOLE_PER_COURSE * course.total_round ? FINISH_ALL_ROUNDS : thru;
  player['thru'] = thru == HOLE_PER_COURSE * course.total_round ? FINISH_ALL_ROUNDS : thru;
  player['today'] = today == 0 ? EVENT_ZERO : today;
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
  updateManyScore,
};
