const httpStatus = require('http-status');
const { Hole, sequelize, GolfCourse } = require('../models/schema');
const { ApiError, InternalServerError, BadRequestError } = require('../utils/ApiError');
const { INVALID_TOTAL_PAR, INVALID_TOTAL_HOLE } = require('../utils/errorMessage');

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
const getHoleByNumAndGolfCourseId = async (holeNum, golfCourseId) =>
  Hole.findOne({
    where: { hole_num: holeNum, golf_course_id: golfCourseId },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
const getHolesByGolfCourse = async (golfCourseId) =>
  Hole.findAll({ where: { golf_course_id: golfCourseId }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
const createManyHole = async (holes, golfCourseId) => {
  const t = await sequelize.transaction();
  try {
    const golfCourse = await GolfCourse.findByPk(golfCourseId, { raw: true });
    if (golfCourse.total_hole != holes.length) throw new BadRequestError(INVALID_TOTAL_HOLE(golfCourse.total_hole));
    if (golfCourse.total_par != holes.reduce((pre, cur) => pre + cur.par, 0))
      throw new BadRequestError(INVALID_TOTAL_PAR(golfCourse.total_par));
    const _holes = await Promise.all(
      holes.map(async (hole) => {
        const { hole_num, yards, par } = hole;
        const existHole = await Hole.count({ where: { golf_course_id: golfCourseId, hole_num } });
        if (existHole > 0)
          return await Hole.update({ yards, par }, { where: { golf_course_id: golfCourseId, hole_num }, transaction: t });
        return await Hole.create({ hole_num, yards, par, golf_course_id: golfCourseId }, { transaction: t });
      })
    );
    await t.commit();
    return _holes;
  } catch (error) {
    console.log(error);
    await t.rollback();
    if (error instanceof ApiError) throw error;
    throw new InternalServerError();
  }
};
module.exports = {
  createManyHole,
  updateHole,
  createHole,
  getHoleByNumAndGolfCourseId,
  getHolesByGolfCourse,
};
