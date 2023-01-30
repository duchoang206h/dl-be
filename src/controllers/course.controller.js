const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const courseService = require('../services/course.service');
const { User } = require('../models/schema');
const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  if (course) res.status(httpStatus.CREATED).json({ result: course });
});
const getCourseById = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.courseId);
  if (course) res.status(httpStatus.OK).json({ result: course });
  else res.status(httpStatus.NOT_FOUND).json({ result: [] });
});
const getAllCourse = catchAsync(async (req, res) => {
  const user = await User.findOne({ where: { user_id: req.userId }, raw: true });
  const course = user.is_super
    ? await courseService.getAllCourseByOffsetLimit(req.query)
    : [await courseService.getCourseById(user.course_id)];
  if (course) res.status(httpStatus.OK).json({ result: course });
  else res.status(httpStatus.NOT_FOUND).json({ result: [] });
});
module.exports = {
  createCourse,
  getCourseById,
  getAllCourse,
};
