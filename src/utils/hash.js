const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const saltRound = 10;
const hashPassword = (password) => bcrypt.hashSync(password, saltRound);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
const randomString = (length) => crypto.randomBytes(Math.floor(length / 2)).toString('hex');
module.exports = {
  hashPassword,
  comparePassword,
  randomString,
};
