const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { holeService, courseService } = require('../services');
const { Hole } = require('../models/schema');
const { holeSchema } = require('../validations/xlsx.validation');
const { getDataFromXlsx } = require('../services/xlsxService');
const { BadRequestError } = require('../utils/ApiError');
const createHole = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const course = courseService.getCourseById(courseId);
  if (!course) return res.status(httpStatus.NOT_FOUND).send();
  const { hole_num, par, yards } = req.body;
  const existHole = await holeService.getHoleByNumAndGolfCourseId(hole_num, courseId);
  if (existHole) return res.status(httpStatus.UNPROCESSABLE_ENTITY).send();
  const hole = await holeService.createHole({ hole_num, par, yards, course_id: courseId });
  if (hole) res.status(httpStatus.CREATED).json({ result: hole });
  return res.status(httpStatus.UNPROCESSABLE_ENTITY).send();
});
const createManyHole = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const holes = req.body.holes;
  if (holes.length !== 18) return res.status(httpStatus.BAD_REQUEST).send();
  console.log(holes.reduce((pre, current) => pre + current.par, 0));
  console.log(holes.length);
  if (holes.reduce((pre, current) => pre + current.par, 0) !== 72) return res.status(httpStatus.BAD_REQUEST).send();
  const hole = await holeService.createManyHole(holes, courseId);
  if (hole) res.status(httpStatus.CREATED).json({ result: hole });
  return res.status(httpStatus.UNPROCESSABLE_ENTITY).send();
});
const updateHole = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const holeNum = req.params.holeNum;
  const [_course, _hole] = await Promise.all([
    courseService.getCourseById(courseId),
    holeService.getHoleByNumAndGolfCourseId(holeNum, courseId),
  ]);
  if (!_course || !_hole) return res.status(httpStatus.NOT_FOUND).send();
  const updatedHole = await holeService.updateHole(req.body, { holeNum, courseId });
  if (updatedHole) res.status(httpStatus.OK).json({ result: updatedHole });
  return res.status(httpStatus.CONFLICT).send();
});
const getHolesByGolfCourse = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const course = courseService.getCourseById(courseId);
  if (!course) return res.status(httpStatus.NOT_FOUND).send();
  const holes = await holeService.getHolesByGolfCourse(courseId);
  return res.status(httpStatus.OK).send({ result: holes });
});
const getHolesByGolfCourseAndHoleNum = catchAsync(async (req, res) => {
  const courseId = req.params.courseId;
  const holeNum = req.params.holeNum;
  const course = await courseService.getCourseById(courseId);
  if (!course) return res.status(httpStatus.NOT_FOUND).send();
  const holes = await holeService.getHoleByNumAndGolfCourseId(holeNum, courseId);
  return res.status(httpStatus.OK).send({ result: holes });
});
const importHoles = catchAsync(async (req, res) => {
  if (req.files.length <= 0) throw new BadRequestError();
  const [data, error] = await getDataFromXlsx(req.files[0].buffer, holeSchema);
  console.log(error);
  if (error) throw error;
  const holes = data.map((hole) => ({
    hole_num: hole['hole'],
    par: hole['par'],
    yards: hole['yards'],
  }));

  const _holes = await holeService.createManyHole(holes, req.params.golfCourseId);
  res.status(httpStatus.CREATED).send({ result: _holes });
});
module.exports = {
  createHole,
  updateHole,
  getHolesByGolfCourse,
  getHolesByGolfCourseAndHoleNum,
  createManyHole,
  importHoles,
};
