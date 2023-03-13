const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { ApiError } = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { Token } = require('../models/schema');
const { ROLE } = require('../config/constant');
/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret, { algorithm: 'HS256' });
};
/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};
const generateAuthTokens = async (user, role) => {
  const accessTokenExpires = moment().add(role === ROLE.CADDIE ? 7200 : config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.user_id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(role === ROLE.CADDIE ? 7200 : config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.user_id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, user.user_id, refreshTokenExpires, tokenTypes.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};
const jwtVerify = (token) => jwt.verify(token, config.jwt.secret);
module.exports = {
  generateToken,
  verifyToken,
  saveToken,
  generateAuthTokens,
  jwtVerify,
};
