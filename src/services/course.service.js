const { Course } = require('../models/schema');
const { Op } = require('sequelize');
const createCourse = async (data) => Course.create(data);
const getCourseById = async (id) => Course.findByPk(id, { raw: true });
const getAllCourseByOffsetLimit = async ({
  page = 1,
  limit = 100,
  sort_by = 'createdAt',
  sort = 'ASC',
  type = '',
  name = '',
}) => {
  const where = {};
  if (type) where['type'] = type;
  if (name) where['name'] = { [Op.like]: `%${name}%` };
  return await Course.getAllWithPaging({ page, limit, attributes: { exclude: ['createdAt', 'updatedAt'] }, where });
};

module.exports = {
  createCourse,
  getCourseById,
  getAllCourseByOffsetLimit,
};
