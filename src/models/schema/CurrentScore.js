const { Base } = require('./Base');
const Sequelize = require('sequelize');

class CurrentScore extends Base {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    CurrentScore.belongsTo(models.Player, {
      foreignKey: 'player_id',
      targetKey: 'player_id',
      as: 'player',
    });
    CurrentScore.belongsTo(models.Hole, {
      foreignKey: 'hole_id',
      targetKey: 'hole_id',
      as: 'hole',
    });
  }
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        num_putt: Sequelize.INTEGER,
        hole_id: Sequelize.INTEGER,
        course_id: Sequelize.INTEGER,
        score_type: Sequelize.STRING,
        round_num: Sequelize.INTEGER,
        match_num: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'CurrentScore',
        freezeTableName: true,
        tableName: 'currentscores',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  CurrentScore,
};
