const Joi = require('joi');
const { COURSE_TYPE } = require('../config/constant');

const createCourse = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    event_date: Joi.string(),
    total_prize: Joi.string(),
    description: Joi.string(),
    total_round: Joi.number().required(),
    total_hole: Joi.number().required(),
  }),
};
module.exports = {
  createCourse,
};
