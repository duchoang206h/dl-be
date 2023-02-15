const { PLAYER_STATUS, PLAYER_LEVEL } = require('../../config/constant');
const { getFlag } = require('../../utils/country');
const { Base } = require('./Base');
const Sequelize = require('sequelize');

class MatchPlayGroup extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    MatchPlayGroup.belongsTo(models.MatchPlayTeam, {
      as: 'team',
      foreignKey: 'matchplay_team_ids',
      targetKey: 'matchplay_team_id',
    });
    MatchPlayGroup.hasMany(models.MatchPlayGroupPlayer, {
      foreignKey: 'matchplay_group_id',
      sourceKey: 'matchplay_group_id',
      as: 'group_player',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        matchplay_group_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        matchplay_team_id: Sequelize.INTEGER,
        match_num: Sequelize.INTEGER,
        round_num: Sequelize.INTEGER,
        course_id: Sequelize.INTEGER,
        type: Sequelize.STRING,
        total_player: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'MatchPlayGroup',
        freezeTableName: true,
        tableName: 'matchplaygroups',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  MatchPlayGroup,
};
