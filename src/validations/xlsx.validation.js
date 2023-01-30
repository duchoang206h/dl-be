const Joi = require('joi');

const playerSchema = Joi.object({
  'name-golfer': Joi.string().required(),
  code: Joi.required(),
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
});
const teetimeSchema = Joi.object({
  'name-golfer': Joi.string().required(),
  group: Joi.number().required(),
  tee: Joi.number().required(),
  time: Joi.string().required(),
});
module.exports = {
  playerSchema,
  teetimeSchema,
};
