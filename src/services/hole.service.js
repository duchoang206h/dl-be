const httpStatus = require('http-status');
const { Hole, sequelize } = require('../models/schema');
const { ApiError, InternalServerError } = require('../utils/ApiError');

const updateHole = async (updateBody, { holeNum, courseId }) => {
  await Hole.update(updateBody, { where: { hole_num: holeNum, course_id: courseId } });
  return Hole.findOne({
    where: { hole_num: holeNum, course_id: courseId },
    plain: true,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};
const createHole = async (hole) => {
  return Hole.create(hole, { raw: true });
};
const getHoleByNumAndCourse = async (holeNum, courseId) =>
  Hole.findOne({ where: { hole_num: holeNum, course_id: courseId }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
const getHolesByCourseId = async (courseId) =>
  Hole.findAll({ where: { course_id: courseId }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
const createManyHole = async (holes, courseId) => {
  const t = await sequelize.transaction();
  try {
    const _holes = await Promise.all(
      holes.map(async (hole) => {
        const { hole_num, yards, par } = hole;
        console.log(hole);
        const existHole = await Hole.count({ where: { course_id: courseId, hole_num } });
        if (existHole > 0) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY);
        return await Hole.create({ hole_num, yards, par, course_id: courseId }, { transaction: t });
      })
    );
    await t.commit();
    return _holes;
  } catch (error) {
    await t.rollback();
    throw new InternalServerError();
  }
};
module.exports = {
  createManyHole,
  updateHole,
  createHole,
  getHoleByNumAndCourse,
  getHolesByCourseId,
  createManyHole,
};
