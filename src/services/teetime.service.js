const { Course, User, Player, Round, TeeTimeGroup, sequelize, TeeTime, TeeTimeGroupPlayer } = require('../models/schema');
const _ = require('lodash');
const { ApiError, BadRequestError, InternalServerError } = require('../utils/ApiError');
const logger = require('../config/logger');
const { PLAYER_NOT_FOUND } = require('../utils/errorMessage');
const { PLAYER_STATUS } = require('../config/constant');
const createManyTeetime = async (teetimes, { courseId, roundNum }) => {
  const t = await sequelize.transaction();
  try {
    let groups = [];
    const round = await Round.findOne({ where: { course_id: courseId, round_num: roundNum }, raw: true });
    if (!round) return [false, new BadRequestError()];
    for (const teetime of teetimes) {
      const existGroupIndex = groups.findIndex((group) => group.group_num == teetime.group);
      const player = await Player.findOne({
        where: { fullname: teetime['name-golfer'], course_id: courseId },
        raw: true,
        attributes: ['player_id'],
      });
      if (!player) {
        return [true, new BadRequestError(PLAYER_NOT_FOUND(teetime['name-golfer']))];
      }
      if (existGroupIndex >= 0) {
        groups[existGroupIndex]['group_players'].push({ player_id: player.player_id });
      } else {
        groups.push({
          group_num: teetime.group,
          course_id: courseId,
          round_id: round.round_id,
          group_players: [{ player_id: player.player_id }],
        });
      }
    }
    let _groups = await TeeTimeGroup.bulkCreate(groups, {
      transaction: t,
      include: [{ model: TeeTimeGroupPlayer, as: 'group_players' }],
    });
    let _teetimes = [];
    for (let i = 0; i < teetimes.length; i++) {
      const existGroupIndex = _teetimes.findIndex((teetime) => {
        if (teetime && teetime.group_num == teetimes[i].group) return true;
        return false;
      });
      if (existGroupIndex >= 0) continue;
      let group = _groups.find((group) => {
        return group.group_num == teetimes[i].group;
      });
      //group = group.toJSON();
      _teetimes.push({
        tee: teetimes[i]['tee'],
        time: teetimes[i]['time'],
        course_id: courseId,
        round_id: round.round_id,
        group_num: teetimes[i].group,
        teetime_group_id: group.teetime_group_id,
      });
    }
    await TeeTime.bulkCreate(_teetimes, { transaction: t });
    await await t.commit();
    return [true, null];
  } catch (error) {
    logger.error(error.toString());
    await t.rollback();
    return [false, new InternalServerError()];
  }
};
const getTeetimeByCourseAndRound = async (courseId, roundNum) => {
  const [course, round] = await Promise.all([
    Course.findByPk(courseId),
    Round.findOne({
      where: {
        course_id: courseId,
        round_num: roundNum,
      },

      raw: true,
    }),
  ]);
  if (!course || !round) throw new BadRequestError();
  let teetimes = await TeeTime.findAll({
    where: {
      course_id: courseId,
      round_id: round.round_id,
    },
    include: [
      {
        model: TeeTimeGroup,
        as: 'groups',
        attributes: { exclude: ['createdAt', 'updatedAt'] },

        include: [
          {
            model: TeeTimeGroupPlayer,
            as: 'group_players',
            attributes: { exclude: ['createdAt', 'updatedAt', 'course_id', 'round_id'] },
            include: [
              {
                model: Player,
                as: 'players',
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { status: PLAYER_STATUS.NORMAL },
              },
            ],
          },
        ],
      },
    ],
  });
  teetimes = teetimes.map((teetime) => {
    teetime.toJSON();
    return {
      teetime_group_id: teetime.teetime_group_id,
      tee: teetime.tee,
      time: teetime.time,
      group_num: teetime.groups.group_num,
      players: teetime.groups.group_players.map((player) => player.players),
    };
  });
  return teetimes;
};
module.exports = {
  createManyTeetime,
  getTeetimeByCourseAndRound,
};