const { Base } = require('./Base');
const Sequelize = require('sequelize');

class GolfCourse extends Base {
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
        golf_course_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: Sequelize.STRING,
        address: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'GolfCourse',
        freezeTableName: true,
        tableName: 'golfcourses',
        timestamps: true,
      }
    );
  }
}
module.exports = {
  GolfCourse,
};
