const { Course, Hole, Round, Player, GolfCourse } = require('../models/schema');
const { Op } = require('sequelize');
const createCourse = async (data) => {
  const course = {
    ...data,
    rounds: new Array(data.total_round).fill(null).map((_, index) => {
      return { round_num: index + 1 };
    }),
  };
  return Course.create(course, { include: [{ model: Round, as: 'rounds' }] });
};
const getCourseById = async (id) =>
  Course.findByPk(id, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: GolfCourse,
        as: 'golf_course',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{ model: Hole, as: 'holes' }],
      },
      { model: Round, as: 'rounds', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Player, as: 'players', attributes: { exclude: ['createdAt', 'updatedAt'] } },
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
  return await Course.getAllWithPaging({
    page,
    limit,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where,
    include: [
      {
        model: GolfCourse,
        as: 'golf_course',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{ model: Hole, as: 'holes' }],
      },
      { model: Round, as: 'rounds', attributes: { exclude: ['createdAt', 'updatedAt'] } },
      { model: Player, as: 'players', attributes: { exclude: ['createdAt', 'updatedAt'] } },
    ],
  });
};

module.exports = {
  createCourse,
  getCourseById,
  getAllCourseByOffsetLimit,
  existCourse,
};
