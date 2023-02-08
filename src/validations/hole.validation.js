const Joi = require('joi');

const createHole = {
  body: Joi.object().keys({
    hole_num: Joi.number().required(),
    par: Joi.number().required(),
    yards: Joi.number().required(),
  }),
};
const createHoleMany = {
  body: Joi.object().keys({
    holes: Joi.array().required(),
  }),
};
const updateHole = {
  body: Joi.object().keys({
    par: Joi.number(),
    yards: Joi.number(),
  }),
};
module.exports = {
  createHole,
  updateHole,
  createHoleMany,
};
