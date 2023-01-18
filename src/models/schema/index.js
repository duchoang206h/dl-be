const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
const { Course } = require('./Course');
const { GolfCourse } = require('./GolfCourse');
const { Hole } = require('./Hole');
const { Penalty } = require('./Penalty');
const { Player } = require('./Player');
const { Round } = require('./Round');
const { Score } = require('./Score');
const { TeeTimeGroup } = require('./TeeTimeGroup');
const { TeeTime } = require('./Teetime');
const { User } = require('./User');
const { Token } = require('./Token');
const db = {};
const models = {
  Course,
  GolfCourse,
  Hole,
  Penalty,
  Player,
  Round,
  Score,
  TeeTime,
  TeeTimeGroup,
  User,
  Token,
};
const sequelize = new Sequelize(process.env.DB_URL, { dialect: 'mysql' });

Object.keys(models).forEach((x) => {
  models[x].init(sequelize);
});
Object.keys(models).forEach((x) => {
  models[x].associate(sequelize);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  sequelize,
  Sequelize,
  Course,
  GolfCourse,
  Hole,
  Penalty,
  Player,
  Round,
  Score,
  TeeTime,
  TeeTimeGroup,
  User,
  Token,
};
