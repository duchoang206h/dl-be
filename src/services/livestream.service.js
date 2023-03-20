const { Op } = require('sequelize');
const { courseService, playerService, roundService, scoreService } = require('.');
const { isValid, alpha2ToAlpha3, alpha3ToAlpha2 } = require('i18n-iso-countries');
const {
  SCORE_TYPE,
  HOLE_PER_COURSE,
  EVENT_ZERO,
  FINISH_ALL_ROUNDS,
  LEADERBOARD_IMAGES,
  SCORECARD_IMAGES,
  FLIGHT_INFOR_IMAGES,
  GOLFER_INFO_IMAGES,
  GOLFER_IN_HOLE_IMAGES,
  GROUP_RANK_IMAGES,
  HOLE_BOTTOM_IMAGES,
  LEADERBOARD_MINI_IMAGES,
  HOLE_TOP_IMAGES,
  DATE_FORMAT,
  GOLFER_BOTTOM_IMAGES,
  PLAYER_STATUS,
  COURSE_TYPE,
} = require('../config/constant');
const {
  Player,
  Course,
  Score,
  Round,
  Hole,
  sequelize,
  TeeTimeGroup,
  Image,
  CurrentScore,
  MatchPlayClub,
  MatchPlayVersus,
  MatchPlayTeam,
  MatchPlayTeamPlayer,
} = require('../models/schema');
const { TeeTime } = require('../models/schema/Teetime');
const { TeeTimeGroupPlayer } = require('../models/schema/TeetimeGroupPlayer');
const {
  getRank,
  getScoreImage,
  getTotalOverImage,
  getTop,
  getScoreTitle,
  formatMatchPlayScore,
  normalizePlayersMatchScore,
  getLeaveHoles,
  isScoreMatchPlay,
  getMatchPlayScore,
  getThru,
  getScorecardScore,
} = require('../utils/score');
const { dateWithTimezone } = require('../utils/date');
const moment = require('moment');
const { getScoreType } = require('../utils/score');
const { getCourseTypeUpperCaseKey } = require('./score.service');
const getPlayerScorecard = async (courseId, playerId) => {
  const [course, player] = await Promise.all([Course.findByPk(courseId), Player.findByPk(playerId)]);
  const response = {};
  response['MAIN'] = course.main_photo_url;
  response['G1'] = course.main_photo_url;
};
const getHoleStatistic = async ({ courseId, roundNum, holeNum, type }) => {
  const response = {};
  const course = await Course.findByPk(courseId);
  const [round, hole, images] = await Promise.all([
    Round.findOne({ where: { course_id: courseId, round_num: roundNum } }),
    Hole.findOne({ where: { golf_course_id: course.golf_course_id, hole_num: holeNum } }),
    Image.findAll({
      where: {
        course_id: courseId,
        type: {
          [Op.like]: type === 'top' ? `HOLE_TOP_IMAGES%` : `HOLE_BOTTOM_IMAGES%`,
        },
      },
    }),
    HOLE_TOP_IMAGES,
  ]);
  const scores = await Score.findAll({
    where: { hole_id: hole.hole_id, course_id: courseId, round_id: round.round_id },
    attributes: ['score_type', [sequelize.fn('count', sequelize.col('score_type')), 'total']],
    group: ['score_type'],
    raw: true,
  });
  const statistic = {};
  Object.values(SCORE_TYPE).forEach((type) => (statistic[type.toUpperCase()] = 0));
  for (const score of scores) {
    if (Object.values(SCORE_TYPE).includes(score.score_type)) {
      statistic[score.score_type.toUpperCase()] += 1;
    }
  }
  response['HOLE'] = hole.hole_num;
  response['PAR_HOLE'] = hole.par;
  response['YARDS'] = hole.yards;

  response['MAIN'] =
    type == 'top'
      ? images.find((img) => img.type === HOLE_TOP_IMAGES.main.type)?.url
      : images.find((img) => img.type === HOLE_BOTTOM_IMAGES.main.type)?.url;
  response['MAIN1'] =
    type == 'top'
      ? images.find((img) => img.type === HOLE_TOP_IMAGES.main1.type)?.url
      : images.find((img) => img.type === HOLE_BOTTOM_IMAGES.main.type)?.url;
  if (type == 'top') return response;
  response['PAR'] = statistic[SCORE_TYPE.PAR];
  response['BIRDIE'] = statistic[SCORE_TYPE.BIRDIE];
  response['EAGLE'] = statistic[SCORE_TYPE.EAGLE];
  response['BOGEY'] = statistic[SCORE_TYPE.BOGEY] + statistic[SCORE_TYPE.D_BOGEY];
  return response;
};
const getFlightImage = async ({ courseId, roundNum, flight }) => {
  const response = {};
  const course = await Course.findByPk(courseId);
  const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum } });
  const [group, images] = await Promise.all([
    TeeTimeGroup.findOne({
      where: { group_num: flight, course_id: courseId, round_id: round.round_id },
      include: [
        { model: TeeTimeGroupPlayer, as: 'group_players', include: [{ model: Player, as: 'players' }] },
        {
          model: TeeTime,
          as: 'teetime',
        },
      ],
    }),
    Image.findAll({
      where: {
        course_id: courseId,
        type: {
          [Op.like]: 'FLIGHT_INFOR_IMAGES%',
        },
      },
    }),
  ]);
  response['MAIN'] = images.find((img) => img.type === FLIGHT_INFOR_IMAGES.main.type)?.url;
  response['GROUP'] = group.group_num;
  response['TEE_TIME'] = group.teetime.time;
  group.group_players.forEach((player, index) => {
    response[`G${index + 1}`] = player.players.fullname;
    response[`AVATAR${index + 1}`] = player.players.avatar_url;
    response[`IMG_COUNTRY${index + 1}`] = player.players.flag;
  });
  return response;
};
const getGolferDetails = async ({ courseId, code }) => {
  const response = {};
  const [course, player, images] = await Promise.all([
    Course.findByPk(courseId),
    Player.findOne({ where: { player_id: code, course_id: courseId } }),
    Image.findAll({
      where: {
        course_id: courseId,
        type: {
          [Op.like]: 'SCORECARD_IMAGES%',
        },
      },
    }),
  ]);
  response['MAIN'] = images.find((img) => img.type === GOLFER_INFO_IMAGES.main.type)?.url;
  response[`AVATAR`] = player.avatar_url;
  response[`G1`] = player.fullname;
  response[`BIRTH`] = player.birth;
  response[`HEIGHT`] = player.height;
  response[`TURNPRO`] = player.turnpro;
  response[`WEIGHT`] = player.weight;
  response[`DRIVEREV`] = player.driverev;
  response[`PUTTING`] = player.putting;
  response[`BEST`] = player.best;
  response[`BIRTHPLACE`] = player.birthplace;
  response[`AGE`] = player.age;
  return response;
};
const getFlightStatic = async ({ courseId, flight, roundNum }) => {
  const response = {};
  const course = await Course.findByPk(courseId);
  const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum } });
  const rounds = await roundService.getAllRoundByCourse(courseId);
  const lastRound = await roundService.getRoundByNumAndCourse(course.total_round, courseId);
  let [players] = await Promise.all([
    Player.findAll({
      where: { course_id: courseId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
      include: [{ model: Score, as: 'scores' }],
    }),
  ]);
  const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), DATE_FORMAT).format('DD-MM-YYYY');
  players = await Promise.all(
    players.map(async (player) => {
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
      player['total'] = player['rounds'].reduce((pre, current) => pre + current.total, 0);

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
  const scores = players.map(({ score }) => score);

  players = players.map((player) => {
    return {
      ...player,
      pos: getRank(player.score, scores),
    };
  });
  players.sort((a, b) => a.pos - b.pos);
  const ranks = [];
  players.forEach((player) => {
    if (player.ranking) ranks.push(player.ranking);
  });
  ranks.sort((a, b) => b - a);
  players = players.map((player) => {
    return {
      ...player,
      pos: getTop(player.pos, player.ranking, ranks),
    };
  });

  const [group, images] = await Promise.all([
    TeeTimeGroup.findOne({
      where: { group_num: flight, course_id: courseId, round_id: round.round_id },
      include: [
        {
          model: TeeTime,
          as: 'teetime',
        },
      ],
    }),
    Image.findAll({
      where: {
        course_id: courseId,
        type: {
          [Op.like]: 'GROUP_RANK_IMAGES%',
        },
      },
    }),
  ]);
  const groupPlayers = await TeeTimeGroupPlayer.findAll({
    where: { teetime_group_id: group.teetime_group_id },
    include: [{ model: Player, as: 'players' }],
    raw: true,
  });
  response['MAIN'] = images.find((img) => img.type == GROUP_RANK_IMAGES.main.type)?.url;
  response['MAIN1'] = images.find((img) => img.type == GROUP_RANK_IMAGES.main1.type)?.url;
  response['GROUP'] = group.group_num;
  response['TEE_TIME'] = group.teetime.time;

  const flightPlayerIds = groupPlayers.map((p) => p['players.player_id']);
  players = players.filter((p) => flightPlayerIds.includes(p.player_id));
  players.forEach((player, index) => {
    response[`G${index + 1}`] = player.fullname;
    response[`AVATAR${index + 1}`] = player.avatar_url;
    response[`IMG_COUNTRY${index + 1}`] = player.flag;
    response[`OVER${index + 1}`] = player.today;
    response[`RANK_STT${index + 1}`] = player.pos;
    response[`TOTALOVER${index + 1}`] = player.score;
    response[`TOTALGROSS${index + 1}`] = player.total;
  });
  return response;
};
const scorecardStatic = async ({ courseId, code, roundNum, matchNum }) => {
  const [course, round, images] = await Promise.all([
    Course.findByPk(courseId),
    Round.findOne({ where: { course_id: courseId, round_num: roundNum } }),
    Image.findAll({
      where: {
        course_id: courseId,
        type: {
          [Op.like]: 'SCORECARD_IMAGES%',
        },
      },
    }),
  ]);
  if (course.type === COURSE_TYPE.STOKE_PLAY) {
    const player = await Player.findOne({
      where: { player_id: code, course_id: courseId },
      //include: [{ model: Score, as: 'scores', where: { round_id: round.round_id }, include: [{ model: Hole }] }],
    });
    let [todayScores, allScores] = await Promise.all([
      Score.findAll({
        where: { player_id: player?.player_id, course_id: courseId, round_id: round.round_id },
        include: [{ model: Hole }],
      }),
      Score.findAll({
        where: { player_id: player?.player_id, course_id: courseId },
        include: [{ model: Hole }],
      }),
    ]);

    let response = {};
    response['MAIN'] = images.find((img) => img.type == SCORECARD_IMAGES.main.type)?.url;
    response[`G1`] = player.fullname;
    response[`IMG_COUNTRY1`] = player.flag;
    response[`NATION1`] = player.country.length == 2 ? alpha2ToAlpha3(player.country) : player.country;
    todayScores.sort((a, b) => a.Hole?.hole_num - b.Hole?.hole_num);

    //TOTALOVER
    const totalOver = todayScores.reduce((pre, cur) => pre + cur.num_putt - cur?.Hole?.par, 0);
    response['TOTALOVER'] = totalOver;
    //TOTALOVERALL
    const totalOverAll = allScores.reduce((pre, cur) => pre + cur.num_putt - cur?.Hole?.par, 0);
    response['TOTALOVERALL'] = totalOverAll;
    // TOTALGROSS
    const totalGross = allScores.reduce((pre, cur) => pre + cur.num_putt, 0);
    response['TOTALGROSS'] = totalGross;

    /// iamge TOTALOVER
    response['STT_TOTALOVER'] = getTotalOverImage(images, totalOver);
    todayScores = getScorecard(todayScores);
    response['OUT'] = todayScores.slice(0, 9).reduce((pre, cur) => pre + cur.num_putt, 0);
    response['IN'] = todayScores.slice(9).reduce((pre, cur) => pre + cur.num_putt, 0);
    todayScores.forEach((score, index) => {
      response[`G1SCORE${index + 1}`] = score.num_putt;
      response[`G1IMG${index + 1}`] = getScoreImage(images, score.score_type) || null;
    });
    //const [todayScore, totalScore]
    return response;
  } else if (course.type === COURSE_TYPE.MATCH_PLAY) {
    const response = {};
    const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum } });
    const versus = await MatchPlayVersus.findOne({
      where: {
        course_id: courseId,
        round_num: roundNum,
        match_num: matchNum,
      },
      include: [
        {
          model: MatchPlayTeam,
          attributes: { exclude: ['createdAt', 'updatedAt'] },

          as: 'host_team',
          include: [
            {
              model: MatchPlayTeamPlayer,
              as: 'team_players',
              include: [
                {
                  model: Player,
                  as: 'players',
                },
              ],
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          ],
        },
        {
          model: MatchPlayTeam,
          as: 'guest_team',
          attributes: { exclude: ['createdAt', 'updatedAt'] },

          include: [
            {
              model: MatchPlayTeamPlayer,
              as: 'team_players',
              attributes: { exclude: ['createdAt', 'updatedAt'] },

              include: [
                {
                  model: Player,
                  as: 'players',
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
              ],
            },
          ],
        },
      ],
      order: [['match_num', 'ASC']],
    });
    const [hostClub, guestClub] = await Promise.all([
      MatchPlayClub.findOne({ where: { course_id: courseId, type: 'host' } }),
      MatchPlayClub.findOne({ where: { course_id: courseId, type: 'guest' } }),
    ]);
    const host = normalizePlayersMatchScore(
      await Promise.all(
        versus?.host_team?.team_players?.map(async (p) => {
          p = p.players.toJSON();
          p['scores'] = await Score.findAll({
            where: {
              player_id: p.player_id,
              round_id: round.round_id,
            },
            attributes: ['num_putt'],

            include: [{ model: Hole, attributes: ['hole_num'] }],
            order: [[{ model: Hole }, 'hole_num', 'ASC']],
          });
          return p;
        })
      ),
      versus?.type
    );
    const guest = normalizePlayersMatchScore(
      await Promise.all(
        versus?.guest_team?.team_players?.map(async (p) => {
          p = p.players.toJSON();
          p['scores'] = await Score.findAll({
            where: {
              player_id: p.player_id,
              round_id: round.round_id,
            },
            attributes: ['num_putt'],
            include: [{ model: Hole, attributes: ['hole_num'] }],
            order: [[{ model: Hole }, 'hole_num', 'ASC']],
          });
          return p;
        })
      ),
      versus?.type
    );
    const leave_hole = getLeaveHoles(host, guest, versus?.type);
    const isScore = isScoreMatchPlay(host, guest);
    const scores = getScorecardScore(host, guest, versus?.type);
    console.log({ lenght: scores.length });
    response['HOST'] = hostClub.name;
    response['GUEST'] = guestClub.name;
    scores.forEach((s, i) => {
      console.log({ s, i });
      response[`HOST_SCORE_${i + 1}`] =
        s >= 0 && formatMatchPlayScore(s, 0) === 'TIED' ? null : s >= 0 ? formatMatchPlayScore(s, 0) : null;
      response[`AS_${i + 1}`] = s === 0 && formatMatchPlayScore(s, 0) === 'TIED' ? 'TIED' : null;
      response[`GUEST_SCORE_${i + 1}`] =
        response[`HOST_SCORE_${i + 1}`] === null
          ? s <= 0 && formatMatchPlayScore(s, 0) === 'TIED'
            ? null
            : formatMatchPlayScore(s, 0)
          : null;
    });
    host.forEach((h, i) => {
      response[`HOST_G${i + 1}`] = h.fullname;
      response[`HOST_G${i + 1}_NATION`] = alpha2ToAlpha3(h.country);
      response[`HOST_G${i + 1}_COUNTRY`] = h.flag;
      response[`HOST_G${i + 1}_AVATAR`] = h.avatar_url;
    });
    guest.forEach((g, i) => {
      response[`GUEST_G${i + 1}`] = g.fullname;
      response[`GUEST_G${i + 1}_NATION`] = alpha2ToAlpha3(g.country);
      response[`GUEST_G${i + 1}_COUNTRY`] = g.flag;
      response[`GUEST_G${i + 1}_AVATAR`] = g.avatar_url;
    });
    const score = isScore === false ? null : getMatchPlayScore(host, guest, versus.type);
    let thru = getThru(host, guest);
    response['THRU'] = thru;
    let hostScore = thru === '-' ? null : score >= 0 ? formatMatchPlayScore(score, leave_hole.length) : null;
    let guestScore = thru === '-' ? null : score <= 0 ? formatMatchPlayScore(score, leave_hole.length) : null;
    response['HOST_SCORE'] = hostScore;
    response['GUEST_SCORE'] = guestScore;
    return response;
  }
};

const getLeaderboard = async ({ roundNum, courseId, type }) => {
  try {
    const course = await courseService.getCourseById(courseId);
    if (course.type === COURSE_TYPE.STOKE_PLAY) {
      let [round, players, images] = await Promise.all([
        Round.findOne({ where: { round_num: roundNum, course_id: courseId } }),
        Player.findAll({
          where: { course_id: courseId },
          attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
        }),
        Image.findAll({
          where: {
            type: {
              [Op.startsWith]: type === 'mini' ? 'LEADERBOARD_MINI_IMAGES%' : 'LEADERBOARD_IMAGES%',
            },
            course_id: courseId,
          },
        }),
      ]);
      players = await Promise.all(
        players.map(async (player) => {
          player = player.toJSON();

          const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), 'DD-MM-YYYY').format('DD-MM-YYYY');
          const [thru, todayScore, totalScore] = await Promise.all([
            Score.count({ where: { player_id: player.player_id, round_id: round.round_id } }),
            Score.findAll({
              where: {
                player_id: player.player_id,
                round_id: round.round_id,
                /*  updatedAt: {
              [Op.gte]: moment(_today, 'DD-MM-YYYY').toDate(),
              [Op.lt]: moment(_today, 'DD-MM-YYYY').add(1, 'days').toDate(), // tomorrow
            }, */
              },
              include: [{ model: Hole }],
            }),
            Score.findAll({
              where: {
                player_id: player.player_id,
              },
              include: [{ model: Hole }],
            }),
          ]);
          const today = todayScore.reduce((pre, score) => {
            score.toJSON();
            return pre + score.num_putt - score.Hole.par;
          }, 0);
          const total = totalScore.reduce((pre, score) => {
            score.toJSON();
            return pre + score.num_putt - score.Hole.par;
          }, 0);
          const gross = todayScore.reduce((pre, score) => {
            score.toJSON();
            return pre + score.num_putt;
          }, 0);
          const totalGross = totalScore.reduce((pre, score) => {
            score.toJSON();
            return pre + score.num_putt;
          }, 0);
          player['thru'] = thru == HOLE_PER_COURSE ? FINISH_ALL_ROUNDS : thru;
          player['today'] = today;
          player['total'] = total;
          player['gross'] = gross;
          player['scores'] = totalScore;
          player['total_gross'] = totalGross;
          return player;
        })
      );
      let normalPlayers = players.filter((player) => player.status === PLAYER_STATUS.NORMAL);
      let outCutPlayers = players.filter(
        (player) => player.status !== PLAYER_STATUS.NORMAL && player.status !== PLAYER_STATUS.WITHDRAW
      );
      let withdrawPlayers = players.filter((player) => player.status === PLAYER_STATUS.WITHDRAW);
      let scoredPlayers = normalPlayers.filter((player) => player.scores.length);
      let nonScoredPlayers = normalPlayers.filter((player) => player.scores.length === 0);
      const scores = scoredPlayers.map(({ total }) => total);
      scoredPlayers = scoredPlayers.map((player) => {
        return {
          ...player,
          pos: getRank(player.total, scores),
        };
      });
      const nonScores = nonScoredPlayers.map(({ total }) => total);
      nonScoredPlayers = nonScoredPlayers.map((player) => {
        return {
          ...player,
          pos: getRank(player.total, nonScores),
        };
      });
      scoredPlayers.sort((a, b) => a.pos - b.pos);
      const lastScoredPlayerPos = scoredPlayers[scoredPlayers.length - 1]?.pos || 1;
      const lastScoredPlayerPosCount = scoredPlayers.filter((player) => player.pos === lastScoredPlayerPos).length;
      nonScoredPlayers = nonScoredPlayers.map((player) => ({
        ...player,
        pos: lastScoredPlayerPos + lastScoredPlayerPosCount - 1 + player.pos,
      }));
      const lastNonScoredPlayerPos = nonScoredPlayers[nonScoredPlayers.length - 1]?.pos || 1;
      const lastNonScoredPlayerPosCount = nonScoredPlayers.filter((player) => player.pos === lastNonScoredPlayerPos).length;
      const outCutScores = outCutPlayers.map(({ total }) => total);
      outCutPlayers = outCutPlayers.map((player) => {
        return {
          ...player,
          pos: getRank(player.total, outCutScores),
        };
      });
      outCutPlayers = outCutPlayers.map((player) => ({
        ...player,
        pos: lastNonScoredPlayerPos + lastNonScoredPlayerPosCount - 1 + player.pos,
      }));
      outCutPlayers.sort((a, b) => a.pos - b.pos);
      withdrawPlayers = withdrawPlayers.map((p) => ({ ...p, pos: 'WD' }));
      players = [...scoredPlayers, ...nonScoredPlayers, ...outCutPlayers, ...withdrawPlayers];

      let response = {};

      response['MAIN'] = images.find(
        (img) => img.type == (type === 'mini' ? LEADERBOARD_MINI_IMAGES.main.type : LEADERBOARD_IMAGES.main.type)
      )?.url;
      response['MAIN1'] = images.find(
        (img) => img.type == (type === 'mini' ? LEADERBOARD_MINI_IMAGES.main1.type : LEADERBOARD_IMAGES.main1.type)
      )?.url;
      const negative_score_image = images.find((image) => {
        image.toJSON();
        return image.type == LEADERBOARD_IMAGES.negative_score.type;
      })?.url;
      const equal_score_image = images.find((image) => {
        image.toJSON();
        return image.type == LEADERBOARD_IMAGES.equal_score.type;
      })?.url;
      const positive_score_image = images.find((image) => {
        image.toJSON();
        return image.type == LEADERBOARD_IMAGES.positive_score.type;
      })?.url;
      const negative_score_image_mini = images.find((image) => {
        image.toJSON();
        return image.type == LEADERBOARD_MINI_IMAGES.negative_score_mini.type;
      })?.url;
      const equal_score_image_mini = images.find((image) => {
        image.toJSON();
        return image.type == LEADERBOARD_MINI_IMAGES.equal_score_mini.type;
      })?.url;
      const positive_score_image_mini = images.find((image) => {
        image.toJSON();
        return image.type == LEADERBOARD_MINI_IMAGES.positive_score_mini.type;
      })?.url;
      players.forEach((player, index) => {
        response[`G${index + 1}`] = player.fullname;
        response[`IMG_COUNTRY${index + 1}`] = player.flag;
        response[`TOTAL_OVER${index + 1}`] =
          player.total == 0 ? EVENT_ZERO : player.total > 0 ? '+' + player.total : player.total;
        response[`OVER${index + 1}`] = player.today == 0 ? EVENT_ZERO : player.today > 0 ? '+' + player.today : player.today;
        response[`THRU${index + 1}`] = player.thru;
        response[`RANK${index + 1}`] = player.pos;
        response[`GROSS${index + 1}`] = player.gross;
        response[`TOTAL_GROSS${index + 1}`] = player.total_gross;
        response[`NATION${index + 1}`] =
          player.country.length === 2 && isValid(player.country) ? alpha2ToAlpha3(player.country) : player.country;
        if (type === 'mini')
          response[`IMG_OVER_MINI${index + 1}`] =
            player.total == 0
              ? equal_score_image_mini
              : player.today > 0
              ? positive_score_image_mini
              : negative_score_image_mini;
        else {
          response[`IMG_OVER${index + 1}`] =
            player.total == 0 ? equal_score_image : player.today > 0 ? positive_score_image : negative_score_image;
        }
      });
      return response;
    } else if (course.type === COURSE_TYPE.MATCH_PLAY) {
      console.log({ type: course.type });
      console.log({ roundNum, courseId, type });
      const response = {};

      const round = await Promise.all(
        roundNum
          .split(',')
          .sort()
          .map((r) => scoreService.getLeaderBoardMatch(courseId, { roundNum: +r }))
      );
      const [hostClub, guestClub] = await Promise.all([
        MatchPlayClub.findOne({
          where: { course_id: courseId, type: 'host' },
        }),
        MatchPlayClub.findOne({
          where: { course_id: courseId, type: 'guest' },
        }),
      ]);
      if (round && round.length) {
        response['HOST'] = round[round.length - 1]['result']['host']['name'];
        response['HOST_IMAGE'] = hostClub.avatar_url;
        response['GUEST'] = round[round.length - 1]['result']['guest']['name'];
        response['GUEST_IMAGE'] = guestClub.avatar_url;
        response['HOST_SCORE'] = round[round.length - 1]['result']['host']['score'];
        response['HOST_SCORE'] = round[round.length - 1]['result']['host']['score'];
        response['GUEST_SCORE'] = round[round.length - 1]['result']['guest']['score'];
        round.forEach((r, index) => {
          const order = index + 1;

          r.result.matches.forEach((m) => {
            const roundType = getCourseTypeUpperCaseKey(m.type);
            m.host.forEach((h, i) => {
              response[`${roundType}_ORDER_${order}_MATCH_${m.match}_HOST_G${i + 1}`] = h.fullname;
              response[`${roundType}_ORDER_${order}_MATCH_${m.match}_HOST_G${i + 1}_COUNTRY`] = h.flag;
              response[`${roundType}_ORDER_${order}_MATCH_${m.match}_HOST_G${i + 1}_NATION`] = alpha2ToAlpha3(h.country);
              response[`${roundType}_ORDER_${order}_MATCH_${m.match}_HOST_G${i + 1}_AVATAR`] = h.avatar_url;
            });
            m.guest.forEach((h, i) => {
              response[`${roundType}_ORDER_${order}_MATCH_${m.match}_GUEST_G${i + 1}`] = h.fullname;
              response[`${roundType}_ORDER_${order}_MATCH_${m.match}_GUEST_G${i + 1}_COUNTRY`] = h.flag;
              response[`${roundType}_ORDER_${order}_MATCH_${m.match}_GUEST_G${i + 1}_NATION`] = alpha2ToAlpha3(h.country);
              response[`${roundType}_ORDER_${order}_MATCH_${m.match}_GUEST_G${i + 1}_AVATAR`] = h.avatar_url;
            });
            let thru = m.host[0].scores.filter((s) => s.num_putt !== null).length;
            thru = thru === 18 ? 'F' : thru === 0 ? '-' : thru;
            let hostScore = thru === '-' ? null : m.score >= 0 ? formatMatchPlayScore(m.score, m.leave_hole.length) : null;
            let guestScore = thru === '-' ? null : m.score <= 0 ? formatMatchPlayScore(m.score, m.leave_hole.length) : null;
            response[`${roundType}_ORDER_${order}_MATCH_${m.match}_THRU`] = thru;
            response[`${roundType}_ORDER_${order}_MATCH_${m.match}_HOST_SCORE`] = hostScore;
            response[`${roundType}_ORDER_${order}_MATCH_${m.match}_GUEST_SCORE`] = guestScore;
          });
        });
      }
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};
const getGroupRanking = async ({ courseId }) => {};
const getGolferInHoleStatistic = async ({ courseId, code }) => {
  let [course, player, images, players, rounds] = await Promise.all([
    courseService.getCourseById(courseId),
    Player.findOne({ where: { course_id: courseId, player_id: code }, include: [{ model: Score, as: 'scores' }] }),
    Image.findAll({
      where: {
        course_id: courseId,
        type: {
          [Op.like]: 'GOLFER_IN_HOLE_IMAGES%',
        },
      },
    }),
    Player.findAll({
      where: { course_id: courseId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
      include: [{ model: Score, as: 'scores' }],
    }),
    Round.findAll({ where: { course_id: courseId }, raw: true }),
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

              const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), DATE_FORMAT).format('DD-MM-YYYY');
              const [thru, todayScore, totalScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id, course_id: courseId } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    course_id: courseId,
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
                    course_id: courseId,
                  },
                  include: [{ model: Hole }],
                }),
              ]);
              const today = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const total = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const gross = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              const totalGross = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              player['thru'] = thru;
              player['today'] = today;

              player['total'] = total;
              player['gross'] = gross;
              player['total_gross'] = totalGross;
              player['statistic'] = {};
              Object.values(SCORE_TYPE).forEach((type) => (player['statistic'][type.toUpperCase()] = 0));
              for (const score of todayScore) {
                if (Object.values(SCORE_TYPE).includes(score.score_type)) {
                  player['statistic'][score.score_type.toUpperCase()] += 1;
                }
              }
              player['statistic']['BOGEY'] = player['statistic']['BOGEY'] + player['statistic']['D.BOGEY+'];
              delete player['statistic']['D.BOGEY+'];

              return player;
            })
          );
          const scores = scoredPlayers.map(({ total }) => total);

          scoredPlayers = scoredPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.total, scores),
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

              const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), DATE_FORMAT).format('DD-MM-YYYY');
              const [thru, todayScore, totalScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id, course_id: courseId } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    course_id: courseId,
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
                    course_id: courseId,
                  },
                  include: [{ model: Hole }],
                }),
              ]);
              const today = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const total = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const gross = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              const totalGross = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              player['thru'] = thru;
              player['today'] = today;
              player['scores'] = totalScore;

              player['total'] = total;
              player['gross'] = gross;
              player['total_gross'] = totalGross;
              player['statistic'] = {};
              Object.values(SCORE_TYPE).forEach((type) => (player['statistic'][type.toUpperCase()] = 0));
              for (const score of todayScore) {
                if (Object.values(SCORE_TYPE).includes(score.score_type)) {
                  player['statistic'][score.score_type.toUpperCase()] += 1;
                }
              }
              player['statistic']['BOGEY'] = player['statistic']['BOGEY'] + player['statistic']['D.BOGEY+'];
              delete player['statistic']['D.BOGEY+'];

              return player;
            })
          );
          const scores = nonScoredPlayers.map(({ total }) => total);

          nonScoredPlayers = nonScoredPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.total, scores),
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

              const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), DATE_FORMAT).format('DD-MM-YYYY');
              const [thru, todayScore, totalScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id, course_id: courseId } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    course_id: courseId,
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
                    course_id: courseId,
                  },
                  include: [{ model: Hole }],
                }),
              ]);
              const today = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const total = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const gross = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              const totalGross = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              player['thru'] = thru;
              player['today'] = today;
              player['scores'] = totalScore;

              player['total'] = total;
              player['gross'] = gross;
              player['total_gross'] = totalGross;
              player['statistic'] = {};
              Object.values(SCORE_TYPE).forEach((type) => (player['statistic'][type.toUpperCase()] = 0));
              for (const score of todayScore) {
                if (Object.values(SCORE_TYPE).includes(score.score_type)) {
                  player['statistic'][score.score_type.toUpperCase()] += 1;
                }
              }
              player['statistic']['BOGEY'] = player['statistic']['BOGEY'] + player['statistic']['D.BOGEY+'];
              delete player['statistic']['D.BOGEY+'];

              return player;
            })
          );
          const scores = scoredOutCutPlayers.map(({ total }) => total);

          scoredOutCutPlayers = scoredOutCutPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.total, scores),
            };
          });
          scoredOutCutPlayers.sort((a, b) => a.pos - b.pos);
          const ranks = [];
          scoredOutCutPlayers.forEach((player) => {
            if (player.ranking) ranks.push(player.ranking);
          });
          ranks.sort((a, b) => b - a);
          scoredOutCutPlayers = scoredOutCutPlayers.map((player) => {
            return {
              ...player,
              pos: getTop(player.pos, player.ranking, ranks),
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

              const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), DATE_FORMAT).format('DD-MM-YYYY');
              const [thru, todayScore, totalScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id, course_id: courseId } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    course_id: courseId,
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
                    course_id: courseId,
                  },
                  include: [{ model: Hole }],
                }),
              ]);
              const today = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const total = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const gross = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              const totalGross = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              player['thru'] = thru;
              player['today'] = today;
              player['scores'] = totalScore;

              player['total'] = total;
              player['gross'] = gross;
              player['total_gross'] = totalGross;
              player['statistic'] = {};
              Object.values(SCORE_TYPE).forEach((type) => (player['statistic'][type.toUpperCase()] = 0));
              for (const score of todayScore) {
                if (Object.values(SCORE_TYPE).includes(score.score_type)) {
                  player['statistic'][score.score_type.toUpperCase()] += 1;
                }
              }
              player['statistic']['BOGEY'] = player['statistic']['BOGEY'] + player['statistic']['D.BOGEY+'];
              delete player['statistic']['D.BOGEY+'];

              return player;
            })
          );
          const scores = nonScoredOutCutPlayers.map(({ total }) => total);

          nonScoredOutCutPlayers = nonScoredOutCutPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.total, scores),
            };
          });
          nonScoredOutCutPlayers.sort((a, b) => a.pos - b.pos);
          const ranks = [];
          nonScoredOutCutPlayers.forEach((player) => {
            if (player.ranking) ranks.push(player.ranking);
          });
          ranks.sort((a, b) => b - a);
          nonScoredOutCutPlayers = nonScoredOutCutPlayers.map((player) => {
            return {
              ...player,
              pos: getTop(player.pos, player.ranking, ranks),
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

              const _today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), DATE_FORMAT).format('DD-MM-YYYY');
              const [thru, todayScore, totalScore] = await Promise.all([
                Score.count({ where: { player_id: player.player_id, course_id: courseId } }),
                Score.findAll({
                  where: {
                    player_id: player.player_id,
                    course_id: courseId,
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
                    course_id: courseId,
                  },
                  include: [{ model: Hole }],
                }),
              ]);
              const today = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const total = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt - score.Hole.par;
              }, 0);
              const gross = todayScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              const totalGross = totalScore.reduce((pre, score) => {
                score.toJSON();
                return pre + score.num_putt;
              }, 0);
              player['thru'] = thru;
              player['today'] = today;
              player['total'] = total;
              player['gross'] = gross;
              player['total_gross'] = totalGross;
              player['statistic'] = {};
              player['scores'] = totalScore;
              Object.values(SCORE_TYPE).forEach((type) => (player['statistic'][type.toUpperCase()] = 0));
              for (const score of todayScore) {
                if (Object.values(SCORE_TYPE).includes(score.score_type)) {
                  console.log(player['statistic']);
                  player['statistic'][score.score_type.toUpperCase()] += 1;
                }
              }
              player['statistic']['BOGEY'] = player['statistic']['BOGEY'] + player['statistic']['D.BOGEY+'];
              delete player['statistic']['D.BOGEY+'];

              return player;
            })
          );
          const scores = withdrawPlayers.map(({ total }) => total);

          withdrawPlayers = withdrawPlayers.map((player) => {
            return {
              ...player,
              pos: getRank(player.total, scores),
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
          withdrawPlayers.sort((a, b) => a.pos - b.pos);
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

  const currentScore = await CurrentScore.findOne({
    where: { player_id: player.player_id, course_id: courseId },
    include: [{ model: Hole, as: 'hole' }],
  });
  let response = {};
  const targetPlayer = result.find((p) => p.player_id === player.player_id);
  response['MAIN'] = images.find((img) => img.type === GOLFER_IN_HOLE_IMAGES.main.type)?.url;
  response['MAIN1'] = images.find((img) => img.type === GOLFER_IN_HOLE_IMAGES.main1.type)?.url;
  response['YARD'] = currentScore?.hole.yards;
  response['PLAYER1'] = player.fullname;
  console.log(targetPlayer);
  response['COUNTRY'] =
    player.country.length === 2 && isValid(player.country) ? alpha2ToAlpha3(player.country) : player.country;
  response['IMG_COUNTRY'] = player.flag;
  response['TODAY'] = targetPlayer.today;
  response['THRU'] = targetPlayer.thru % HOLE_PER_COURSE == 0 ? FINISH_ALL_ROUNDS : targetPlayer.thru % HOLE_PER_COURSE;
  response['OVER'] = targetPlayer.total;
  response['RANK_STT'] = targetPlayer.pos;
  for (const r of rounds) {
    response[`ROUND${r.round_num}`] =
      (await Score.sum('num_putt', {
        where: { course_id: courseId, player_id: player.player_id, round_id: r.round_id },
      })) || 0;
  }
  response[`GAYOVER`] = currentScore?.num_putt;
  response[`HOLE`] = currentScore?.hole?.hole_num;
  response[`PAR_HOLE`] = currentScore?.hole?.par;
  response[`STTGAYOVER`] = getScoreImage(images, getScoreType(currentScore?.num_putt, currentScore?.hole?.par)) || null;
  response[`TITLEGAYOVER`] = getScoreTitle(currentScore?.num_putt, currentScore?.hole?.par);
  for (let i = 1; i <= currentScore?.hole?.par; i++) {
    response[`STROKE${i}`] = i;
  }
  response['RESULT'] = null;
  response['RESULT2'] = null;
  response = { ...response, ...targetPlayer['statistic'] };
  return response;
};
const getGolferBottom = async ({ code, courseId }) => {
  const response = {};
  const [course, player, images] = await Promise.all([
    Course.findByPk(courseId),
    Player.findOne({ where: { player_id: code, course_id: courseId } }),
    Image.findAll({
      where: {
        course_id: courseId,
        type: {
          [Op.like]: 'GOLFER_BOTTOM_IMAGES%',
        },
      },
    }),
  ]);
  const today = moment(dateWithTimezone(null, 'DD-MM-YYYY', 'utc'), DATE_FORMAT).format('DD-MM-YYYY');
  const [todayScores, totalScores] = await Promise.all([
    Score.findAll({
      where: {
        course_id: courseId,
        player_id: player.player_id,
        updatedAt: {
          [Op.gte]: moment(today, 'DD-MM-YYYY').toDate(),
          [Op.lt]: moment(today, 'DD-MM-YYYY').add(1, 'days').toDate(),
        },
      },
      attributes: ['score_type', [sequelize.fn('count', sequelize.col('score_type')), 'total']],
      group: ['score_type'],
      raw: true,
    }),
    Score.findAll({
      where: {
        course_id: courseId,
        player_id: player.player_id,
      },
      include: [{ model: Hole }],
    }),
  ]);
  Object.values(SCORE_TYPE).forEach((type) => (response[type.toUpperCase()] = 0));
  for (const score of todayScores) {
    if (Object.values(SCORE_TYPE).includes(score.score_type)) {
      response[score.score_type.toUpperCase()] += 1;
    }
  }
  response['BOGEY'] = response['BOGEY'] + response['D.BOGEY+'];
  response['MAIN'] = images.find((img) => img.type === GOLFER_BOTTOM_IMAGES.main.type)?.url;
  response[`AVATAR`] = player.avatar_url;
  response[`IMG_COUNTRY1`] = player.flag;
  response[`G1`] = player.fullname;

  delete response['D.BOGEY+'];
  response[`TOTAL_OVER`] = totalScores.reduce((pre, cur) => pre + cur.Hole.par - cur.num_putt, 0);
  response[`STT_TOTALOVER`] =
    response[`TOTAL_OVER`] == 0
      ? images.find((img) => img.type === GOLFER_BOTTOM_IMAGES.equal_score.type)?.url
      : response[`TOTAL_OVER`] > 0
      ? images.find((img) => img.type === GOLFER_BOTTOM_IMAGES.positive_score.type)?.url
      : images.find((img) => img.type === GOLFER_BOTTOM_IMAGES.negative_score.type)?.url;

  return response;
};
const getMatchPlayVersus = async ({ courseId, roundNum, matchNum }) => {
  const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum } });
  const versus = await MatchPlayVersus.findOne({
    where: {
      course_id: courseId,
      round_num: roundNum,
      match_num: matchNum,
    },
    include: [
      {
        model: MatchPlayTeam,
        attributes: { exclude: ['createdAt', 'updatedAt'] },

        as: 'host_team',
        include: [
          {
            model: MatchPlayTeamPlayer,
            as: 'team_players',
            include: [
              {
                model: Player,
                as: 'players',
              },
            ],
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
      {
        model: MatchPlayTeam,
        as: 'guest_team',
        attributes: { exclude: ['createdAt', 'updatedAt'] },

        include: [
          {
            model: MatchPlayTeamPlayer,
            as: 'team_players',
            attributes: { exclude: ['createdAt', 'updatedAt'] },

            include: [
              {
                model: Player,
                as: 'players',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
              },
            ],
          },
        ],
      },
    ],
    order: [['match_num', 'ASC']],
  });
  const [hostClub, guestClub] = await Promise.all([
    MatchPlayClub.findOne({ where: { course_id: courseId, type: 'host' } }),
    MatchPlayClub.findOne({ where: { course_id: courseId, type: 'guest' } }),
  ]);
  const host = normalizePlayersMatchScore(
    await Promise.all(
      versus?.host_team?.team_players?.map(async (p) => {
        p = p.players.toJSON();
        p['scores'] = await Score.findAll({
          where: {
            player_id: p.player_id,
            round_id: round.round_id,
          },
          attributes: ['num_putt'],

          include: [{ model: Hole, attributes: ['hole_num'] }],
          order: [[{ model: Hole }, 'hole_num', 'ASC']],
        });
        return p;
      })
    ),
    versus?.type
  );
  const guest = normalizePlayersMatchScore(
    await Promise.all(
      versus?.guest_team?.team_players?.map(async (p) => {
        p = p.players.toJSON();
        p['scores'] = await Score.findAll({
          where: {
            player_id: p.player_id,
            round_id: round.round_id,
          },
          attributes: ['num_putt'],
          include: [{ model: Hole, attributes: ['hole_num'] }],
          order: [[{ model: Hole }, 'hole_num', 'ASC']],
        });
        return p;
      })
    ),
    versus?.type
  );
  const leave_hole = getLeaveHoles(host, guest, versus?.type);
  const isScore = isScoreMatchPlay(host, guest);
  const response = {};
  response['HOST'] = hostClub.name;
  response['GUEST'] = guestClub.name;
  host.forEach((h, i) => {
    response[`HOST_G${i + 1}`] = h.fullname;
    response[`HOST_G${i + 1}_NATION`] = alpha2ToAlpha3(h.country);
    response[`HOST_G${i + 1}_COUNTRY`] = h.flag;
    response[`HOST_G${i + 1}_AVATAR`] = h.avatar_url;
  });
  guest.forEach((g, i) => {
    response[`GUEST_G${i + 1}`] = g.fullname;
    response[`GUEST_G${i + 1}_NATION`] = alpha2ToAlpha3(g.country);
    response[`GUEST_G${i + 1}_COUNTRY`] = g.flag;
    response[`GUEST_G${i + 1}_AVATAR`] = g.avatar_url;
  });
  const score = isScore === false ? null : getMatchPlayScore(host, guest, versus.type);
  let thru = getThru(host, guest);
  response['THRU'] = thru;
  let hostScore = thru === '-' ? null : score >= 0 ? formatMatchPlayScore(score, leave_hole.length) : null;
  let guestScore = thru === '-' ? null : score <= 0 ? formatMatchPlayScore(score, leave_hole.length) : null;
  response['HOST_SCORE'] = hostScore;
  response['GUEST_SCORE'] = guestScore;
  return response;
};
module.exports = {
  getHoleStatistic,
  getFlightImage,
  getGolferDetails,
  getFlightStatic,
  scorecardStatic,
  getLeaderboard,
  getGolferInHoleStatistic,
  getGolferBottom,
  getMatchPlayVersus,
};
