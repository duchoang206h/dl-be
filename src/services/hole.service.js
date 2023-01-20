const { Hole } = require('../models/schema');

const createManyHole = async (holes) => {
  return Hole.bulkCreate(holes);
};
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
  Hole.findOne({ where: { hole_num: holeNum, course_id: courseId }, raw: true });
const getHolesByCourseId = async (courseId) =>
  Hole.findAll({ where: { course_id: courseId }, plain: true, attributes: { exclude: ['createdAt', 'updatedAt'] } });
module.exports = {
  createManyHole,
  updateHole,
  createHole,
  getHoleByNumAndCourse,
  getHolesByCourseId,
};
