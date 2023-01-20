const { Course, Hole, Round } = require('../models/schema');
const { Op } = require('sequelize');
const createCourse = async (data) => Course.create(data);
const getCourseById = async (id) =>
  Course.findByPk(id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      { model: Hole, as: 'holes', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Round, as: 'rounds', attributes: { exclude: ['createdAt', 'updatedAt'] } },
    ],
  });
const existCourse = async (id) => (await Course.count({ where: { course_id: id } })) > 0;
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
  existCourse,
};
