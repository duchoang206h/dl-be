const { PLAYER_STATUS } = require('../../config/constant');
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
    Player.belongsTo(models.Course, {
      foreignKey: 'course_id',
      targetKey: 'course_id',
    });
    Player.belongsTo(models.TeeTimeGroupPlayer, {
      foreignKey: 'player_id',
      targetKey: 'player_id',
      as: 'teetime_group_player',
    });
    /* Player.belongsToMany(models.TeeTimeGroup, {
      through: { model: models.TeeTimeGroupPlayer },
      foreignKey: 'player_id',
      otherKey: 'player_id',
    }); */
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
        age: Sequelize.INTEGER,
        sex: Sequelize.BOOLEAN,
        code: Sequelize.STRING,
        club: Sequelize.STRING,
        group: Sequelize.STRING,
        avatar: Sequelize.STRING,
        status_day: Sequelize.STRING,
        note: Sequelize.STRING,
        birth: Sequelize.STRING,
        height: Sequelize.STRING,
        turnpro: Sequelize.STRING,
        weight: Sequelize.STRING,
        driverev: Sequelize.STRING,
        putting: Sequelize.STRING,
        best: Sequelize.STRING,
        is_show: Sequelize.BOOLEAN,
        status: {
          type: Sequelize.STRING,
          defaultValue: PLAYER_STATUS.NORMAL,
        },
        flag: {
          type: Sequelize.VIRTUAL,
          get() {
            return this.country ? getFlag(this.country) : null;
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
