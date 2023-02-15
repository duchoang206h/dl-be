const { Base } = require('./Base');
const Sequelize = require('sequelize');

class Match extends Base {
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
        match_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        match_num: Sequelize.INTEGER,
        course_id: Sequelize.INTEGER,
        round_num: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'Match',
        freezeTableName: true,
        tableName: 'matchs',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Match,
};
