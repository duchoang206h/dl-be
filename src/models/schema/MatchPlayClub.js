const { PLAYER_STATUS, PLAYER_LEVEL } = require('../../config/constant');
const { getFlag } = require('../../utils/country');
const { Base } = require('./Base');
const Sequelize = require('sequelize');

class MatchPlayClub extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    MatchPlayClub.belongsTo(models.Course, {
      as: 'course',
      foreignKey: 'course_id',
      targetKey: 'course_id',
    });
    MatchPlayClub.hasMany(models.MatchPlayTeam, {
      as: 'teams',
      foreignKey: 'matchplay_club_id',
      sourceKey: 'matchplay_club_id',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        matchplay_club_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        course_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        avatar: Sequelize.STRING,
        avatar_url: {
          type: Sequelize.VIRTUAL,
          get() {
            return process.env.APP_URL + '/static/images/' + this.avatar;
          },
        },
        last_win: {
          type: Sequelize.STRING,
          defaultValue: false,
        },
        win_by_playoff: {
          type: Sequelize.STRING,
          defaultValue: false,
        },
        total_player: Sequelize.INTEGER,
        type: {
          type: Sequelize.STRING,
          defaultValue: 'host',
        },
      },
      {
        sequelize,
        modelName: 'MatchPlayClub',
        freezeTableName: true,
        tableName: 'matchplayclubs',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  MatchPlayClub,
};