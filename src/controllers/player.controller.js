const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { getDataFromXlsx } = require('../services/xlsxService');
const { playerSchema } = require('../validations/xlsx.validation');
const { playerService } = require('../services');
const { BadRequestError } = require('../utils/ApiError');
const { INVALID_GOLFER_CODE, INVALID_GOLFER_LEVEL, INVALID_COUNTRY_CODE } = require('../utils/errorMessage');
const { isValid } = require('i18n-iso-countries');
const { PLAYER_LEVEL } = require('../config/constant');
const { genVGA } = require('../utils/country');
const { Player } = require('../models/schema');
const { Op } = require('sequelize');
const { exportPlayerByCourseId } = require('../services/player.service');
const path = require('path');
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
    level: player['level'],
    vga: player['vga'],
    course_id: req.params.courseId,
  }));
  const duplicatesCode = {};
  for (let i = 0; i < players.length; i++) {
    if (players[i].vga) {
      if (duplicatesCode.hasOwnProperty(players[i].vga)) throw new BadRequestError(INVALID_GOLFER_CODE);
      duplicatesCode[players[i].vga] = true;
    }
    if (!isValid(players[i].country)) throw new BadRequestError(INVALID_COUNTRY_CODE);
    if (players[i].level !== PLAYER_LEVEL.AMATEUR && players[i].level !== PLAYER_LEVEL.PROFESSIONAL)
      throw new BadRequestError(INVALID_GOLFER_LEVEL);
    if (!players[i].vga) {
      const suffix = players[i].level === PLAYER_LEVEL.AMATEUR ? 'A' : 'P';
      let count = await Player.count({
        where: {
          vga: {
            [Op.like]: `${players[i].country}%${suffix}`,
          },
        },
      });
      players[i].vga = await genVGA(players[i].country, suffix, count + 1);
    }
  }
  await playerService.createManyPlayer(players);
  res.status(httpStatus.CREATED).send();
});
const getAllPlayer = catchAsync(async (req, res) => {
  const players = await playerService.getAllPlayer(req.params.courseId, req.query);
  return res.status(httpStatus.OK).json({ result: players });
});
const uploadAvatar = catchAsync(async (req, res) => {
  const players = await playerService.uploadAvatar(req.files[0], {
    courseId: req.params.courseId,
    playerId: req.params.playerId,
  });
  return res.status(httpStatus.OK).json({ result: players });
});
const getPlayer = catchAsync(async (req, res) => {
  const player = await playerService.getPlayer(req.params.courseId, req.params.playerId);
  return res.status(httpStatus.OK).json({ result: player });
});
const updatePlayer = catchAsync(async (req, res) => {
  const player = await playerService.updatePlayer(req.body, {
    courseId: req.params.courseId,
    playerId: req.params.playerId,
  });
  return res.status(httpStatus.OK).json({ result: player });
});
const exportPlayer = catchAsync(async (req, res) => {
  console.log(req.params.courseId);
  await exportPlayerByCourseId(req.params.courseId);
  res.download(path.resolve(__dirname, '..', '..', 'data/course_player.xlsx'), 'course_player.xlsx');
});
module.exports = { importPlayers, getAllPlayer, getPlayer, updatePlayer, uploadAvatar, exportPlayer };
