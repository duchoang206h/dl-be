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
  }
  static init(sequelize) {
    return super.init(
      {
        teetime_group_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        player_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
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
