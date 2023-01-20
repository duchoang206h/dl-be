const bcrypt = require('bcryptjs');
const saltRound = 10;
const hashPassword = (password) => bcrypt.hashSync(password, saltRound);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
console.log(hashPassword('123456'));
module.exports = {
  hashPassword,
  comparePassword,
};
