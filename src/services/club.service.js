const { MatchPlayClub, sequelize } = require('../models/schema');
const { uploadSingleFile } = require('./upload.service');

const updateClub = async (clubId, competitorClubId, data) => {
  console.log('aaaa', { clubId, competitorClubId, data })
  if (data.file) {
    return uploadClubImage(clubId, data.file);
  }
  const t = await sequelize.transaction();
  try {
    if (data.last_win) {
      await MatchPlayClub.update({ last_win: false }, { where: { matchplay_club_id: competitorClubId }, transaction: t },);
    }
    if (data.win_by_playoff) {
      await MatchPlayClub.update({ win_by_playoff: false }, { where: { matchplay_club_id: competitorClubId }, transaction: t });
    }

    await MatchPlayClub.update(data, { where: { matchplay_club_id: clubId }, transaction: t })
    await t.commit();
    return true;
  } catch (error) {
    await t.rollback();

  }
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
