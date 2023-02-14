const { PLAYER_STATUS, PLAYER_LEVEL } = require('../../config/constant');
const { getFlag } = require('../../utils/country');
const { Base } = require('./Base');
const Sequelize = require('sequelize');

class MatchPlayTeam extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    MatchPlayTeam.belongsTo(models.Course, {
      as: 'course',
      foreignKey: 'course_id',
      targetKey: 'course_id',
    });
    MatchPlayTeam.hasMany(models.MatchPlayTeam, {
      as: 'groups',
      foreignKey: 'matchplay_team_id',
      sourceKey: 'matchplay_team_id',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        matchplay_team_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        course_id: Sequelize.INTEGER,
        name: Sequelize.STRING,
        total_player: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'MatchPlayTeam',
        freezeTableName: true,
        tableName: 'matchplayteams',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  MatchPlayTeam,
};
