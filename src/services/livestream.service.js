const { courseService, playerService } = require('.');
const { SCORE_TYPE } = require('../config/constant');
const { Player, Course, Score, Round, Hole, sequelize, TeeTimeGroup } = require('../models/schema');
const { TeeTime } = require('../models/schema/Teetime');
const { TeeTimeGroupPlayer } = require('../models/schema/TeetimeGroupPlayer');

const getPlayerScorecard = async (courseId, playerId) => {
  const [course, player] = await Promise.all([Course.findByPk(courseId), Player.findByPk(playerId)]);
  const response = {};
  response['MAIN'] = course.main_photo_url;
  response['G1'] = course.main_photo_url;
};
const getHoleStatistic = async ({ courseId, roundNum, holeNum }) => {
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
module.exports = {
  getHoleStatistic,
  getFlightImage,
  getGolferDetails,
};
