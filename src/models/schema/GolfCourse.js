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
    GolfCourse.hasMany(models.Course, { foreignKey: 'golf_course_id', as: 'courses', sourceKey: 'golf_course_id' });
    GolfCourse.hasMany(models.Hole, { foreignKey: 'golf_course_id', as: 'holes', sourceKey: 'golf_course_id' });
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
        total_hole: Sequelize.INTEGER,
        total_par: Sequelize.INTEGER,
        slope: Sequelize.INTEGER,
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
