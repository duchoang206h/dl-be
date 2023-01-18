const { Base } = require('./Base');
const Sequelize = require('sequelize');

class Score extends Base {
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
        course_id: Sequelize.INTEGER,
        hole_id: Sequelize.INTEGER,
        round_id: Sequelize.INTEGER,
        player_id: Sequelize.INTEGER,
        num_putt: Sequelize.INTEGER,
        score_type: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'Score',
        freezeTableName: true,
        tableName: 'scores',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Score,
};
