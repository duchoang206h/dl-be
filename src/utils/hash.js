const bcrypt = require('bcryptjs');
const saltRound = 10;
const hashPassword = (password) => bcrypt.hashSync(password, saltRound);
const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
module.exports = {
  hashPassword,
  comparePassword,
};
