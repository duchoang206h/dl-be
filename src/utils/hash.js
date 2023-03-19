const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const saltRound = 10;
const hashPassword = (password) => bcrypt.hashSync(password, saltRound);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
const randomString = (length) => crypto.randomBytes(Math.floor(length / 2)).toString('hex');
const getCookieConfig = () => {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES) * 60 * 1000,
  };
};
module.exports = {
  getCookieConfig,
  hashPassword,
  comparePassword,
  randomString,
};
