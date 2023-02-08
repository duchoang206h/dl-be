const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const courseService = require('../services/course.service');
const moment = require('moment');
const { User } = require('../models/schema');
const { uploadSingleFile } = require('../services/upload.service');
const { DATE_FORMAT } = require('../config/constant');
const { cacheService } = require('../services');
const createCourse = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  if (course) res.status(httpStatus.CREATED).json({ result: course });
});
const getCourseById = catchAsync(async (req, res) => {
  let course = await courseService.getCourseById(req.params.courseId);
  course = course.toJSON();
  course = {
    ...course,
    end_date: moment(course.end_date, 'YYYY-MM-DD').format(DATE_FORMAT),
    start_date: moment(course.start_date, 'YYYY-MM-DD').format(DATE_FORMAT),
  };
  if (course) res.status(httpStatus.OK).json({ result: course });
  else res.status(httpStatus.NOT_FOUND).json({ result: [] });
});
const getAllCourse = catchAsync(async (req, res) => {
  const user = await User.findOne({ where: { user_id: req.userId }, raw: true });
  const course = user.is_super
    ? await courseService.getAllCourseByOffsetLimit(req.query)
    : await courseService.getAllCourseByOffsetLimit({ course_id: user.course_id });
  course.rows = course.rows.map((course) => {
    course = course.toJSON();
    return {
      ...course,
      end_date: moment(course.end_date, 'YYYY-MM-DD').format(DATE_FORMAT),
      start_date: moment(course.start_date, 'YYYY-MM-DD').format(DATE_FORMAT),
    };
  });
  cacheService.setCache(req.originalUrl, course);
  if (course) res.status(httpStatus.OK).json({ result: course });
  else res.status(httpStatus.NOT_FOUND).json({ result: [] });
});
const uploadPhoto = catchAsync(async (req, res) => {
  if (req.files.length <= 0) return res.status(httpStatus.BAD_REQUEST).send();
  const path = await uploadSingleFile(req.files[0], req.body.type);
  await courseService.updateCourse(req.params.courseId, { [req.body.type]: path });
  return res.status(httpStatus.OK).send();
});
const updateCourse = catchAsync(async (req, res) => {
  await courseService.updateCourse(req.params.courseId, req.body);
  return res.status(httpStatus.OK).send();
});
module.exports = {
  createCourse,
  getCourseById,
  getAllCourse,
  uploadPhoto,
  updateCourse,
};
