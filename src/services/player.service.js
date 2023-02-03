const { Course, User, Player } = require('../models/schema');
const { Op } = require('sequelize');
const { uploadSingleFile } = require('./upload.service');
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
  console.log(updateBody);
  const player = await Player.update(updateBody, { where: { player_id: playerId, course_id: courseId }, returning: true });
  return player;
};
module.exports = {
  createManyPlayer,
  getAllPlayer,
  getPlayer,
  updatePlayer,
  uploadAvatar,
};
