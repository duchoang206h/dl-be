const { Course, User, Player, Round } = require('../models/schema');
const getRoundByNumAndCourse = async (roundNum, courseId) => {
  return Round.findOne({ where: { course_id: courseId, round_num: roundNum }, raw: true });
};
const getAllRoundByCourse = async (courseId) => {
  return Round.findAll({ where: { course_id: courseId }, raw: true, order: [['round_num', 'ASC']] });
};
module.exports = {
  getRoundByNumAndCourse,
  getAllRoundByCourse,
};
