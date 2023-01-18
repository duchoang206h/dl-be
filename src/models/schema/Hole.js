const { Base } = require('./Base');
const Sequelize = require('sequelize');

class Hole extends Base {
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
        hole_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        course_id: Sequelize.INTEGER,
        hole_num: Sequelize.INTEGER,
        par: Sequelize.INTEGER,
      },
      {
        sequelize,
        modelName: 'Hole',
        freezeTableName: true,
        tableName: 'holes',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  Hole,
};
