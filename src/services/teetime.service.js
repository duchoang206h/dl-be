const { Course, User, Player, Round, TeeTimeGroup, sequelize, TeeTime } = require('../models/schema');
const _ = require('lodash');
const { ApiError, BadRequestError, InternalServerError } = require('../utils/ApiError');
const logger = require('../config/logger');
const createManyTeetime = async (teetimes, { courseId, roundId }) => {
  const t = await sequelize.transaction();
  try {
    let groups = [];
    for (const teetime of teetimes) {
      const existGroupIndex = groups.findIndex((group) => group.group_num === teetime.group);
      const player = await Player.findOne({
        where: { name: teetime['name-golfer'] },
        raw: true,
        attributes: ['player_id'],
      });
      if (!player) return [true, new BadRequestError()];
      if (existGroupIndex >= 0) {
        groups[existGroupIndex]['players'].push({ player_id: player.player_id });
      }
      groups.push({
        group_num: teetime.group,
        course_id: courseId,
        round_id: roundId,
        players: [{ player_id: player.player_id }],
      });
    }
    let _groups = await TeeTimeGroup.bulkCreate(groups, { transaction: t });
    let _teetimes = [];
    for (const teetime of teetimes) {
      const existGroupIndex = _teetimes.findIndex((_teetime) => _teetime.group_num === teetime.group);
      if (existGroupIndex >= 0) continue;
      const group = _groups.find((group) => group.group_num === teetime.group_num);
      _teetimes.push({
        tee: teetime['tee'],
        time: teetime['time'],
        course_id: courseId,
        round_id: roundId,
        group_num: teetime.group,
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
module.exports = {
  createManyTeetime,
};
