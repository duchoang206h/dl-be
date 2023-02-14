const { PLAYER_STATUS, PLAYER_LEVEL } = require('../../config/constant');
const { getFlag } = require('../../utils/country');
const { Base } = require('./Base');
const Sequelize = require('sequelize');

class MatchPlayGroupPlayer extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    MatchPlayGroupPlayer.belongsTo(models.MatchPlayGroup, {
      as: 'group',
      foreignKey: 'matchplay_group_id',
      targetKey: 'matchplay_group_id',
    });
    MatchPlayGroupPlayer.hasMany(models.Player, {
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
        matchplay_group_id: Sequelize.INTEGER,
        player_id: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'MatchPlayGroupPlayer',
        freezeTableName: true,
        tableName: 'matchplaygroupplayers',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  MatchPlayGroupPlayer,
};
