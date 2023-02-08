const httpStatus = require('http-status');
const { Hole, sequelize, GolfCourse } = require('../models/schema');
const { ApiError, InternalServerError } = require('../utils/ApiError');
const { Op } = require('sequelize');

const getAllGolfCourses = async ({ name }) => {
  const golfCourses = name
    ? await GolfCourse.findAll({
        where: { name: { [Op.like]: `%${name}%` } },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{ model: Hole, as: 'holes' }],
      })
    : GolfCourse.findAll({ limit: 1000, include: [{ model: Hole, as: 'holes' }] });
  return golfCourses;
};
const getGolfCourseById = async (golf_course_id) => {
  const golfCourse = await GolfCourse.findOne({ where: { golf_course_id }, include: [{ model: Hole, as: 'holes' }] });
  return golfCourse;
};
const createGolfCourse = async (body) => GolfCourse.create(body);
module.exports = {
  getAllGolfCourses,
  createGolfCourse,
  getGolfCourseById,
};
