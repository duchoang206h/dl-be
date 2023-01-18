const { Base } = require('./Base');
const Sequelize = require('sequelize');

class Player extends Base {
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
          autoIncrement: true,
          primaryKey: true,
        },
        course_id: Sequelize.INTEGER,
        fullname: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        country: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Player',
        freezeTableName: true,
        tableName: 'players',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Player,
};
