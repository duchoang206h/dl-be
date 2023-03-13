const { PLAYER_STATUS, PLAYER_LEVEL } = require('../../config/constant');
const { getFlag } = require('../../utils/country');
const { Base } = require('./Base');
const Sequelize = require('sequelize');

class MatchPlayScore extends Base {
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
        matchplay_group_id: Sequelize.INTEGER,
        player_id: Sequelize.INTEGER,
        course_id: Sequelize.INTEGER,
        num_putt: Sequelize.INTEGER,
        hole_num: Sequelize.INTEGER,
        round_num: Sequelize.INTEGER,
        match_num: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'MatchPlayScore',
        freezeTableName: true,
        tableName: 'matchplayscores',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  MatchPlayScore,
};
