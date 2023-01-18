const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { getDataFromXlsx } = require('../services/xlsxService');
const { playerSchema } = require('../validations/xlsx.validation');
const db = require('../models/schema');
const importPlayers = catchAsync(async (req, res) => {
  const [data, error] = await getDataFromXlsx(req.files[0].buffer, playerSchema);
  if (error) throw error;
  await db.Player.createMany(data);
  res.status(httpStatus.CREATED).send();
});
module.exports = { importPlayers };
