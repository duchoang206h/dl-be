const { Course, User, Player } = require('../models/schema');
const { Op } = require('sequelize');
const createManyPlayer = async (data) => {
  await Player.bulkCreate(data);
};
const getAllPlayer = async ({ page = 1, limit = 100, sort_by = 'createdAt', sort = 'ASC', name = '' }) => {
  const where = {};
  if (name) where['name'] = { [Op.like]: `%${name}%` };
  return await Player.getAllWithPaging({ page, limit, attributes: { exclude: ['createdAt', 'updatedAt'] }, where });
};
const getPlayer = async (courseId, playerId) => {
  return Player.findOne({
    where: { course_id: +courseId, player_id: +playerId },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};
const updatePlayer = async (updateBody, { playerId, courseId }) => {
  console.log(updateBody);
  const player = await Player.update(updateBody, { where: { player_id: playerId, course_id: courseId }, returning: true });
  return player;
};
module.exports = {
  createManyPlayer,
  getAllPlayer,
  getPlayer,
  updatePlayer,
};
