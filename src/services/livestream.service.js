const { Op } = require('sequelize');
const { courseService, playerService } = require('.');
const { SCORE_TYPE, HOLE_PER_COURSE, EVENT_ZERO, FINISH_ALL_ROUNDS, LEADERBOARD_IMAGES } = require('../config/constant');
const { Player, Course, Score, Round, Hole, sequelize, TeeTimeGroup, Image } = require('../models/schema');
const { TeeTime } = require('../models/schema/Teetime');
const { TeeTimeGroupPlayer } = require('../models/schema/TeetimeGroupPlayer');
const { getRank } = require('../utils/score');
const { dateWithTimezone } = require('../utils/date');
const moment = require('moment');

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
  console.log({ courseId, roundNum, flight });
  const response = {};
  const course = await Course.findByPk(courseId);
  const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum } });
  console.log(round);
  const [group] = await Promise.all([
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
  ]);
  response['MAIN'] = course.main_photo_url;
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
  const course = await Course.findByPk(courseId);
  const player = await Player.findOne({ where: { code } });
  response['MAIN'] = course.main_photo_url;
  response[`AVATAR`] = player.avatar;
  response[`G1`] = player.fullname;
  response[`BIRTH`] = player.birth;
  response[`HEIGHT`] = player.height;
  response[`TURNPRO`] = player.turnpro;
  response[`WEIGHT`] = player.weight;
  response[`DRIVEREV`] = player.driverev;
  response[`PUTTING`] = player.putting;
  response[`BEST`] = player.best;
  return response;
};
const getFlightStatic = async ({ courseId, flight, roundNum }) => {
  const response = {};
  const course = await Course.findByPk(courseId);
  const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum } });
  console.log(round);
  const [group] = await Promise.all([
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
  ]);
  /* response['MAIN'] = course.main_photo_url;
  response['GROUP'] = group.group_num;
  response['TEE_TIME'] = group.teetime.time;
  group.group_players.forEach((player, index) => {
    response[`G${index + 1}`] = player.players.fullname;
    response[`AVATAR${index + 1}`] = player.players.avatar;
    response[`IMG_COUNTRY${index + 1}`] = player.players.flag;
  }); */
  return group;
};
const scorecardStatic = async ({ courseId, code, roundNum }) => {
  const response = {};
  const course = await Course.findByPk(courseId);
  const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum } });
  const player = await Player.findOne({
    where: { code },
    include: [{ model: Score, as: 'scores', where: { round_id: round.round_id }, include: [{ model: Hole }] }],
  });
  const allScores = await Score.findAll({ where: { player_id: player.player_id }, include: [{ model: Hole }] });
  response['MAIN'] = course.main_photo_url;
  response['G1'] = player.fullname;
  //response['TOTALGROSS'] = score.;
  player.scores.sort((a, b) => a.Hole.hole_num - b.Hole.hole_num);
  player.scores.forEach((score, index) => {
    score = score.toJSON();
    console.log(score);
    response[`G1SCORE${index + 1}`] = score.num_putt;
  });
  if (player.scores.length > 8) {
    response['OUT'] = player.scores.slice(0, 9).reduce((pre, cur) => cur.num_putt, 0);
    if (player.scores.length == 18) response['IN'] = player.scores.slice(9).reduce((pre, cur) => cur.num_putt, 0);
  }
  //const [todayScore, totalScore]
  response['TOTALGROSS'] = 72;
  response['TOTALOVER'] = player.scores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0);
  response['TOTALOVERALL'] = allScores.reduce((pre, cur) => pre + cur.num_putt - cur.Hole.par, 0);
  return response;
};

const getLeaderboard = async ({ roundNum, courseId, type }) => {
  const round = await Round.findOne({ where: { round_num: roundNum, course_id: courseId } });
  const course = await courseService.getCourseById(courseId);
  let players = await Player.findAll({
    where: { course_id: courseId },
    attributes: { exclude: ['createdAt', 'updatedAt', 'course_id'] },
  });
  players = await Promise.all(
    players.map(async (player) => {
      player = player.toJSON();

      const _today = dateWithTimezone();
      const [thru, todayScore, totalScore] = await Promise.all([
        Score.count({ where: { player_id: player.player_id, round_id: round.round_id } }),
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
  let response = {};
  const images = await Image.findAll({
    where: {
      type: {
        [Op.startsWith]: 'LEADERBOARD_IMAGES',
      },
      course_id: courseId,
    },
  });
  response['MAIN'] = course.main_photo_url;
  const negative_score_image = images.find((image) => {
    image.toJSON();
    return image.type == LEADERBOARD_IMAGES.negative_score.type;
  }).url;
  const equal_score_image = images.find((image) => {
    image.toJSON();
    return image.type == LEADERBOARD_IMAGES.equal_score.type;
  }).url;
  const positive_score_image = images.find((image) => {
    image.toJSON();
    return image.type == LEADERBOARD_IMAGES.positive_score.type;
  }).url;
  const negative_score_image_mini = images.find((image) => {
    image.toJSON();
    return image.type == LEADERBOARD_IMAGES.negative_score_mini.type;
  }).url;
  const equal_score_image_mini = images.find((image) => {
    image.toJSON();
    return image.type == LEADERBOARD_IMAGES.equal_score_mini.type;
  }).url;
  const positive_score_image_mini = images.find((image) => {
    image.toJSON();
    return image.type == LEADERBOARD_IMAGES.positive_score_mini.type;
  }).url;
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
module.exports = {
  getHoleStatistic,
  getFlightImage,
  getGolferDetails,
  getFlightStatic,
  scorecardStatic,
  getLeaderboard,
};
