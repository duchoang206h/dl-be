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
const updateCourse = {
  body: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string(),
    start_date: Joi.string(),
    end_date: Joi.string(),
    total_prize: Joi.string(),
    description: Joi.string(),
    total_round: Joi.number(),
    golf_course_id: Joi.number(),
    color: Joi.string(),
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
  updateCourse,
};
