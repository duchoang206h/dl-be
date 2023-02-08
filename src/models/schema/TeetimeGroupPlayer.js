const { Base } = require('./Base');
const Sequelize = require('sequelize');

class TeeTimeGroupPlayer extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    TeeTimeGroupPlayer.belongsTo(models.TeeTimeGroup, {
      foreignKey: 'teetime_group_id',
      targetKey: 'teetime_group_id',
    });
    TeeTimeGroupPlayer.hasOne(models.Player, {
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
          primaryKey: true,
          autoIncrement: true,
        },
        teetime_group_id: {
          type: Sequelize.INTEGER,
        },
        player_id: {
          type: Sequelize.INTEGER,
        },
      },
      {
        sequelize,
        modelName: 'TeeTimeGroupPlayer',
        freezeTableName: true,
        tableName: 'teetimegroupplayers',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  TeeTimeGroupPlayer,
};
