const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, clubService } = require('../services');

const getCourseById = catchAsync(async (req, res) => {
  const result = await clubService.getClubByCourseId(req.params.courseId);
  res.status(httpStatus.OK).send({ result });
});
const updateClub = catchAsync(async (req, res) => {
  const courseClubs = await clubService.getClubByCourseId(req.params.courseId);
  const result = await clubService.updateClub(
    req.params.clubId,
    courseClubs.find((club) => String(club.dataValues.matchplay_club_id) !== req.params.clubId).dataValues.matchplay_club_id,
    { file: req.files?.[0], ...req.body }
  );
  res.status(httpStatus.OK).send({ result });
});
module.exports = {
  getCourseById,
  updateClub,
};
