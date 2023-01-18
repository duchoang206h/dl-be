const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { getDataFromXlsx } = require('../services/xlsxService');
const { playerSchema } = require('../validations/xlsx.validation');
const { playerService } = require('../services');
const importPlayers = catchAsync(async (req, res) => {
  const [data, error] = await getDataFromXlsx(req.files[0].buffer, playerSchema);
  if (error) throw error;
  const players = data.map((player) => ({
    fullname: player['Full name'],
    country: player['Country'],
    course_id: req.params.courseId,
  }));
  await playerService.createManyPlayer(players);
  res.status(httpStatus.CREATED).send();
});
const getAllPlayer = catchAsync(async (req, res) => {
  const players = await playerService.getAllPlayer(req.query);
  return res.status(httpStatus.OK).json({ result: players });
});
module.exports = { importPlayers, getAllPlayer };
