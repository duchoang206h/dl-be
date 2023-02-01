const Joi = require('joi');
const { COURSE_TYPE } = require('../config/constant');

const createCourse = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    start_date: Joi.string(),
    end_date: Joi.string(),
    total_prize: Joi.string(),
    description: Joi.string(),
    total_round: Joi.number().required(),
    golf_course_id: Joi.number().required(),
    color: Joi.string().required(),
  }),
};
const uploadPhoto = {
  body: Joi.object().keys({
    type: Joi.string().allow('logo', 'main_photo').required(),
  }),
};
module.exports = {
  createCourse,
  uploadPhoto,
};
