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
  DEFAULT_SCORES,
  PLAYER_STATUS,
} = require('../config/constant');
const {
  Score,
  Round,
  Hole,
  sequelize,
  Player,
  TeeTimeGroupPlayer,
  TeeTimeGroup,
  Sequelize,
  CurrentScore,
  Course,
  MatchPlayClub,
  MatchPlayTeam,
  MatchPlayTeamPlayer,
  MatchPlayVersus,
  GolfCourse,
} = require('../models/schema');
const { yardToMeter } = require('../utils/convert');
const { dateWithTimezone } = require('../utils/date');
const {
  getScoreType,
  calculateScoreAverage,
  getRank,
  getDefaultScore,
  getTop,
  getMatchPlayScore,
} = require('../utils/score');
const { InternalServerError, BadRequestError, ApiError } = require('../utils/ApiError');
const { NUM_PUTT_INVALID, INVALID_SCORE_INPUT } = require('../utils/errorMessage');

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
        const { hole_num, num_putt, finished } = scoreBody;
        const [hole, round] = await Promise.all([
          holeService.getHoleByNumAndGolfCourseId(hole_num, courseId),
          roundService.getRoundByNumAndCourse(roundNum, courseId),
        ]);

        const scoreType = getScoreType(num_putt, hole.par);
        if (finished === undefined || finished === true) {
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
        } else {
          //// create current scores
          const currentScore = await CurrentScore.findOne({
            where: {
              player_id: playerId,
              course_id: courseId,
            },
          });
          if (currentScore) {
            return await CurrentScore.update(
              {
                hole_id: hole.hole_id,
                round_num: roundNum,
                num_putt,
                score_type: scoreType,
              },
              { where: { player_id: playerId, course_id: courseId } }
            );
          } else {
            return CurrentScore.create({
              hole_id: hole.hole_id,
              round_num: roundNum,
              num_putt,
              score_type: scoreType,
              player_id: playerId,
              course_id: courseId,
            });
          }
        }
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
    const [course, round, lastRounds] = await Promise.all([
      courseService.getCourseById(courseId),
      roundService.getRoundByNumAndCourse(roundNum, courseId),
      Round.findAll({
        where: {
          course_id: courseId,
          round_num: {
            [Op.lt]: roundNum,
          },
        },
        raw: true,
      }),
    ]);
    const result = await Promise.all(
      scores.map(async (score) => {
        const { hole_num, num_putt, finished, match_num = null } = score;
        const [hole, preScoreCount] = await Promise.all([
          holeService.getHoleByNumAndGolfCourseId(hole_num, course.golf_course_id),
          Score.findAll({
            where: {
              course_id: courseId,
              player_id: playerId,
            },
            include: [{ model: Hole }],
          }),
        ]);
        console.log(preScoreCount.filter((s) => s.round_id === round.round_id && s?.Hole?.hole_num < hole_num).length);
        console.log((roundNum - 1) * 18 + hole_num - 1);
        /* /*  if (
          preScoreCount.filter((s) => s.round_id === round.round_id && s?.Hole?.hole_num < hole_num).length !==
          (roundNum - 1) * 18 + hole_num - 1
        )
          throw new BadRequestError(INVALID_SCORE_INPUT); */
        const scoreType = getScoreType(num_putt, hole.par);
        if (finished === true) {
          const [exist, created] = await Score.findOrCreate({
            where: {
              course_id: courseId,
              round_id: round.round_id,
              hole_id: hole.hole_id,
              player_id: playerId,
            },
            defaults: {
              num_putt,
              score_type: scoreType,
              match_num,
            },
            transaction: t,
          });
          console.log(created);
          if (exist)
            await Score.update(
              { num_putt, score_type: scoreType },
              {
                where: { course_id: courseId, round_id: round.round_id, hole_id: hole.hole_id, player_id: playerId },
                transaction: t,
              }
            );
        } else {
          const currentScore = await CurrentScore.findOne({
            where: {
              player_id: playerId,
              course_id: courseId,
            },
          });
          if (currentScore) {
            return await CurrentScore.update(
              {
                hole_id: hole.hole_id,
                round_num: roundNum,
                num_putt,
                score_type: scoreType,
                match_num,
              },
              { where: { player_id: playerId, course_id: courseId } }
            );
          } else {
            return CurrentScore.create({
              hole_id: hole.hole_id,
              round_num: roundNum,
              num_putt,
              score_type: scoreType,
              player_id: playerId,
              course_id: courseId,
              match_num,
            });
          }
        }
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
  let [players, searchPlayers] = await Promise.all([
    Player.findAll({
      where: { course_id: courseId, status: PLAYER_STATUS.NORMAL },
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
    }),
    name
      ? Player.findAll({
          where: {
            course_id: courseId,

            status: PLAYER_STATUS.NORMAL,
            [Op.or]: [
              {
                fullname: {
                  [Op.like]: `%${name}%`,
                },
              },
              {
                vga: name,
              },
            ],
          },
        })
      : [],
  ]);
  const [round, course] = await Promise.all([Round.findByPk(roundId, { raw: true }), courseService.getCourseById(courseId)]);
  const lastRounds = await Round.findAll({
    where: {
      course_id: courseId,
      round_num: {
        [Op.lte]: round.round_num,
      },
    },
    attributes: ['round_id'],
    raw: true,
  });
  players = await Promise.all(
    players.map(async (player) => {
      try {
        player = player.toJSON();
        if (player.scores.length === 0)
          return {
            in: 0,
            total: 0,
            out: 0,
            today: null,
            score: null,
            scores: DEFAULT_SCORES,
            group_num: player.teetime_group_player?.TeeTimeGroup?.group_num,
            flag: player.flag,
            player_id: player.player_id,
            fullname: player.fullname,
            country: player.country,
            age: player.age,
            sex: player.sex,
            code: player.code,
            vga: player?.vga,
            club: player.club,
            group: player.group,
            avatar: player.avatar,
          };
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
        const [todayScores, totalScores] = await Promise.all([
          Score.findAll({
            where: {
              player_id: player.player_id,
              course_id: courseId,
              round_id: round.round_id,
              /* createdAt: {
            [Op.gte]: dateWithTimezone(),
            [Op.lt]: moment(dateWithTimezone(), DATE_FORMAT).add(1, 'days'),
          }, */
            },
            include: [{ model: Hole }],
          }),
          Score.findAll({
            where: {
              player_id: player.player_id,
              course_id: courseId,
              round_id: {
                [Op.in]: lastRounds.map(({ round_id }) => round_id),
              },
            },
            include: [{ model: Hole }],
          }),
        ]);
        const today = todayScores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0);
        const score = totalScores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0);

        return {
          in: _in,
          total,
          out,
          today,
          score,
          scores: player.scores,
          group_num: player.teetime_group_player?.TeeTimeGroup?.group_num,
          flag: player.flag,
          player_id: player.player_id,
          fullname: player.fullname,
          country: player.country,
          age: player.age,
          sex: player.sex,
          code: player.code,
          vga: player.vga,
          club: player.club,
          group: player.group,
          avatar: player.avatar,
        };
      } catch (error) {
        console.log(error);
      }
    })
  );
  const scores = players.map(({ score }) => score);
  players = players.map((player) => {
    return { ...player, pos: getRank(player.score, scores) };
  });
  players.sort((a, b) => a.pos - b.pos);
  players = players.map((p) => ({
    ...p,
    score: p.score == 0 ? EVENT_ZERO : p.score,
    today: p.today == 0 ? EVENT_ZERO : p.today,
  }));
  const searchPlayerIds = searchPlayers.map((player) => player.player_id);
  if (name || searchPlayers.length) {
    return players.filter((player) => searchPlayerIds.includes(player.player_id));
  }
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
  const [rounds, course, lastUpdatedAt] = await Promise.all([
    roundService.getAllRoundByCourse(courseId),
    courseService.getCourseById(courseId),
    Score.findOne({
      where: {
        course_id: courseId,
      },
      order: [['updatedAt', 'DESC']],
    }),
  ]);
  const lastRound = await roundService.getRoundByNumAndCourse(course.total_round, courseId);
  let [players, searchPlayers] = await Promise.all([
    Player.findAll({
      where: { course_id: courseId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
      include: [{ model: Score, as: 'scores' }],
    }),
    name
      ? Player.findAll({
          where: {
            course_id: courseId,
            [Op.or]: [
              {
                fullname: {
                  [Op.like]: `%${name}%`,
                },
              },
              {
                vga: name,
              },
              {
                vga: name.includes('-') ? name.replace('-', '_') : name,
              },
            ],
          },
          attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
          include: [{ model: Score, as: 'scores' }],
        })
      : [],
  ]);
  let normalPlayers = players.filter((player) => player.status === PLAYER_STATUS.NORMAL);
  let outCutPlayers = players.filter(
    (player) => player.status !== PLAYER_STATUS.NORMAL && player.status !== PLAYER_STATUS.WITHDRAW
  );
  let scoredOutCutPlayers = outCutPlayers.filter((p) => p.scores.length);
  let nonScoredOutCutPlayers = outCutPlayers.filter((p) => p.scores.length === 0);
  let withdrawPlayers = players.filter((player) => player.status === PLAYER_STATUS.WITHDRAW);
  let scoredPlayers = normalPlayers.filter((player) => player.scores.length);
  let nonScoredPlayers = normalPlayers.filter((player) => player.scores.length === 0);
  const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), 'DD-MM-YYYY').format('DD-MM-YYYY');
  let [_scoredPlayers, _nonScoredPlayers, _scoredOutCutPlayers, _nonScoredOutCutPlayers, _withdrawPlayers] =
    await Promise.all([
      new Promise(async (resolve, reject) => {
        try {
          scoredPlayers = await Promise.all(
            scoredPlayers.map(async (player) => {
              player = player.toJSON();
              const scores = await Promise.all(
                rounds.map(async (round) => {
                  const scores = await Score.findAll({
                    where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
                    attributes: ['num_putt', 'score_type'],
                    include: [{ model: Hole, attributes: ['hole_num', 'par'] }],
                  });
                  return {
                    scores,
                    round: round.round_num,
                    topar: scores.length ? scores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0) : null,
                  };
                })
              );
              player['rounds'] = [];
              for (const score of scores) {
                player['rounds'].push({
                  round: score.round,
                  scores: score.scores,
                  total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
                  topar: score.topar,
                });
              }
              player['score'] = player['rounds'].reduce(
                (pre, current) => pre + current.scores.reduce((p, c) => p + c.num_putt - c.Hole.par, 0),
                0
              );
              const [thru, todayScore, lastRoundScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    updatedAt: {
                      [Op.gte]: moment(_today, 'DD-MM-YYYY').toDate(),
                      [Op.lt]: moment(_today, 'DD-MM-YYYY').add(1, 'days').toDate(), // tomorrow
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
              player['thru'] = thru > 0 && thru % HOLE_PER_COURSE == 0 ? FINISH_ALL_ROUNDS : thru % HOLE_PER_COURSE;
              player['today'] = today == 0 ? EVENT_ZERO : today;
              return player;
            })
          );
          const scores = scoredPlayers.map(({ score }) => score);

          scoredPlayers = scoredPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.score, scores),
            };
          });
          scoredPlayers.sort((a, b) => a.pos - b.pos);
          const ranks = [];
          scoredPlayers.forEach((player) => {
            if (player.ranking) ranks.push(player.ranking);
          });
          ranks.sort((a, b) => b - a);
          scoredPlayers = scoredPlayers.map((player) => {
            return {
              ...player,
              pos: getTop(player.pos, player.ranking, ranks),
            };
          });
          scoredPlayers.sort((a, b) => a.pos - b.pos);

          resolve(scoredPlayers);
        } catch (error) {
          resolve([]);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          nonScoredPlayers = await Promise.all(
            nonScoredPlayers.map(async (player) => {
              player = player.toJSON();
              const scores = await Promise.all(
                rounds.map(async (round) => {
                  const scores = await Score.findAll({
                    where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
                    attributes: ['num_putt', 'score_type'],
                    include: [{ model: Hole, attributes: ['hole_num', 'par'] }],
                  });
                  return {
                    scores,
                    round: round.round_num,
                    topar: scores.length ? scores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0) : null,
                  };
                })
              );
              player['rounds'] = [];
              for (const score of scores) {
                player['rounds'].push({
                  round: score.round,
                  scores: score.scores,
                  total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
                  topar: score.topar,
                });
              }
              player['score'] = 0;

              player['thru'] = 0;
              player['today'] = null;
              return player;
            })
          );
          const scores = nonScoredPlayers.map(({ score }) => score);

          nonScoredPlayers = nonScoredPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.score, scores),
            };
          });
          nonScoredPlayers.sort((a, b) => a.pos - b.pos);
          const ranks = [];
          nonScoredPlayers.forEach((player) => {
            if (player.ranking) ranks.push(player.ranking);
          });
          ranks.sort((a, b) => b - a);
          nonScoredPlayers = nonScoredPlayers.map((player) => {
            return {
              ...player,
              score: null,
              today: null,
              pos: getTop(player.pos, player.ranking, ranks),
            };
          });
          nonScoredPlayers.sort((a, b) => a.pos - b.pos);

          resolve(nonScoredPlayers);
        } catch (error) {
          console.log(error);
          resolve([]);
        }
      }),

      new Promise(async (resolve, reject) => {
        try {
          scoredOutCutPlayers = await Promise.all(
            scoredOutCutPlayers.map(async (player) => {
              player = player.toJSON();
              const scores = await Promise.all(
                rounds.map(async (round) => {
                  const scores = await Score.findAll({
                    where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
                    attributes: ['num_putt', 'score_type'],
                    include: [{ model: Hole, attributes: ['hole_num', 'par'] }],
                  });
                  return {
                    scores,
                    round: round.round_num,
                    topar: scores.length ? scores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0) : null,
                  };
                })
              );
              player['rounds'] = [];
              for (const score of scores) {
                player['rounds'].push({
                  round: score.round,
                  scores: score.scores,
                  total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
                  topar: score.topar,
                });
              }
              player['score'] = player['rounds'].reduce(
                (pre, current) => pre + current.scores.reduce((p, c) => p + c.num_putt - c.Hole.par, 0),
                0
              );
              const [thru, todayScore, lastRoundScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    updatedAt: {
                      [Op.gte]: moment(_today, 'DD-MM-YYYY').toDate(),
                      [Op.lt]: moment(_today, 'DD-MM-YYYY').add(1, 'days').toDate(), // tomorrow
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
              player['thru'] = thru > 0 && thru % HOLE_PER_COURSE == 0 ? FINISH_ALL_ROUNDS : thru % HOLE_PER_COURSE;
              player['today'] = today == 0 ? EVENT_ZERO : today;
              return player;
            })
          );
          const scores = scoredOutCutPlayers.map(({ score }) => score);

          scoredOutCutPlayers = scoredOutCutPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.score, scores),
            };
          });
          scoredOutCutPlayers.sort((a, b) => a.pos - b.pos);
          resolve(scoredOutCutPlayers);
        } catch (error) {
          console.log(error);
          resolve([]);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          nonScoredOutCutPlayers = await Promise.all(
            nonScoredOutCutPlayers.map(async (player) => {
              player = player.toJSON();
              const scores = await Promise.all(
                rounds.map(async (round) => {
                  const scores = await Score.findAll({
                    where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
                    attributes: ['num_putt', 'score_type'],
                    include: [{ model: Hole, attributes: ['hole_num', 'par'] }],
                  });
                  return {
                    scores,
                    round: round.round_num,
                    topar: scores.length ? scores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0) : null,
                  };
                })
              );
              player['rounds'] = [];
              for (const score of scores) {
                player['rounds'].push({
                  round: score.round,
                  scores: score.scores,
                  total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
                  topar: score.topar,
                });
              }
              player['score'] = player['rounds'].reduce(
                (pre, current) => pre + current.scores.reduce((p, c) => p + c.num_putt - c.Hole.par, 0),
                0
              );
              const [thru, todayScore, lastRoundScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    updatedAt: {
                      [Op.gte]: moment(_today, 'DD-MM-YYYY').toDate(),
                      [Op.lt]: moment(_today, 'DD-MM-YYYY').add(1, 'days').toDate(), // tomorrow
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
              player['thru'] = thru > 0 && thru % HOLE_PER_COURSE == 0 ? FINISH_ALL_ROUNDS : thru % HOLE_PER_COURSE;
              player['today'] = today == 0 ? EVENT_ZERO : today;
              return player;
            })
          );
          const scores = nonScoredOutCutPlayers.map(({ score }) => score);

          nonScoredOutCutPlayers = nonScoredOutCutPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.score, scores),
            };
          });
          nonScoredOutCutPlayers.sort((a, b) => a.pos - b.pos);
          resolve(nonScoredOutCutPlayers);
        } catch (error) {
          console.log(error);
          resolve([]);
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          withdrawPlayers = await Promise.all(
            withdrawPlayers.map(async (player) => {
              player = player.toJSON();
              const scores = await Promise.all(
                rounds.map(async (round) => {
                  const scores = await Score.findAll({
                    where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
                    attributes: ['num_putt', 'score_type'],
                    include: [{ model: Hole, attributes: ['hole_num', 'par'] }],
                  });
                  return {
                    scores,
                    round: round.round_num,
                    topar: scores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0),
                  };
                })
              );
              player['rounds'] = [];
              for (const score of scores) {
                player['rounds'].push({
                  round: score.round,
                  scores: score.scores,
                  total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
                  topar: score.topar,
                });
              }
              player['score'] = player['rounds'].reduce(
                (pre, current) => pre + current.scores.reduce((p, c) => p + c.num_putt - c.Hole.par, 0),
                0
              );
              const [thru, todayScore, lastRoundScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    updatedAt: {
                      [Op.gte]: moment(_today, 'DD-MM-YYYY').toDate(),
                      [Op.lt]: moment(_today, 'DD-MM-YYYY').add(1, 'days').toDate(), // tomorrow
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
              player['thru'] = thru > 0 && thru % HOLE_PER_COURSE == 0 ? FINISH_ALL_ROUNDS : thru % HOLE_PER_COURSE;
              player['today'] = today == 0 ? EVENT_ZERO : today;
              return player;
            })
          );
          const scores = withdrawPlayers.map(({ score }) => score);

          withdrawPlayers = withdrawPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.score, scores),
            };
          });
          withdrawPlayers.sort((a, b) => a.pos - b.pos);
          const ranks = [];
          withdrawPlayers.forEach((player) => {
            if (player.ranking) ranks.push(player.ranking);
          });
          ranks.sort((a, b) => b - a);
          withdrawPlayers = withdrawPlayers.map((player) => {
            return {
              ...player,
              pos: getTop(player.pos, player.ranking, ranks),
            };
          });
          resolve(withdrawPlayers);
        } catch (error) {
          resolve([]);
        }
      }),
    ]);
  const lastScoredPlayerPos = _scoredPlayers[_scoredPlayers.length - 1]?.pos || 1;
  const lastScoredPlayerPosCount = _scoredPlayers.filter((player) => player.pos === lastScoredPlayerPos).length;
  _nonScoredPlayers = _nonScoredPlayers.map((player) => ({
    ...player,
    pos: lastScoredPlayerPos + lastScoredPlayerPosCount - 1 + player.pos,
  }));

  const lastNonScoredPlayerPos =
    _nonScoredPlayers[_nonScoredPlayers.length - 1]?.pos || lastScoredPlayerPos + lastScoredPlayerPosCount - 1;
  const lastNonScoredPlayerPosCount =
    _nonScoredPlayers.filter((player) => player.pos === lastNonScoredPlayerPos).length || 1;
  _scoredOutCutPlayers = _scoredOutCutPlayers.map((player) => ({
    ...player,
    pos: lastNonScoredPlayerPos + lastNonScoredPlayerPosCount - 1 + player.pos,
  }));
  console.log({ lastNonScoredPlayerPos, lastNonScoredPlayerPosCount });

  const lastScoreOutCutPlayerPos =
    _scoredOutCutPlayers[_scoredOutCutPlayers.length - 1]?.pos || lastNonScoredPlayerPos + lastNonScoredPlayerPosCount - 1;
  const lastScoreOutCutPlayerPosCount = _scoredOutCutPlayers.filter((p) => p.pos === lastNonScoredPlayerPos).length || 1;
  _nonScoredOutCutPlayers = _nonScoredOutCutPlayers.map((player) => ({
    ...player,
    pos: lastScoreOutCutPlayerPos + lastScoreOutCutPlayerPosCount - 1 + player.pos,
  }));
  console.log({ lastScoreOutCutPlayerPosCount, lastScoreOutCutPlayerPos });

  const lastNonScoreOutCutPlayerPos =
    _nonScoredOutCutPlayers[_nonScoredOutCutPlayers.length - 1]?.pos ||
    lastScoreOutCutPlayerPos + lastScoreOutCutPlayerPosCount - 1;
  const lastNonScoreOutCutPlayerPosCount =
    _nonScoredOutCutPlayers.filter((p) => p.pos === lastNonScoreOutCutPlayerPos).length || 1;
  console.log({ lastNonScoreOutCutPlayerPosCount, lastNonScoreOutCutPlayerPos });
  _withdrawPlayers = _withdrawPlayers.map((player) => ({
    ...player,
    pos: lastNonScoreOutCutPlayerPos + lastNonScoreOutCutPlayerPosCount - 1 + player.pos,
  }));
  let result = [..._scoredPlayers, ..._nonScoredPlayers, ..._scoredOutCutPlayers, ..._nonScoredOutCutPlayers];
  //result.sort((a, b) => a.pos - b.pos);
  result = [...result, ..._withdrawPlayers];
  const searchPlayerIds = searchPlayers.map((player) => player.player_id);
  if (name || searchPlayers.length) {
    result = result.filter((player) => searchPlayerIds.includes(player.player_id));
  }
  return { result, lastUpdatedAt: lastUpdatedAt?.updatedAt };
};
const getPlayerScore = async (courseId, playerId) => {
  let [player, rounds] = await Promise.all([
    Player.findOne({
      where: { course_id: courseId, player_id: playerId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
      include: [{ model: CurrentScore, as: 'current_score', include: [{ model: Hole, as: 'hole' }] }],
    }),
    roundService.getAllRoundByCourse(courseId),
  ]);
  player = player.toJSON();
  const [scores, course] = await Promise.all([
    Promise.all(
      rounds.map(async (round) => {
        const score = await Score.findAll({
          where: { player_id: player.player_id, round_id: round.round_id, course_id: courseId },
          attributes: ['num_putt', 'score_type', 'hole_id'],
          include: [{ model: Hole, attributes: ['hole_num'] }],
        });
        return { scores: getDefaultScore(score), checkScores: score, round: round.round_num };
      })
    ),
    courseService.getCourseById(courseId),
  ]);
  if (player.current_score) {
    // check current score conflict with score
    for (const s of scores) {
      if (
        s.checkScores.filter((sc) => {
          sc = sc.toJSON();
          return sc.hole_id === player.current_score?.hole_id;
        }).length &&
        s.round == player.current_score?.round_num
      ) {
        player['current_score'] = null;
      }
    }
  }
  player['rounds'] = [];

  for (const score of scores) {
    player['rounds'].push({
      round: score.round,
      scores: score.scores,
      total: score.scores.reduce((pre, current) => pre + current.num_putt, 0),
    });
  }
  const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), DATE_FORMAT).format('DD-MM-YYYY');
  const lastRound = await roundService.getRoundByNumAndCourse(course.total_round, courseId);
  player['score'] = PAR_PER_ROUND * course.total_round - player['rounds'].reduce((pre, current) => pre + current.total, 0);
  const [thru, todayScore] = await Promise.all([
    Score.count({ where: { player_id: player.player_id } }),
    moment(_today, DATE_FORMAT).isBefore(moment(course.end_date))
      ? Score.findAll({
          where: {
            player_id: playerId,
            updatedAt: {
              [Op.gte]: moment(_today, 'DD-MM-YYYY').toDate(),
              [Op.lt]: moment(_today, 'DD-MM-YYYY').add(1, 'days').toDate(), // tomorrow
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
  player['thru'] = thru % HOLE_PER_COURSE == HOLE_PER_COURSE ? FINISH_ALL_ROUNDS : thru;
  player['today'] = today == 0 ? EVENT_ZERO : today;
  return player;
};
const getLeaderboardMatchPlay = async (courseId, { roundNum }) => {
  const where = {};
  const response = {};
  if (roundNum) where['round_num'] = roundNum;
  const course = await Course.findOne({
    where: { course_id: courseId },
    include: [
      {
        model: MatchPlayVersus,
        as: 'versus',
        include: [
          {
            model: MatchPlayTeam,
            as: 'host_team',
            where,
            include: [
              {
                model: MatchPlayTeamPlayer,
                as: 'team_players',
                include: [
                  {
                    model: Player,
                    as: 'players',
                    include: [
                      {
                        model: Score,
                        as: 'scores',
                        include: [{ model: Hole, attributes: ['hole_num'] }],
                        attributes: ['num_putt', 'score_type'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            model: MatchPlayTeam,
            as: 'guest_team',
            where,
            include: [
              {
                model: MatchPlayTeamPlayer,
                as: 'team_players',
                include: [{ model: Player, as: 'players', include: [{ model: Score, as: 'scores' }] }],
              },
            ],
          },
        ],
      },
      {
        model: MatchPlayClub,
        as: 'clubs',
      },
      {
        model: GolfCourse,
        as: 'golf_course',
        include: [{ model: Hole, as: 'holes', attributes: ['meters', 'par', 'yards', 'hole_num'] }],
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
    order: [
      [{ model: GolfCourse, as: 'golf_course' }, { model: Hole, as: 'holes' }, 'hole_num', 'ASC'],
      [{ model: MatchPlayVersus, as: 'versus' }, 'match_num', 'ASC'],
      [
        { model: MatchPlayVersus, as: 'versus' },
        {
          model: MatchPlayTeam,
          as: 'host_team',
        },
        {
          model: MatchPlayTeamPlayer,
          as: 'team_players',
        },
        {
          model: Player,
          as: 'players',
        },
        { model: Score, as: 'scores' },
        { model: Hole },
        'hole_num',
        'ASC',
      ],
    ],
  });

  const matches = course?.versus.map((v) => {
    return {
      match: v?.match_num,
      type: v?.type,
      host: v?.host_team?.team_players?.map((p) => p.players),
      guest: v?.guest_team?.team_players?.map((p) => p.players),
      score: 2,
      leave_hole: [17, 18],
      start_hole: 1,
    };
  });
  response['matches'] = matches;
  response['golf_course'] = course.golf_course;
  response['host'] = {
    name: 'Miền Bắc',
    score: 10,
  };
  response['guest'] = {
    name: 'Miền Name',
    score: 10,
  };
  return {
    result: response,
  };
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
  getLeaderboardMatchPlay,
};
