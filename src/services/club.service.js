const { MatchPlayClub } = require('../models/schema');
const { uploadSingleFile } = require('./upload.service');

const updateClub = async (clubId, data) => {
  if (data.file) {
    return uploadClubImage(clubId, data.file);
  }
  return MatchPlayClub.update(data, { where: { matchplay_club_id: clubId } });
};
const uploadClubImage = async (clubId, file) => {
  const path = await uploadSingleFile(file);
  const clubs = await MatchPlayClub.update({ avatar: path }, { where: { matchplay_club_id: clubId } });
  return clubs;
};
const getClubByCourseId = async (courseId) =>
  MatchPlayClub.findAll({ where: { course_id: courseId }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
module.exports = {
  updateClub,
  uploadClubImage,
  getClubByCourseId,
};
