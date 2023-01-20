const { getFlag } = require('../../utils/country');
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
    Player.hasMany(models.Score, { as: 'scores', foreignKey: 'player_id', sourceKey: 'player_id' });
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
        flag: {
          type: Sequelize.VIRTUAL,
          get() {
            return getFlag(this.country);
          },
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
