const Joi = require('joi');

const playerSchema = Joi.object({
  'name-golfer': Joi.string().required(),
  code: Joi.any(),
  avatar: Joi.any(),
  group: Joi.string(),
  flightname: Joi.any(),
  path1: Joi.any(),
  path2: Joi.any(),
  slope_course: Joi.any(),
  teetime: Joi.string(),
  'start-hole': Joi.any(),
  sex: Joi.any(),
  Index: Joi.any(),
  hdc: Joi.any(),
  is_show: Joi.any(),
  country: Joi.any(),
  age: Joi.number(),
  status: Joi.any(),
  type_team_matchplay: Joi.any(),
  status_day: Joi.any(),
  note: Joi.any(),
  club: Joi.any(),
  birth: Joi.any(),
  height: Joi.any(),
  turnpro: Joi.any(),
  weight: Joi.any(),
  driverev: Joi.any(),
  putting: Joi.any(),
  best: Joi.any(),
  birthplace: Joi.any(),
  level: Joi.any(),
  vga: Joi.any(),
});
const teetimeSchema = Joi.object({
  'name-golfer': Joi.string().required(),
  flight: Joi.any().required(),
  tee: Joi.number().required(),
  time: Joi.string().required(),
});
const holeSchema = Joi.object({
  hole: Joi.number().required(),
  par: Joi.number().required(),
  yards: Joi.number().required(),
});
const groupSchema = Joi.object({
  team: Joi.string().required(),
  type: Joi.string().required(),
  match: Joi.number().required(),
  'name-golfer': Joi.string().required(),
});
module.exports = {
  playerSchema,
  teetimeSchema,
  holeSchema,
  groupSchema,
};
