const { Base } = require('./Base');
const Sequelize = require('sequelize');

class PlayerFinishRound extends Base {
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
        player_id: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        round_num: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        finished: Sequelize.BOOLEAN
      },
      {
        sequelize,
        modelName: 'PlayerFinishRound',
        freezeTableName: true,
        tableName: 'playerfinishround',
      }
    );
  }
}
module.exports = {
  PlayerFinishRound,
};
