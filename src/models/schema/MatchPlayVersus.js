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
        from: Sequelize.INTEGER,
        to: Sequelize.INTEGER,
        finish: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        winner: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'MatchPlayVersus',
        freezeTableName: true,
        tableName: 'matchplayversuses',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  MatchPlayVersus,
};
