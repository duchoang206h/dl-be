const { PLAYER_STATUS, PLAYER_LEVEL } = require('../../config/constant');
const { getFlag } = require('../../utils/country');
const { Base } = require('./Base');
const Sequelize = require('sequelize');

class MatchPlayTeamPlayer extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    MatchPlayTeamPlayer.belongsTo(models.MatchPlayTeam, {
      as: 'team',
      foreignKey: 'matchplay_team_id',
      targetKey: 'matchplay_team_id',
    });
    MatchPlayTeamPlayer.hasOne(models.Player, {
      as: 'players',
      foreignKey: 'player_id',
      sourceKey: 'player_id',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        matchplay_team_id: Sequelize.INTEGER,
        player_id: {
          type: Sequelize.INTEGER,
          references: {
            key: 'player_id',
            model: 'players',
          },
        },
      },
      {
        sequelize,
        modelName: 'MatchPlayTeamPlayer',
        freezeTableName: true,
        tableName: 'matchplayteamplayers',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  MatchPlayTeamPlayer,
};
