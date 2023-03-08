const { PLAYER_STATUS, PLAYER_LEVEL } = require('../../config/constant');
const { getFlag } = require('../../utils/country');
const { Base } = require('./Base');
const Sequelize = require('sequelize');

class MatchPlayVersus extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    MatchPlayVersus.belongsTo(models.Course, {
      as: 'course',
      foreignKey: 'course_id',
      targetKey: 'course_id',
    });
    MatchPlayVersus.hasOne(models.MatchPlayTeam, {
      as: 'host_team',
      foreignKey: 'matchplay_team_id',
      sourceKey: 'host',
    });
    MatchPlayVersus.hasOne(models.MatchPlayTeam, {
      as: 'guest_team',
      foreignKey: 'matchplay_team_id',
      sourceKey: 'guest',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        matchplay_versus_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        course_id: Sequelize.INTEGER,
        round_num: Sequelize.INTEGER,
        match_num: Sequelize.INTEGER,
        type: Sequelize.STRING,
        host: Sequelize.INTEGER,
        guest: Sequelize.INTEGER,
        tee: Sequelize.INTEGER,
        time: Sequelize.STRING,
        finished: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        winner: Sequelize.STRING,
        result: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'MatchPlayVersus',
        freezeTableName: true,
        tableName: 'matchplayversuses',
        timestamps: true,
        indexes: [{ fields: ['round_num'] }],
      }
    );
  }
}
module.exports = {
  MatchPlayVersus,
};
