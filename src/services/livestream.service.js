const { Op } = require('sequelize');
const { courseService, playerService, roundService } = require('.');
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
} = require('../config/constant');
const { Player, Course, Score, Round, Hole, sequelize, TeeTimeGroup, Image, CurrentScore } = require('../models/schema');
const { TeeTime } = require('../models/schema/Teetime');
const { TeeTimeGroupPlayer } = require('../models/schema/TeetimeGroupPlayer');
const { getRank, getScoreImage, getTotalOverImage, getTop } = require('../utils/score');
const { dateWithTimezone } = require('../utils/date');
const moment = require('moment');
const { getScoreType } = require('../utils/score');
const getPlayerScorecard = async (courseId, playerId) => {
  const [course, player] = await Promise.all([Course.findByPk(courseId), Player.findByPk(playerId)]);
  const response = {};
  response['MAIN'] = course.main_photo_url;
  response['G1'] = course.main_photo_url;
};
const getHoleStatistic = async ({ courseId, roundNum, holeNum, type }) => {
  const response = {};
  const course = await Course.findByPk(courseId);
  const [round, hole] = await Promise.all([
    Round.findOne({ where: { course_id: courseId, round_num: roundNum } }),
    Hole.findOne({ where: { golf_course_id: course.golf_course_id, hole_num: holeNum } }),
  ]);
  const scores = await Score.findAll({
    where: { hole_id: hole.hole_id, course_id: courseId, round_id: round.round_id },
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
  response['HOLE'] = 'Hole ' + hole.hole_num;
  response['PAR_HOLE'] = hole.par;
  response['YARDS'] = hole.yards;

  if (type == 'top') return response;
  response['MAIN'] = hole.main_photo_url;
  response['MAIN1'] = hole.main_photo_url;
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
    response[`AVATAR${index + 1}`] = player.players.avatar;
    response[`IMG_COUNTRY${index + 1}`] = player.players.flag;
  });
  return response;
};
const getGolferDetails = async ({ courseId, code }) => {
  const response = {};
  const [course, player, images] = await Promise.all([
    Course.findByPk(courseId),
    Player.findOne({ where: { code } }),
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
  const _today = dateWithTimezone();
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
          model: TeeTimeGroupPlayer,
          as: 'group_players',
          include: [{ model: Player, as: 'players', include: [{ model: Score, as: 'scores' }] }],
        },
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
  response['MAIN'] = images.find((img) => img.type == GROUP_RANK_IMAGES.main.type)?.url;
  response['MAIN1'] = images.find((img) => img.type == GROUP_RANK_IMAGES.main1.type)?.url;
  response['GROUP'] = 'GROUP ' + group.group_num;
  response['TEE_TIME'] = group.teetime.time;
  players.forEach((player, index) => {
    response[`G${index + 1}`] = player.fullname;
    response[`AVATAR${index + 1}`] = player.avatar;
    response[`IMG_COUNTRY${index + 1}`] = player.flag;
    response[`OVER${index + 1}`] = player.today;
    response[`RANK_STT${index + 1}`] = player.pos;
    response[`TOTALOVER${index + 1}`] = player.score;
    response[`TOTALGROSS${index + 1}`] = player.total;
  });
  return response;
};
const scorecardStatic = async ({ courseId, code, roundNum }) => {
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
  const player = await Player.findOne({
    where: { code, course_id: courseId },
    include: [{ model: Score, as: 'scores', where: { round_id: round.round_id }, include: [{ model: Hole }] }],
  });
  const allScores = await Score.findAll({
    where: { player_id: player.player_id, course_id: courseId },
    include: [{ model: Hole }],
  });

  let response = {};
  response['MAIN'] = images.find((img) => img.type == SCORECARD_IMAGES.main.type)?.url;
  response[`G1`] = player.fullname;

  player.scores.sort((a, b) => a.Hole.hole_num - b.Hole.hole_num);

  //TOTALOVER
  const totalOver = player.scores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0);
  response['TOTALOVER'] = totalOver;
  //TOTALOVERALL
  const totalOverAll = allScores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0);
  response['TOTALOVERALL'] = totalOverAll;
  // TOTALGROSS
  const totalGross = allScores.reduce((pre, cur) => pre + cur.num_putt, 0);
  response['TOTALGROSS'] = totalGross;

  player.scores.forEach((score, index) => {
    score = score.toJSON();
    response[`G1SCORE${index + 1}`] = score.num_putt;
    response[`G1IMG${index + 1}`] = getScoreImage(images, score.score_type);
  });
  /// iamge TOTALOVER
  response['STT_TOTALOVER'] = getTotalOverImage(images, totalOver);
  response['OUT'] = player.scores.slice(0, 9).reduce((pre, cur) => pre + cur.num_putt, 0);
  response['IN'] = player.scores.slice(9).reduce((pre, cur) => pre + cur.num_putt, 0);

  //const [todayScore, totalScore]
  return response;
};

const getLeaderboard = async ({ roundNum, courseId, type }) => {
  let [round, course, players, images] = await Promise.all([
    Round.findOne({ where: { round_num: roundNum, course_id: courseId } }),
    courseService.getCourseById(courseId),
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
    return (
      image.type == (type === 'mini' ? LEADERBOARD_MINI_IMAGES.negative_score.type : LEADERBOARD_IMAGES.negative_score.type)
    );
  })?.url;
  const equal_score_image = images.find((image) => {
    image.toJSON();
    return image.type == (type === 'mini' ? LEADERBOARD_MINI_IMAGES.eagle_color.type : LEADERBOARD_IMAGES.eagle_color.type);
  })?.url;
  const positive_score_image = images.find((image) => {
    image.toJSON();
    return (
      image.type == (type === 'mini' ? LEADERBOARD_MINI_IMAGES.positive_score.type : LEADERBOARD_IMAGES.positive_score.type)
    );
  })?.url;
  const negative_score_image_mini = images.find((image) => {
    image.toJSON();
    return (
      image.type ==
      (type === 'mini' ? LEADERBOARD_MINI_IMAGES.negative_score_mini.type : LEADERBOARD_IMAGES.negative_score_mini.type)
    );
  })?.url;
  const equal_score_image_mini = images.find((image) => {
    image.toJSON();
    return (
      image.type ==
      (type === 'mini' ? LEADERBOARD_MINI_IMAGES.equal_score_mini.type : LEADERBOARD_IMAGES.equal_score_mini.type)
    );
  })?.url;
  const positive_score_image_mini = images.find((image) => {
    image.toJSON();
    return (
      image.type ==
      (type === 'mini' ? LEADERBOARD_MINI_IMAGES.positive_score_mini.type : LEADERBOARD_IMAGES.positive_score_mini.type)
    );
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
    response[`IMG_OVER${index + 1}`] =
      player.today == 0 ? equal_score_image : player.today > 0 ? positive_score_image : negative_score_image;
    response[`IMG_OVER_MINI${index + 1}`] =
      player.today == 0 ? equal_score_image_mini : player.today > 0 ? positive_score_image_mini : negative_score_image_mini;
  });
  return response;
};
const getGroupRanking = async ({ courseId }) => {};
const getGolferInHoleStatistic = async ({ courseId, code }) => {
  let [course, player, images, players, rounds] = await Promise.all([
    courseService.getCourseById(courseId),
    Player.findOne({ where: { course_id: courseId, code } }),
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
    }),
    Round.findAll({ where: { course_id: courseId }, raw: true }),
  ]);
  players = await Promise.all(
    players.map(async (player) => {
      player = player.toJSON();

      const _today = dateWithTimezone();
      const [thru, todayScore, totalScore] = await Promise.all([
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
      player['total_gross'] = totalGross;
      return player;
    })
  );
  const scores = players.map(({ total }) => total, 0);

  players = players.map((player) => {
    return {
      ...player,
      pos: getRank(player.total, scores),
    };
  });
  players.sort((a, b) => a.pos - b.pos);
  const currentScore = await CurrentScore.findOne({
    where: { player_id: player.player_id, course_id: courseId },
    include: [{ model: Hole, as: 'hole' }],
  });
  const response = {};
  const targetPlayer = players.find((p) => p.player_id === player.player_id);
  console.log({});
  response['MAIN'] = images.find((img) => img.type === GOLFER_IN_HOLE_IMAGES.main.type)?.url;
  response['MAIN1'] = images.find((img) => img.type === GOLFER_IN_HOLE_IMAGES.main1.type)?.url;
  response['HOLE'] = 'Hole ' + currentScore?.hole.hole_num;
  response['YARD'] = currentScore?.hole.yards;
  response['PLAYER1'] = player.fullname;
  response['COUNTRY'] = player.country;
  response['IMG_COUNTRY'] = player.flag;
  response['TODAY'] = targetPlayer.today;
  response['THRU'] = targetPlayer.thru;
  response['OVER'] = targetPlayer.total;
  response['RANK_STT'] = targetPlayer.pos;
  for (const r of rounds) {
    console.log(r);
    response[`ROUND${r.round_num}`] =
      (await Score.sum('num_putt', {
        where: { course_id: courseId, player_id: player.player_id, round_id: r.round_id },
      })) || 0;
  }
  response[`GAYOVER`] = currentScore?.num_putt;
  response[`STTGAYOVER`] = getScoreImage(images, getScoreType(currentScore?.num_putt, currentScore?.hole?.par));
  console.log('par', currentScore?.hole?.par);
  console.log('num_putt', currentScore?.num_putt);
  if (currentScore?.hole?.par > currentScore?.num_putt)
    for (let i = 1; i < currentScore?.num_putt; i++) {
      console.log(i);
      response[`STROKE${i}`] = i;
      response[`STTSTROKE${i}`] = getScoreImage(images, getScoreType(i, currentScore?.hole?.par));
    }
  else {
    for (let i = 1; i <= currentScore?.hole?.par; i++) {
      response[`STROKE${i}`] = i;
      response[`STTSTROKE${i}`] = getScoreImage(images, getScoreType(i, currentScore?.hole?.par));
    }
  }
  response['RESULT'] = null;
  response['RESULT2'] = null;
  return response;
};
const getGolferBottom = async ({ code, courseId }) => {
  const response = {};
  const [course, player, images] = await Promise.all([
    Course.findByPk(courseId),
    Player.findOne({ where: { code } }),
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
  console.log({ today });
  console.log(moment(today, 'DD-MM-YYYY').toDate());
  console.log(moment(today, 'DD-MM-YYYY').add(1, 'days').toDate());
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
  console.log(todayScores);
  Object.values(SCORE_TYPE).forEach((type) => (response[type.toUpperCase()] = 0));
  for (const score of todayScores) {
    if (Object.values(SCORE_TYPE).includes(score.score_type)) {
      response[score.score_type.toUpperCase()] = score.total;
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
module.exports = {
  getHoleStatistic,
  getFlightImage,
  getGolferDetails,
  getFlightStatic,
  scorecardStatic,
  getLeaderboard,
  getGolferInHoleStatistic,
  getGolferBottom,
};
