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
const createManyHole = async (holes, golfCourseId) => {
  const t = await sequelize.transaction();
  try {
    const _holes = await Promise.all(
      holes.map(async (hole) => {
        const { hole_num, yards, par } = hole;
        const existHole = await Hole.count({ where: { golf_course_id: golfCourseId, hole_num } });
        if (existHole > 0) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY);
        return await Hole.create({ hole_num, yards, par, golf_course_id: golfCourseId }, { transaction: t });
      })
    );
    await t.commit();
    return _holes;
  } catch (error) {
    console.log(error);
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
};
