const { Course, User, Player, sequelize } = require('../models/schema');
const { Op } = require('sequelize');
const { uploadSingleFile } = require('./upload.service');
const { InternalServerError } = require('../utils/ApiError');
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
      await Player.update(
        { ranking: null },
        { where: { course_id: courseId, ranking: updateBody.ranking }, transaction: t }
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
    await t.rollback();
    throw new InternalServerError();
  }
};
module.exports = {
  createManyPlayer,
  getAllPlayer,
  getPlayer,
  updatePlayer,
  uploadAvatar,
};
