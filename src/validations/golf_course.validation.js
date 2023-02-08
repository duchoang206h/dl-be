const Joi = require('joi');
const { COURSE_TYPE } = require('../config/constant');

const createGolfCourse = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slope: Joi.number().required(),
    total_hole: Joi.number().required(),
    total_par: Joi.number().required(),
    address: Joi.string(),
  }),
};
module.exports = {
  createGolfCourse,
};
