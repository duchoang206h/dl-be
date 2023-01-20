const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { holeService, courseService } = require('../services');
const { Hole } = require('../models/schema');
const createHole = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const course = courseService.getCourseById(courseId);
  if (!course) return res.status(httpStatus.NOT_FOUND).send();
  const { hole_num, par, yards } = req.body;
  const existHole = await holeService.getHoleByNumAndCourse(hole_num, courseId);
  if (existHole) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send();
  const hole = await holeService.createHole({ hole_num, par, yards, course_id: courseId });
  if (hole) res.status(httpStatus.CREATED).json({ result: hole });
  return res.status(httpStatus.UNPROCESSABLE_ENTITY).send();
});
const updateHole = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const holeNum = req.params.holeNum;
  const [_course, _hole] = await Promise.all([
    courseService.getCourseById(courseId),
    holeService.getHoleByNumAndCourse(holeNum, courseId),
  ]);
  if (!_course || !_hole) return res.status(httpStatus.NOT_FOUND).send();
  const updatedHole = await holeService.updateHole(req.body, { holeNum, courseId });
  if (updatedHole) res.status(httpStatus.OK).json({ result: updatedHole });
  return res.status(httpStatus.CONFLICT).send();
});
const getHolesByCourseId = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const course = courseService.getCourseById(courseId);
  if (!course) return res.status(httpStatus.NOT_FOUND).send();
  const holes = await holeService.getHolesByCourseId(courseId);
  return res.status(httpStatus.OK).send({ result: holes });
});
const getHolesByCourseIdAndHoleNum = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const holeNum = req.params.holeNum;
  const course = await courseService.getCourseById(courseId);
  if (!course) return res.status(httpStatus.NOT_FOUND).send();
  const holes = await holeService.getHoleByNumAndCourse(holeNum, courseId);
  return res.status(httpStatus.OK).send({ result: holes });
});
module.exports = {
  createHole,
  updateHole,
  getHolesByCourseId,
  getHolesByCourseIdAndHoleNum,
};
