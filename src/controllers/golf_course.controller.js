const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const courseService = require('../services/course.service');
const { User } = require('../models/schema');
const { golfCourseService } = require('../services');
const getAllGolfCourses = catchAsync(async (req, res) => {
  const golfCourses = await golfCourseService.getAllGolfCourses({ name: req.query.name });
  return res.status(httpStatus.OK).send({ result: golfCourses });
});
const getGolfCourseById = catchAsync(async (req, res) => {
  const golfCourse = await golfCourseService.getGolfCourseById(req.params.golfCourseId);
  return res.status(httpStatus.OK).send({ result: golfCourse });
});
const createGolfCourse = catchAsync(async (req, res) => {
  const golfCourses = await golfCourseService.createGolfCourse(req.body);
  return res.status(httpStatus.OK).send({ result: golfCourses });
});
module.exports = {
  getAllGolfCourses,
  createGolfCourse,
  getGolfCourseById,
};
