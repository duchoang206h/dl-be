const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const saltRound = 10;
require('dotenv').config()
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
const encodeUri = (url) => encodeURIComponent(url);
const decodeUri = (url) => decodeURIComponent(url);
const encryptAes = (message, secret = process.env.AES_SECRET) => {
  console.log({ secret });
  return CryptoJS.AES.encrypt(message, secret).toString();
};
const decryptAes = (message, secret = process.env.AES_SECRET) => {
  const decryptedMessage = CryptoJS.AES.decrypt(message, secret);
  return decryptedMessage.toString(CryptoJS.enc.Utf8);
};
module.exports = {
  getCookieConfig,
  hashPassword,
  comparePassword,
  randomString,
  encodeUri,
  decodeUri,
  encryptAes,
  decryptAes,
};
