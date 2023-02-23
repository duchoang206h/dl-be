const { Course, User, Player, sequelize, MatchPlayClub } = require('../models/schema');
const { Op } = require('sequelize');
const _ = require('lodash');
const { uploadSingleFile } = require('./upload.service');
const { InternalServerError } = require('../utils/ApiError');
const path = require('path');
const { writeToXlsx } = require('./xlsxService');
const courseService = require('./course.service');
const { COURSE_TYPE } = require('../config/constant');
const createManyPlayer = async (data) => {
  console.log(data[0]);
  const t = await sequelize.transaction();
  try {
    const course = await courseService.getCourseById(data[0]?.course_id);
    let clubs;
    if (course.type === COURSE_TYPE.MATCH_PLAY) {
      clubs = _.map(_.uniqBy(data, 'club'), 'club');
      clubs = clubs.map((c, i) => ({ course_id: data[0]?.course_id, name: c, type: i == 0 ? 'host' : 'guest' }));
      await MatchPlayClub.bulkCreate(clubs, { transaction: t });
    }
    await Player.bulkCreate(data, { transaction: t });
    await t.commit();
    return true;
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw new InternalServerError();
  }
};
const uploadAvatar = async (file, { courseId, playerId }) => {
  const path = await uploadSingleFile(file);
  const players = await Player.update({ avatar: path }, { where: { course_id: courseId, player_id: playerId } });
  return players;
};
const getAllPlayer = async (courseId, { page = 1, limit = 100, sort_by = 'createdAt', sort = 'ASC', name = '' }) => {
  const where = {
    course_id: courseId,
  };
  if (name) where['fullname'] = { [Op.like]: `%${name}%` };
  return await Player.getAllWithPaging({ page, limit, attributes: { exclude: ['createdAt', 'updatedAt'] }, where });
};
const getPlayer = async (courseId, playerId) => {
  return Player.findOne({
    where: { course_id: +courseId, player_id: +playerId },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};
const updatePlayer = async (updateBody, { playerId, courseId }) => {
  const t = await sequelize.transaction();

  try {
    let player = null;
    if (updateBody.ranking) {
      const existRank = await Player.findOne({
        where: { course_id: courseId, ranking: updateBody.ranking },
      });
      if (existRank)
        await Player.update(
          { ranking: null },
          { where: { course_id: courseId, player_id: existRank.player_id }, transaction: t }
        );
      player = await Player.update(
        {
          ranking: updateBody.ranking,
        },
        { where: { course_id: courseId, player_id: playerId } }
      );
    } else {
      player = await Player.update(updateBody, {
        where: { player_id: playerId, course_id: courseId },
        returning: true,
      });
    }
    await t.commit();
    return player;
  } catch (error) {
    console.log(error);
    await t.rollback();
    throw new InternalServerError();
  }
};
const exportPlayerByCourseId = async (courseId) => {
  let players = await Player.findAll({ where: { course_id: courseId }, attributes: ['fullname', 'vga', 'club'], raw: true });
  players = players.map((p, i) => ({ stt: i + 1, 'name-golfer': p.fullname, vga: p.vga, club: p.club }));
  writeToXlsx(players, path.resolve(__dirname, '..', '..', 'data', 'course_player.xlsx'));
};
module.exports = {
  createManyPlayer,
  getAllPlayer,
  getPlayer,
  updatePlayer,
  uploadAvatar,
  exportPlayerByCourseId,
};
