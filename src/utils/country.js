const { alpha2ToAlpha3, isValid } = require('i18n-iso-countries');
const { BadRequestError } = require('./ApiError');
const { PLAYER_LEVEL } = require('../config/constant');
const { Player } = require('../models/schema');
const { Op } = require('sequelize');
const getFlag = (country) => process.env.APP_URL + '/static/images/country_' + country.toLowerCase() + '.png';
const genVGA = async (country, level, count) => {
  if (!isValid(country)) throw BadRequestError('Invalid country');
  country = country.length === 2 ? alpha2ToAlpha3(country) : country;
  count = count < 1000 ? String(10000 + count).slice(1) : String(count).slice(0, 4);
  if (isValid(country)) {
    if (country.length === 2) {
      return `${country}_${count}${level}`;
    }
    if (country.length === 3) {
      return `${country}_${count}${level}`;
    }
  }
};
module.exports = {
  getFlag,
  genVGA,
};
