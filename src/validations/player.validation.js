const Joi = require('joi');

const updatePlayer = {
  body: Joi.object().keys({
    status: Joi.string(),
    code: Joi.string(),
    fullname: Joi.string(),
    country: Joi.string(),
    age: Joi.number(),
    sex: Joi.boolean(),
    club: Joi.string(),
    group: Joi.string(),
    avatar: Joi.string(),
    status_day: Joi.string(),
    note: Joi.string(),
    birth: Joi.string(),
    height: Joi.string(),
    weight: Joi.string(),
    turnpro: Joi.string(),
    driverev: Joi.string(),
    putting: Joi.string(),
    best: Joi.string(),
  }),
};
module.exports = {
  updatePlayer,
};
