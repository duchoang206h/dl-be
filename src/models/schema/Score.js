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
    Score.belongsTo(models.Hole, {
      foreignKey: 'hole_id',
      targetKey: 'hole_id',
    });
    Score.belongsTo(models.Round, {
      foreignKey: 'round_id',
      targetKey: 'round_id',
    });
    Score.belongsTo(models.Player, {
      foreignKey: 'player_id',
      targetKey: 'player_id',
    });
    Score.belongsTo(models.Course, {
      foreignKey: 'course_id',
      targetKey: 'course_id',
    });
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
