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
const { Image } = require('./Image');
const { TeeTimeGroupPlayer } = require('./TeetimeGroupPlayer');
const { CurrentScore } = require('./CurrentScore');
const { Match } = require('./Match');
const { MatchPlayTeam } = require('./MatchPlayTeam');
const { MatchPlayTeamPlayer } = require('./MatchPlayTeamPlayer');
const { MatchPlayClub } = require('./MatchPlayClub');
const { MatchPlayVersus } = require('./MatchPlayVersus');
const { MatchPlayScore } = require('./MatchPlayerScore');
const db = {};
const models = {
  Image,
  Course,
  GolfCourse,
  Hole,
  Penalty,
  TeeTimeGroup,
  TeeTime,
  TeeTimeGroupPlayer,
  Player,
  Round,
  Score,
  User,
  Token,
  CurrentScore,
  Match,
  MatchPlayTeam,
  MatchPlayTeamPlayer,
  MatchPlayScore,
  MatchPlayClub,
  MatchPlayVersus,
};
const sequelize = new Sequelize(process.env.DB_URL, { dialect: 'mysql', logging: false });
Object.keys(models).forEach((x) => {
  models[x].init(sequelize);
});
Object.keys(models).forEach((x) => {
  models[x].associate(models);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
