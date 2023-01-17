const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GolfCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GolfCourse.init(
    {
      golf_course_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'GolfCourse',
      freezeTableName: true,
      tableName: 'golfcourses',
      timestamps: true,
    }
  );
  return GolfCourse;
};
