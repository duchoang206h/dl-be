const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { getDataFromXlsx } = require('../services/xlsxService');
const { playerSchema } = require('../validations/xlsx.validation');
const { playerService } = require('../services');
const importPlayers = catchAsync(async (req, res) => {
  const [data, error] = await getDataFromXlsx(req.files[0].buffer, playerSchema);
  if (error) throw error;
  const players = data.map((player) => ({
    fullname: player['name-golfer'],
    country: player['country'],
    code: player['code'],
    avatar: player['avatar'],
    club: player['club'],
    group: player['group'],
    sex: player['sex'],
    age: player['age'],
    status_day: player['status_day'],
    note: player['note'],
    birth: player['birth'],
    height: player['height'],
    turnpro: player['turnpro'],
    weight: player['weight'],
    driverev: player['driverev'],
    putting: player['putting'],
    best: player['best'],
    is_show: player['is_show'],
    course_id: req.params.courseId,
  }));
  await playerService.createManyPlayer(players);
  res.status(httpStatus.CREATED).send();
});
const getAllPlayer = catchAsync(async (req, res) => {
  const players = await playerService.getAllPlayer(req.query);
  return res.status(httpStatus.OK).json({ result: players });
});
const getPlayer = catchAsync(async (req, res) => {
  const player = await playerService.getPlayer(req.params.courseId, req.params.playerId);
  return res.status(httpStatus.OK).json({ result: player });
});
module.exports = { importPlayers, getAllPlayer, getPlayer };
