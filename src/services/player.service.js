const { Course, User, Player, sequelize } = require('../models/schema');
const { Op } = require('sequelize');
const { uploadSingleFile } = require('./upload.service');
const { InternalServerError } = require('../utils/ApiError');
const path = require('path');
const { writeToXlsx } = require('./xlsxService');
const createManyPlayer = async (data) => {
  await Player.bulkCreate(data);
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
  let players = await Player.findAll({
    where: { course_id: courseId },
    attributes: ['fullname', 'vga', 'player_id'],
    raw: true,
  });
  players = players.map((p, i) => ({ stt: i + 1, 'name-golfer': p.fullname, vga: p.vga, playerID: p.player_id }));
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
